import InitDVErenderer from "@divinevoxel/vlox-babylon/Init/Classic/InitDVEBRClassic";
import { StartRenderer } from "@divinevoxel/vlox/Init/StartRenderer";
import { CreateSphere, Engine, Scene } from "@babylonjs/core";
import { textureData } from "Data/TextureData";
import { voxelData } from "Data/VoxelData";
import { NCS, Node } from "@amodx/ncs";
import CreatePlayer from "./Player/CreatePlayer";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { GameContext } from "Game.context";
import { PlayerComponent } from "Player/Components/Player.component";
import { GameScreensComponent } from "Screens/GameScreens.component";
import { UIScreensIds } from "Game.types";
import { ScreenComponent } from "Screens/Screen.component";
import { CreateItemManager } from "Items";
import CreateDisplayIndex from "@divinevoxel/vlox-babylon/Init/CreateDisplayIndex";
import { RendererContext } from "@dvegames/vlox/Contexts/Renderer.context";
import { InitSkybox } from "@divinevoxel/vlox-babylon/Init/Skybox/InitSkybox";
import { VoxelWorldParticlesComponent } from "@dvegames/vlox/Particles/VoxelWorldParticles.component";
import { CreateEnvironment } from "Environment/CreateEnvironment";
import { TransformComponent } from "@dvegames/vlox/Transform.component";
const worldWorker = new Worker(new URL("./Contexts/World/", import.meta.url), {
  type: "module",
});

const nexusWorker = new Worker(new URL("./Contexts/Nexus", import.meta.url), {
  type: "module",
});
const mesherWorkers: Worker[] = [];
const halfThreads = Math.ceil((navigator.hardwareConcurrency - 3) / 2);

for (let i = 0; i < halfThreads; i++) {
  mesherWorkers.push(
    new Worker(new URL("./Contexts/Mesher/", import.meta.url), {
      type: "module",
    })
  );
}
const generatorWorkers: Worker[] = [];
for (let i = 0; i < halfThreads; i++) {
  generatorWorkers.push(
    new Worker(new URL("./Contexts/Generator/", import.meta.url), {
      type: "module",
    })
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

  const renderer = await InitDVErenderer({
    textureTypes: [],
    substances: [],
    scene: scene,
    textureData,
  });

  const cpuBound = new URL(location.href).searchParams.get("cpu-bound");
  const DVER = await StartRenderer({
    rendererSettings: {
      cpuBound: cpuBound ? true : false,
    },
    voxels: voxelData,
    renderer,
    worldWorker,
    nexusWorker,
    mesherWorkers,
    generatorWorkers,
  });

  await CreateDisplayIndex(voxelData);

  const skybox = InitSkybox({ renderer });

  await DVER.threads.world.waitTillTaskExist("create-player");

  const graph = NCS.createGraph();
  BabylonContext.set(graph.root, null, null, {
    scene,
    engine,
    renderer,
  });
  RendererContext.set(graph.root, null, null, {
    dve: DVER,
  });

  const game = GameContext.set(graph.root);
  game.data = {} as any;
  game.data.dver = DVER;
  console.warn(game, game.data);
  game.data.voxelParticles = VoxelWorldParticlesComponent.set(graph.root);
  const player = await CreatePlayer(DVER, graph);
  game.data.activePlayer = PlayerComponent.getRequired(player);

  game.data.environment = CreateEnvironment(graph);
  const transform = TransformComponent.getRequired(player);
  game.data.environment.data.positionAndDirection.data.position =
    transform.schema.position;

  const screens = GameScreensComponent.getRequired(
    graph.addNode(
      Node(
        "Game Screens",
        [GameScreensComponent()],
        Node(UIScreensIds.InGame, [
          ScreenComponent({
            active: true,
            id: UIScreensIds.InGame,
          }),
        ])
      )
    )
  );

  
  game.data.screens = screens;
  setTimeout(() => {
    screens.schema.activeScreen = UIScreensIds.InGame;
  }, 100);

  const items = CreateItemManager(graph);
  game.data.items = items;
  engine.runRenderLoop(() => {
    scene.render();
    graph.update();
  });

  const urlObj = new URL(window.location.href);
  const params = new URLSearchParams(urlObj.search);

  await DVER.threads.world.waitTillTaskExist("world-ready");

  if (params.has("no-world-gen")) {
    DVER.threads.world.runTask("start-world-test", []);
  } else {
    DVER.threads.world.runTask("start-world", []);
  }
  /* 
  setTimeout(() => {
    scene.debugLayer.show({
      showExplorer: true,
      showInspector: true,
      globalRoot: document.getElementById("inspector")!,
    });
  }, 100);
 */
  return graph;
}
