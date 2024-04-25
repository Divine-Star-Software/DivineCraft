import type { DivineVoxelEngineRender } from "@divinevoxel/core/Contexts/Render";

import type { Mesh } from "@babylonjs/core";
import { PlayerManager } from "../Data/PlayerManager";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { RenderPlayer } from "./RenderPlayer";
import { Vector3, Color3 } from "@babylonjs/core/Maths/";
import "@babylonjs/core/Rendering/edgesRenderer";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { RenderNodes } from "Classes/RednerNodes";
import { Ray } from "@babylonjs/core";
export class PlayerPickCube {
  cube: Mesh;
  cameraPickPostion: Vector3;
  setPickNormals() {
    const position = new Vector3(
      this.player.model.model.position.x,
      this.player.model.model.position.y + PlayerManager.physics.eyeLevel,
      this.player.model.model.position.z
    );
    const camPick = this.player.nodes.scene.pickWithRay(
      new Ray(position, this.cube.position.subtract(position).normalize(), 30)
    );

    if (
      !camPick ||
      !camPick.hit ||
      !camPick.pickedMesh ||
      camPick.faceId === undefined
    )
      return;
    let normal = camPick.pickedMesh.getFacetNormal(camPick.faceId);
    PlayerManager.physics.pick.normal.x = normal.x;
    PlayerManager.physics.pick.normal.y = normal.y;
    PlayerManager.physics.pick.normal.z = normal.z;
  }

  constructor(
    DVER: DivineVoxelEngineRender,
    public nodes: RenderNodes,
    public player: RenderPlayer
  ) {
    const { scene, core } = nodes;

    const cubeMaterial = new StandardMaterial("picker-cube", scene);
    cubeMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2);
    cubeMaterial.alpha = 0.3;
    this.cube = CreateBox(
      "playerblockdisplay",
      {
        size: 1.1,
      },
      scene
    );
    this.cube.isPickable = true;
    this.cube.material = cubeMaterial;

    //  this.cube.parent = core.renderer.foManager.activeNode;
    this.cube.enableEdgesRendering();
    this.cube.edgesWidth = 0.3;
    this.cube.edgesColor.set(0, 0, 0, 0.8);
    this.cube.convertToFlatShadedMesh();
    this.cube.updateFacetData();

    const cameraPickPostion = new Vector3();
    cameraPickPostion.y = PlayerManager.physics.eyeLevel;

    player.nodes.scene.registerBeforeRender(() => {
      this.setPickNormals();
      this.cube.position.x = PlayerManager.physics.pick.position.x + 0.5;
      this.cube.position.y = PlayerManager.physics.pick.position.y + 0.5;
      this.cube.position.z = PlayerManager.physics.pick.position.z + 0.5;


    });
  }
}
