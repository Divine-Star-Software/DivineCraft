import { NCS } from "@amodx/ncs/";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Vector3Like } from "@amodx/math";
import { CameraProviderComponent } from "@dvegames/vlox/Babylon/Providers/CameraProvider.component";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { TransformNodeComponent } from "@dvegames/vlox/Babylon/TransformNode.component";
import { Tools } from "@babylonjs/core/Misc/tools";
export const FirstPersonCameraComponent = NCS.registerComponent({
  type: "first-person-camera",
  data: NCS.data<{
    camera: UniversalCamera;
  }>(),
  schema: NCS.schema({
    position: NCS.property(Vector3Like.Create()),
    rotation: NCS.property(Vector3Like.Create()),
  }),
  init(component) {
    const { scene } = BabylonContext.getRequired(component.node).data;
    const tranformComponent = TransformNodeComponent.getRequired(
      component.node
    );

    const camera = new UniversalCamera("", new Vector3(0, 0, 0), scene);
    camera.position.set(...Vector3Like.ToArray(component.schema.position));
    camera.rotation.set(...Vector3Like.ToArray(component.schema.rotation));
    camera.setTarget(Vector3.Zero());
    camera.maxZ = 600;
    camera.fov = Tools.ToRadians(70);
    camera.minZ = 0.1;
    camera.inertia = 0;
    camera.angularSensibility = 1000;
    scene.activeCamera = camera;
    camera.attachControl(scene, true);

    component.data = { camera };
    camera.parent = tranformComponent.data.transformNode.parent;

    camera.position.copyFrom(tranformComponent.data.transformNode.position);
    tranformComponent.data.transformNode.position.set(0, 0, 0);

    tranformComponent.data.transformNode.parent = camera;
    tranformComponent.data.transformNode.computeWorldMatrix();

    camera.computeWorldMatrix();

    const provider = CameraProviderComponent.get(component.node);
    if (provider) {
      provider.data = {
        camera,
      };
      provider.returnCursor();
    }
  },
  dispose: (component) => component.data.camera.dispose(),
});
