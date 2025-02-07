import { NCS, Node } from "@amodx/ncs/";
import { PaintVoxelData } from "@divinevoxel/vlox/Voxels";
import { EquipItemEvent, ItemEvents } from "../Components/index";
import { VoxelModelComponent } from "../Models/VoxelModel.component";
import { TransformComponent } from "@dvegames/vlox/Core/Components/Base/Transform.component";
import { ItemUseAnimationTrait } from "../Animation/ItemUseAnimation.component";
import { NodeRefernceComponent } from "@dvegames/vlox/Core/Components/Base/NodeRefernce.component";
import { Tools } from "@babylonjs/core";
import { TransformNodeComponent } from "@dvegames/vlox/Babylon/Components/Base/TransformNode.component";
export const VoxelItemComponent = NCS.registerComponent({
  type: "voxel-item",
  schema: NCS.schema({
    voxelId: NCS.property(""),
    voxelState: NCS.property(""),
    voxelData: NCS.property(PaintVoxelData.Create({})),
  }),
  data: NCS.data<() => void>(),
  init(component) {
    component = component.cloneCursor();
    const listener = (event: EquipItemEvent) => {
      event.origin.graph.addNode(
        Node({}, [
          NodeRefernceComponent({
            nodeIndex: event.item.index,
          }),
          TransformComponent({
            position: { x: 0, y: -1, z: 0.5 },
            rotation: { x: 0, y: Tools.ToDegrees(20), z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          }),
          TransformNodeComponent({
            mode: "none",
          }),
          VoxelModelComponent({
            voxelId: component.schema.voxelId,
            voxelState: component.schema.voxelState,
          }),
          ItemUseAnimationTrait({
            endRotation: { x: 0, y: 20, z: 100 },
            endPosition: { x: 0.5, y: -0.1, z: 1 },
          }),
        ]),
        event.origin.index
      );
    };

    component.node.events.addListener(ItemEvents.Equip, listener);

    component.data = () => {
      component.node.events.removeListener(ItemEvents.Equip, listener);
    };
  },
  dispose: (component) => component.data(),
});
