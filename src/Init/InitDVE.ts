import InitDVErenderer from "@divinevoxel/vlox-babylon/Init/Classic/InitDVEBRClassic";
import { StartRenderer } from "@divinevoxel/vlox/Init/StartRenderer";
import { CreateSphere, Engine, Scene } from "@babylonjs/core";
import { textureData } from "Data/TextureData";
import { voxelData } from "Data/VoxelData";
import CreateDisplayIndex from "@divinevoxel/vlox-babylon/Init/CreateDisplayIndex";
import { InitSkybox } from "@divinevoxel/vlox-babylon/Init/Skybox/InitSkybox";
import { RenderSystem } from "Systems/RenderSystem";
import { GameManager } from "Game/GameManager";
import { EngineSettings } from "@divinevoxel/vlox/Settings/EngineSettings";
import LoadingScreen from "UI/Loading";
const worldWorker = new Worker(new URL("../Contexts/World/", import.meta.url), {
  type: "module",
});

const nexusWorker = new Worker(new URL("../Contexts/Nexus", import.meta.url), {
  type: "module",
});
const mesherWorkers: Worker[] = [];
const halfThreads = Math.floor((navigator.hardwareConcurrency - 3) / 2);

for (let i = 0; i < halfThreads; i++) {
  mesherWorkers.push(
    new Worker(new URL("../Contexts/Mesher/", import.meta.url), {
      type: "module",
    }),
  );
}
const generatorWorkers: Worker[] = [];
for (let i = 0; i < halfThreads; i++) {
  generatorWorkers.push(
    new Worker(new URL("../Contexts/Generator/", import.meta.url), {
      type: "module",
    }),
  );
}
export default async function (canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true, {
    disableWebGL2Support: false,
    doNotHandleContextLost: true,
    powerPreference: "high-performance",
    stencil: true,
  });
  engine.enableOfflineSupport = false;
  const glInfo = engine.getGlInfo();
  console.log("Renderer:", glInfo.renderer);
  console.log("Vendor:", glInfo.vendor);
  engine.setSize(window.innerWidth, window.innerHeight);
  window.addEventListener("resize", () => {
    engine.resize();
  });

  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });
  const scene = new Scene(engine, {
    useGeometryUniqueIdsMap: true,
  });
  scene.skipPointerMovePicking = true;
  scene.collisionsEnabled = false;
  scene.autoClear = false;
  scene.autoClearDepthAndStencil = false;

  LoadingScreen.progress.text("Init DVE");
  // EngineSettings.settings.rendererSettings.bufferMode = "single";
  const renderer = await InitDVErenderer({
    textureTypes: [],
    substances: [],
    scene: scene,
    textureData,
  });

  await LoadingScreen.progress.updateProgressPercent(10);

  LoadingScreen.progress.text("Init DVE Babylon Renderer");
  const DVER = await StartRenderer({
    rendererSettings: {
      cpuBound: false,
    },
    voxels: voxelData,
    renderer,
    worldWorker,
    nexusWorker,
    mesherWorkers,
    generatorWorkers,
  });
  await LoadingScreen.progress.updateProgressPercent(20);

  LoadingScreen.progress.text("Create Display Index");
  await CreateDisplayIndex(voxelData);

  await LoadingScreen.progress.updateProgressPercent(50);

  const skybox = InitSkybox({ renderer });
  RenderSystem.scene = scene;
  RenderSystem.engine = engine;
  RenderSystem.renderer = renderer;
  engine.runRenderLoop(() => {
    if (scene.activeCamera) {
      scene.render();
    }

    GameManager.update();
    renderer.beforeRender();
  });
  await LoadingScreen.progress.updateProgressPercent(100);

  LoadingScreen.progress.text("Done");


}
