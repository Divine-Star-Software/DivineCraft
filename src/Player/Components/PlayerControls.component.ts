import { NCS } from "@amodx/ncs/";
import { Observable } from "@amodx/core/Observers";
import { Controls, KeyDownEvent } from "@amodx/controls";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { PlayerInventoryComponent } from "./PlayerInventory.component";
import { FirstPersonCameraComponent } from "@dvegames/vlox/Babylon/Cameras/FirstPersonCamera.component";
import { VoxelInersectionComponent } from "@dvegames/vlox/Interaction/VoxelIntersection.component";
import { CameraDirectionComponent } from "@dvegames/vlox/Babylon/Cameras/CameraDirection.component";
import { PlayerControllerComponent } from "@dvegames/vlox/Debug/Player/PlayerController.component";
import PickVoxel from "@divinevoxel/vlox/Voxels/Interaction/Functions/PickVoxel";
import { PlayerToolsComponent } from "./PlayerTools.component";
import { ToolIds } from "Items";
import { UseItemEvent } from "Items/Components";
import { WorldCursor } from "@divinevoxel/vlox/World";
class Data {
  wheelUp = new Observable();
  wheelDown = new Observable();
  inventoryToggle = new Observable();
  toolToggle = new Observable();
  pointerLockEnabled = true;
  menuOpen = false;
  dataCursor = new WorldCursor();
  constructor(
    public component: (typeof PlayerControlsComponent)["default"],
    public canvas: HTMLCanvasElement
  ) {
    window.addEventListener("click", () => {
      if (this.pointerLockEnabled) {
        this.enterLock();
      }
    });
  }

  enterLock() {
    this.canvas.requestPointerLock();
  }
  exitLock() {
    document.exitPointerLock();
  }

  pick() {
    const cam = FirstPersonCameraComponent.getChild(this.component.node)!;
    const dir = CameraDirectionComponent.get(cam.node)!;
    const camPos = cam.data.camera.globalPosition;
    const camDir = dir.data.forwardDirection;
    cam.returnCursor();
    dir.returnCursor();
    this.dataCursor.setFocalPoint(
      0,
      Math.floor(camPos.x),
      Math.floor(camPos.y),
      Math.floor(camPos.z)
    );
    return PickVoxel(
      this.dataCursor,
      [camPos.x, camPos.y, camPos.z],
      [camDir.x, camDir.y, camDir.z],
      12
    );
  }
}

export const PlayerControlsComponent = NCS.registerComponent<Data>({
  type: "player-contorls",
  init(component) {
    const {
      data: { engine },
    } = BabylonContext.getRequired(component.node);

    const controls = new Data(component, engine.getRenderingCanvas()!);
    component.data = controls;
    const inventory = PlayerInventoryComponent.getRequired(component.node);
    const controller = PlayerControllerComponent.getRequired(component.node)!;
    const tools = PlayerToolsComponent.getRequired(component.node);

    Controls.registerControls([
      {
        id: "main",
        name: "main",
        controls: [
          {
            id: "inventory",
            groupId: "main",
            name: "Inventory",
            input: {
              keyboard: {
                key: "E",
                mode: "down",
              },
            },
            action: (event) => {
              controls.inventoryToggle.notify();
            },
          },
          {
            id: "tools",
            groupId: "main",
            name: "Tools",
            input: {
              keyboard: {
                key: "Q",
                mode: "down",
              },
            },
            action: (event) => {
              controls.toolToggle.notify();
            },
          },
          {
            id: "wheel-up",
            groupId: "main",
            name: "Wheel Up",
            input: {
              scroll: {
                mode: "up",
              },
            },
            action: (event) => {
              controls.wheelUp.notify();
            },
          },
          {
            id: "wheel-down",
            groupId: "main",
            name: "Wheel Down",
            input: {
              scroll: {
                mode: "down",
              },
            },
            action: (event) => {
              controls.wheelDown.notify();
            },
          },
          {
            id: "primary",
            groupId: "main",
            name: "Primary",
            input: {
              mouse: {
                mode: "down",
                button: "primary",
              },
            },
            action: (event) => {
              if (controls.menuOpen) return;
              tools.data.toolComponents[ToolIds.Hands].node.events.dispatch(
                UseItemEvent.Event,
                new UseItemEvent(
                  tools.node,
                  tools.data.toolComponents[ToolIds.Hands].node,
                  "primary"
                )
              );
            },
          },
          {
            id: "secondary",
            groupId: "main",
            name: "Secondary",
            input: {
              mouse: {
                mode: "down",
                button: "secondary",
              },
            },
            action: (event) => {
              if (controls.menuOpen) return;
              tools.data.toolComponents[ToolIds.Hands].node.events.dispatch(
                UseItemEvent.Event,
                new UseItemEvent(
                  tools.node,
                  tools.data.toolComponents[ToolIds.Hands].node,
                  "secondary"
                )
              );
            },
          },
          {
            id: "move_forward",
            groupId: "main",
            name: "Move Forward",
            input: {
              keyboard: {
                key: "w",
                mode: "down",
              },
            },
            action: (event) => {
              controller.data.controlObservers.moveForward.notify();
              (event as KeyDownEvent).addEventListener("release", () => {
                controller.data.controlObservers.moveForwardKeyUp.notify();
              });
            },
          },
          {
            id: "move_backward",
            groupId: "main",
            name: "Move Backward",
            input: {
              keyboard: {
                key: "s",
                mode: "down",
              },
            },
            action: (event) => {
              controller.data.controlObservers.moveBackward.notify();
              (event as KeyDownEvent).addEventListener("release", () => {
                controller.data.controlObservers.moveBackwardKeyUp.notify();
              });
            },
          },
          {
            id: "move_left",
            groupId: "main",
            name: "Move Left",
            input: {
              keyboard: {
                key: "a",
                mode: "down",
              },
            },
            action: (event) => {
              controller.data.controlObservers.moveLeft.notify();
              (event as KeyDownEvent).addEventListener("release", () => {
                controller.data.controlObservers.moveLeftKeyUp.notify();
              });
            },
          },
          {
            id: "move_right",
            groupId: "main",
            name: "Move Right",
            input: {
              keyboard: {
                key: "d",
                mode: "down",
              },
            },
            action: (event) => {
              controller.data.controlObservers.moveRight.notify();
              (event as KeyDownEvent).addEventListener("release", () => {
                controller.data.controlObservers.moveRightKeyUp.notify();
              });
            },
          },
          {
            id: "jump",
            groupId: "main",
            name: "Jump",
            input: {
              keyboard: {
                key: " ",
                mode: "down",
              },
            },
            action: (event) => {
              controller.data.controlObservers.jump.notify();
            },
          },
          {
            id: "run",
            groupId: "main",
            name: "Run",
            input: {
              keyboard: {
                key: "Shift",
                mode: "down",
              },
            },
            action: (event) => {
              controller.data.controlObservers.run.notify();
            },
          },
        ],
      },
    ]);
    Controls.init(window);
  },
});
