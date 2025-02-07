import { NCS } from "@amodx/ncs/";
import { Camera, UniversalCamera, Vector3 } from "@babylonjs/core";
import { BabylonContext } from "@dvegames/vlox/Babylon/Contexts/Babylon.context";
export const DebugCameraComponent = NCS.registerComponent({
  type: "debug-camera",
  data: NCS.data<{
    camera: UniversalCamera;
    _cleanUp: () => void;
  }>(),
  init(component) {
    const { scene } = BabylonContext.getRequired(component.node).data;
    const camera = new UniversalCamera("", new Vector3(0, 0, 0), scene);
    camera.position.set(0, 10, 0);
    camera.rotation.set(0, 0, 0);
    camera.setTarget(Vector3.Zero());
    camera.maxZ = 1000;
    camera.fov = 1.8;
    camera.minZ = 0.01;
  
    let prevCamera: Camera | null = null;
    const listener = (e: KeyboardEvent) => {
      const { key } = e;
      if (key == "F1") {
        e.preventDefault();
        prevCamera = scene.activeCamera;
        prevCamera?.detachControl();
        scene.activeCamera = camera;
        camera.attachControl(undefined, true);
      }
      if (key == "F2" && prevCamera) {
        scene.activeCamera = prevCamera;
        prevCamera.attachControl(undefined, true);
      }
    };
    window.addEventListener("keydown", listener);
    component.data = {
      camera,
      _cleanUp() {
        window.removeEventListener("keydown", listener);
      },
    };
  },
  dispose(component) {
    component.data.camera.dispose();
  },
});
