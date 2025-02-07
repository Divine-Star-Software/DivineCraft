import InitDVErenderer from "@divinevoxel/vlox-babylon/Init/Classic/InitDVEBRClassic";
import { StartRenderer } from "@divinevoxel/vlox/Init/StartRenderer";
import { CreateSphere, Engine, Scene } from "@babylonjs/core";

import { textureData } from "Data/TextureData";
import { SceneTool } from "@divinevoxel/vlox-babylon/Tools/SceneTool";

import { voxelData } from "Data/VoxelData";
import { NCS, Node } from "@amodx/ncs";
import CreatePlayer from "./Player/CreatePlayer";
import { BabylonContext } from "@dvegames/vlox/Babylon/Contexts/Babylon.context";
import { GameComponent } from "Game.component";
import { PlayerComponent } from "Player/Components/Player.component";
import { GameScreensComponent } from "Screens/GameScreens.component";
import { UIScreensIds } from "Game.types";
import { ScreenComponent } from "Screens/Screen.component";
import { CreateItemManager } from "Items";
import CreateDisplayIndex from "@divinevoxel/vlox-babylon/Init/CreateDisplayIndex";
import { RendererContext } from "@dvegames/vlox/Core/Contexts/Renderer.context";
const worldWorker = new Worker(new URL("./Contexts/World/", import.meta.url), {
  type: "module",
});

const nexusWorker = new Worker(new URL("./Contexts/Nexus", import.meta.url), {
  type: "module",
});

const constructorWorkers: Worker[] = [];
for (let i = 0; i < navigator.hardwareConcurrency - 3; i++) {
  constructorWorkers.push(
    new Worker(new URL("./Contexts/Constructor/", import.meta.url), {
      type: "module",
    })
  );
}
export default async function (canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true, {
    doNotHandleContextLost: true,
  });
  engine.doNotHandleContextLost = true;
  engine.enableOfflineSupport = false;

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
    constructorWorkers,
  });

  await CreateDisplayIndex(voxelData);

  const skybox = CreateSphere("skyBox", { diameter: 400.0 }, scene);
  skybox.isPickable = false;
  skybox.infiniteDistance = true;
  const skyboxMat = renderer.materials.get("dve_skybox");
  if (skyboxMat) {
    skybox.material = skyboxMat._material;
    skybox.material!.backFaceCulling = false;
  }
  const sceneTool = new SceneTool();
  sceneTool.fog.setDensity(0.000004);
  sceneTool.fog.setColor(1, 1, 1);
  sceneTool.options.doSun(true);
  sceneTool.options.doAO(true);
  sceneTool.options.doRGB(true);
  sceneTool.levels.setSun(0.8);
  sceneTool.levels.setBase(0.01);

  await DVER.threads.world.waitTillTaskExist("create-player");

  const graph = NCS.createGraph();
  BabylonContext.set(graph.root, null, null, {
    scene,
    engine,
  });
  RendererContext.set(graph.root, null, null, {
    dve: DVER,
  });
  const game = GameComponent.set(graph.root);

  const player = await CreatePlayer(DVER, graph);
  game.data.activePlayer = PlayerComponent.getRequired(player);

  const screens = GameScreensComponent.getRequired(
    graph.addNode(
      Node(
        "Game Screens",
        [GameScreensComponent()],
        ...Object.values(UIScreensIds).map((screenId) =>
          Node(screenId, [
            ScreenComponent({
              id: screenId,
            }),
          ])
        )
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

  return game;
}
