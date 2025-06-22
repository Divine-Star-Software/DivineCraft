import { NCS } from "@amodx/ncs/";
import { PlayerComponent } from "./Player/Components/Player.component";
import { GameScreensComponent } from "Screens/GameScreens.component";
import { ItemRegisterComponent } from "Items/Components";
import { VoxelWorldParticlesComponent } from "@dvegames/vlox/Particles/VoxelWorldParticles.component";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { EnvironmentComponent } from "Environment/Components/Environment.component";
class Data {
  dver: DivineVoxelEngineRender;
  environment: (typeof EnvironmentComponent)["default"];
  activePlayer: (typeof PlayerComponent)["default"];
  screens: (typeof GameScreensComponent)["default"];
  items: (typeof ItemRegisterComponent)["default"];
  voxelParticles: (typeof VoxelWorldParticlesComponent)["default"];
}

export const GameContext = NCS.registerContext<{}, Data>({
  type: "game",
});
