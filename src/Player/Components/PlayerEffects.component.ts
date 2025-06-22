import { NCS, Node, NodeCursor } from "@amodx/ncs/";
import { WorldCursor } from "@divinevoxel/vlox/World";
import { FirstPersonCameraComponent } from "@dvegames/vlox/Babylon/Cameras/FirstPersonCamera.component";
import { CameraProviderComponent } from "@dvegames/vlox/Babylon/Providers/CameraProvider.component";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { TransformComponent } from "@dvegames/vlox/Transform.component";

export const PlayerEffectsComponent = NCS.registerComponent({
  type: "player-effects",
  init(component) {
    const { renderer, scene } = BabylonContext.getRequired(
      component.node
    ).data!;

    const tool = new WorldCursor();
    const transform = TransformComponent.getRequired(component.node)!;
    const position = transform.schema.position;
    const camera = CameraProviderComponent.getRequiredChild(component.node)!
      .data.camera;
    const fog = renderer.voxelScene.options.fog;

    scene.registerBeforeRender(() => {
      tool.setFocalPoint(0, position.x >> 0, position.y >> 0, position.z >> 0);
      const x = camera.globalPosition.x >> 0;
      const y = camera.globalPosition.y >> 0;
      const z = camera.globalPosition.z >> 0;
      const voxel = tool.getVoxel(x, y, z);
      if (voxel && voxel.substanceTags["dve_is_liquid"]) {
        fog.mode = fog.Modes.Exp;
        fog.density = 0.001;
        fog.start = 40;
        fog.end = 70;
        fog.skyShade = true;
        fog.setColor(26 / 255, 27 / 255, 243 / 255);
      } else {
        fog.mode = fog.Modes.None;
        fog.start = 0;

        fog.skyShade = false;

        fog.setColor(1, 1, 1);
      }
    });
  },
});
