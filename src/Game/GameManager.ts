import { Graph, NCS, Node, NodeCursor } from "@amodx/ncs";
import { GameContext } from "./Game.context";
import { UIScreensIds } from "UI/ScreenIds";
import { CreateItemManager } from "./Init/CreateItems";
import { GameScreensComponent } from "Game/Components/Screens/GameScreens.component";
import { ScreenComponent } from "Game/Components/Screens/Screen.component";
import { CreateEnvironment } from "Game/Init/CreateEnvironment";
import CreatePlayer from "Game/Init/CreatePlayer";
import { VoxelWorldParticlesComponent } from "@dvegames/vlox/Particles/VoxelWorldParticles.component";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { PlayerComponent } from "Game/Components/Player";
import { TransformComponent } from "@dvegames/vlox/Transform.component";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { RendererContext } from "@dvegames/vlox/Contexts/Renderer.context";
import { RenderSystem } from "Systems/RenderSystem";
import { GameSpaceComponent } from "./Components/GameSpace/GameSpace.component";
import { WorldMap } from "Map/WorldMap";

export class GameManager {
  static graph = NCS.createGraph();

  static currentGameNode: NodeCursor;

  static screens: (typeof GameScreensComponent)["default"];
  static init() {
    BabylonContext.set(this.graph.root, null, null, {
      scene: RenderSystem.scene,
      engine: RenderSystem.engine,
      renderer: RenderSystem.renderer,
    });
    RendererContext.set(this.graph.root, null, null, {
      dve: DivineVoxelEngineRender.instance,
    });
    this.screens = GameScreensComponent.getRequired(
      this.graph.addNode(
        Node(
          "Game Screens",
          [GameScreensComponent()],
          ...Object.values(UIScreensIds).map((screenId) =>
            Node(screenId, [
              ScreenComponent({
                id: screenId,
              }),
            ]),
          ),
        ),
      ),
    );
  }

  static update() {
    this.graph.update();
  }

  static async startGame() {
    this.currentGameNode = this.graph.addNode(Node("current-game", []));
    const game = GameContext.set(this.currentGameNode);
    game.data = {} as any;
    const DVER = DivineVoxelEngineRender.instance;
    game.data.DVER = DVER;
    console.warn(game, game.data);
    game.data.voxelParticles = VoxelWorldParticlesComponent.set(
      this.currentGameNode,
    );
    const player = await CreatePlayer(game.data.DVER, this.graph);
    game.data.activePlayer = PlayerComponent.getRequired(player);

    game.data.environment = CreateEnvironment(this.graph);
    const transform = TransformComponent.getRequired(player);
    game.data.environment.data.positionAndDirection.data.position =
      transform.schema.position;

    game.data.screens = this.screens;
    setTimeout(() => {
      this.screens.schema.activeScreen = UIScreensIds.Building;
    }, 100);

    game.data.gameSpace = GameSpaceComponent.set(this.currentGameNode);

    const items = CreateItemManager(this.graph);
    game.data.items = items;

    const urlObj = new URL(window.location.href);
    const params = new URLSearchParams(urlObj.search);

    if (params.has("no-world-gen")) {
      DVER.threads.world.runTask("start-world-test", []);
    } else {
      DVER.threads.world.runTask("start-world", []);
    }

    if (params.has("world-gen-map")) {
      WorldMap();
    }
  }
}
