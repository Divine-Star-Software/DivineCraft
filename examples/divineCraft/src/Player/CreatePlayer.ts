import { Graph, NCS, Node } from "@amodx/ncs";
import { TransformComponent } from "@dvegames/vlox/Core/Components/Base/Transform.component";
import { DimensionProviderComponent } from "@dvegames/vlox/Core/Components/Providers/DimensionProvider.component";
import { BoxColliderComponent } from "@dvegames/vlox/Physics/Components/BoxCollider.component";
import { PhysicsBodyComponent } from "@dvegames/vlox/Physics/Components/PhysicsBody.component";
import { TransformNodeComponent } from "@dvegames/vlox/Babylon/Components/Base/TransformNode.component";
import { Vector3Like } from "@amodx/math";
import { PhysicsColliderStateComponent } from "@dvegames/vlox/Physics/Components/PhysicsColliderState.component";
import { NexusPhysicsLinkComponent } from "@dvegames/vlox/Physics/Components/NexusPhysicsLink.component";
import { PlayerControllerComponent } from "@dvegames/vlox/Player/Components/PlayerController.component";
import { CameraProviderComponent } from "@dvegames/vlox/Babylon/Components/Providers/CameraProvider.component";
import { FirstPersonCameraComponent } from "@dvegames/vlox/Babylon/Components/Cameras/FirstPersonCamera.component";
import { PlayerComponent } from "./Components/Player.component";
import { Controls, KeyDownEvent } from "@amodx/controls";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
export default async function (dver: DivineVoxelEngineRender, graph: Graph) {
  const playerNode = graph
    .addNode(
      Node(
        "Player",
        [
          PlayerComponent(),
          DimensionProviderComponent(),
          TransformComponent(
            {
              position: { x: 0, y: 100, z: 0 },
            },
            "shared-array"
          ),
          PhysicsBodyComponent(
            {
              mass: 70,
            },
            "shared-binary-object"
          ),
          BoxColliderComponent(
            {
              size: Vector3Like.Create(0.8, 1.8, 0.8),
            },
            "shared-binary-object"
          ),
          TransformNodeComponent({
            mode: "sync",
          }),
          PhysicsColliderStateComponent(null, "shared-binary-object"),
          //    BoxColliderMeshComponent(),
          NexusPhysicsLinkComponent(),
          PlayerControllerComponent(),
        ],
        Node({}, [
          TransformComponent({
            position: { x: 0, y: 1.8 / 2, z: 0 },
          }),
          CameraProviderComponent(),
          FirstPersonCameraComponent(),
        ])
      )
    )
    .cloneCursor();
  const controller = PlayerControllerComponent.get(playerNode)!;
  const camera = CameraProviderComponent.getChild(playerNode)!;

  Controls.registerControls([
    {
      id: "main",
      name: "main",
      controls: [
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
            (event as KeyDownEvent).observers.onRelease.subscribeOnce(() => {
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
            (event as KeyDownEvent).observers.onRelease.subscribeOnce(() => {
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
            (event as KeyDownEvent).observers.onRelease.subscribeOnce(() => {
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
            (event as KeyDownEvent).observers.onRelease.subscribeOnce(() => {
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
  ]).init();

  await dver.threads.world.runAsyncTasks(
    "create-player",
    NCS.createRemoteNode(playerNode, false, [TransformComponent])
  );

  return playerNode;
}
