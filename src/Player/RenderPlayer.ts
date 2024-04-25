import { DivineVoxelEngineRender } from "@divinevoxel/core/Contexts/Render/DivineVoxelEngineRender";

import { PlayerManager } from "./Core/Data/PlayerManager";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { SetUpPlayerData } from "./Core/Data/SetUpPlayerData";
import { RenderNodes } from "../Classes/RednerNodes";
import { RenderPlayer } from "./Core/Render/RenderPlayer";
import { CreateBox } from "@babylonjs/core";
import { SetUpControls } from "./SetUpControls";

export async function InitRenderPlayer(
  DVER: DivineVoxelEngineRender,
  nodes: RenderNodes
) {
  const playerModel = CreateBox("", { width: 0.8, depth: 0.8, height: 2 });

  await SetUpPlayerData(DVER.TC);

  const { camera, scene, core } = nodes;
  PlayerManager.physics.eyeLevel = 0.7;

  camera.position.y =  PlayerManager.physics.eyeLevel;
  playerModel.isVisible = false;
  //move camera to player's eye level
  //camera.position.y = PlayerManager.physics.eyeLevel;
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput");

  camera.minZ = 0.01;
  //set up camera
  const camNode = new TransformNode("camnode", scene as any);
  camera.parent = camNode;
  //@ts-ignore
  camNode.parent = playerModel;

  //set up floating origin
  const oriign = new Vector3();
  scene.onBeforeActiveMeshesEvaluationObservable.add(() => {
    playerModel.position.x = PlayerManager.physics.position.x;
    playerModel.position.y = PlayerManager.physics.position.y;
    playerModel.position.z = PlayerManager.physics.position.z;
  });

  console.log("set up core FO", core, core.renderer);
/*   core.renderer.foManager.setOriginCenter(scene as any, {
    position: oriign as any,
  });
 */
  const renderPlayer = new RenderPlayer(PlayerManager, nodes, {
    model: playerModel,
    camNode: camNode,
  });

  scene.registerBeforeRender(() => {
    renderPlayer.render();
  });

  renderPlayer.active = true;
  SetUpControls(DVER, renderPlayer);
}
