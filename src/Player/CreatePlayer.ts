import { Graph, NCS, Node } from "@amodx/ncs";
import { TransformComponent } from "@dvegames/vlox/Transform.component";
import { DimensionProviderComponent } from "@dvegames/vlox/Providers/DimensionProvider.component";
import { BoxColliderComponent } from "@dvegames/vlox/Physics/BoxCollider.component";
import { PhysicsBodyComponent } from "@dvegames/vlox/Physics/PhysicsBody.component";
import { TransformNodeComponent } from "@dvegames/vlox/Babylon/TransformNode.component";
import { Vector3Like } from "@amodx/math";
import { PhysicsColliderStateComponent } from "@dvegames/vlox/Physics/PhysicsColliderState.component";
import { NexusPhysicsLinkComponent } from "@dvegames/vlox/Physics/NexusPhysicsLink.component";
import { PlayerControllerComponent } from "@dvegames/vlox/Debug/Player/PlayerController.component";
import { CameraProviderComponent } from "@dvegames/vlox/Babylon/Providers/CameraProvider.component";
import { FirstPersonCameraComponent } from "@dvegames/vlox/Babylon/Cameras/FirstPersonCamera.component";
import { PlayerComponent } from "./Components/Player.component";
import { Controls, KeyDownEvent } from "@amodx/controls";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { PlayerControlsComponent } from "./Components/PlayerControls.component";
import { PlayerInventoryComponent } from "./Components/PlayerInventory.component";
import { PlayerHandsComponent } from "./Components/PlayerHands.component";
import { PlayerToolsComponent } from "./Components/PlayerTools.component";
import { VoxelInersectionComponent } from "@dvegames/vlox/Interaction/VoxelIntersection.component";
import { CrossHairsComponent } from "@dvegames/vlox/Babylon/Interaction/CrossHairs.component";
import { CameraDirectionComponent } from "@dvegames/vlox/Babylon/Cameras/CameraDirection.component";
import { DebugCameraComponent } from "./DebugCamera.component";
import { SectorDebugComponent } from "Debug/SectorDebug.component";
import { VoxelPlaceStragetgyComponent } from "@dvegames/vlox/Interaction/VoxelPlaceStrategy.component";
import { PlayerEffectsComponent } from "./Components/PlayerEffects.component";
export default async function (dver: DivineVoxelEngineRender, graph: Graph) {
  const playerNode = graph
    .addNode(
      Node(
        "Player",
        [
          DebugCameraComponent(),
          DimensionProviderComponent(),
          TransformComponent(
            {
              position: { x: 0, y: 100, z: 0 },
            },
            "shared-array"
          ),
          PhysicsBodyComponent({}, "shared-binary-object"),
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
          VoxelInersectionComponent(),
       //   VoxelPlacerComponent(),
       //   VoxelRemoverComponent(),
          VoxelPlaceStragetgyComponent(),
          SectorDebugComponent(),
        ],
        Node({}, [
          TransformComponent({
            position: { x: 0, y: 1.6 / 2, z: 0 },
          }),
          TransformNodeComponent(),
          CameraProviderComponent(),
          FirstPersonCameraComponent(),
          CrossHairsComponent(),
          CameraDirectionComponent(),
        ])
      )
    )
    .cloneCursor();

  const camera = FirstPersonCameraComponent.getRequiredChild(playerNode);
  const subNode = TransformNodeComponent.getRequired(camera.node);
  subNode.data.transformNode.parent = camera.data.camera;

  PlayerToolsComponent.set(playerNode);
  PlayerInventoryComponent.set(playerNode);
  PlayerHandsComponent.set(playerNode);
  PlayerControlsComponent.set(playerNode);
  PlayerComponent.set(playerNode);
  PlayerEffectsComponent.set(playerNode);

  await dver.threads.world.runTaskAsync(
    "create-player",
    NCS.createRemoteNode(playerNode, false, [TransformComponent])
  );

  return playerNode;
}
