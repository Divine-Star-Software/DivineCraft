import { NCS } from "@amodx/ncs/";
import { PlayerComponent } from "./Components/Player/Player.component";
import { GameScreensComponent } from "Game/Components/Screens/GameScreens.component";
import { ItemRegisterComponent } from "./Components/Inventory";
import { VoxelWorldParticlesComponent } from "@dvegames/vlox/Particles/VoxelWorldParticles.component";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { EnvironmentComponent } from "Game/Components/Environment/Environment.component";
import { GameSpaceComponent } from "./Components/GameSpace/GameSpace.component";
class Data {
  DVER: DivineVoxelEngineRender;
  environment: (typeof EnvironmentComponent)["default"];
  activePlayer: (typeof PlayerComponent)["default"];
  screens: (typeof GameScreensComponent)["default"];
  items: (typeof ItemRegisterComponent)["default"];
  voxelParticles: (typeof VoxelWorldParticlesComponent)["default"];
  gameSpace: (typeof GameSpaceComponent["default"])
}

export const GameContext = NCS.registerContext<{}, Data>({
  type: "game",
});
