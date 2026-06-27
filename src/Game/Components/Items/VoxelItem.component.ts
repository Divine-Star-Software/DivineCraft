import { Graph, NCS, Node } from "@amodx/ncs/";
import { PaintVoxelData } from "@divinevoxel/vlox/Voxels";
import { EquipItemEvent, ItemComponent } from "../Inventory";
import { VoxelModelComponent } from "../Models/VoxelModel.component";
import { TransformComponent } from "@dvegames/vlox/Transform.component";
import { ItemUseAnimationTrait as ItemUseAnimationComponent } from "./ItemUseAnimation.component";
import { NodeRefernceComponent } from "@dvegames/vlox/NodeRefernce.component";
import { Tools } from "@babylonjs/core/Misc/tools";
import { TransformNodeComponent } from "@dvegames/vlox/Babylon/TransformNode.component";
import { VoxelIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import { TextureModelComponent } from "../Models/TextureModel.component";
import { VoxelTextureIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelTextureIndex";
class Shared {
  buildCustom(voxelData: PaintVoxelData) {
    const stateData = VoxelIndex.instance.getStateFromPaintData(voxelData);
    if (!stateData) return;
    const textureSrc = VoxelTextureIndex.getImage(
      stateData.voxelId,
      stateData.data.id
    )!;
    return Node({}, [
      ItemComponent({
        name: stateData.data.name || stateData.data.id,
        textureSrc: textureSrc ? textureSrc.src : "",
        attributes: "custom",
      }),
      VoxelItemComponent({
        voxelData,
        custom: true,
      }),
    ]);
  }
}

export const VoxelItemComponent = NCS.registerComponent({
  type: "voxel-item",
  schema: NCS.schema({
    voxelData: NCS.property(PaintVoxelData.Create({})),
    custom: NCS.property(false),
  }),
  data: NCS.data<() => void>(),
  init(component) {
    component = component.cloneCursor();
    const stateData = VoxelIndex.instance.getStateFromPaintData(
      component.schema.voxelData
    );
    if (!stateData) {
      console.error("No state data for", component.schema.toJSON());
      return;
    }

    const listener = (event: EquipItemEvent) => {
      event.origin.graph.addNode(
        Node({}, [
          NodeRefernceComponent({
            nodeIndex: event.item.index,
          }),
          TransformComponent({
            position: { x: 0, y: 0, z: 0.5 },
            rotation: {
              x: 0,
              y: Tools.ToRadians(event.actionButton == "primary" ? 25 : -25),
              z: 0,
            },
            scale: { x: 0.2, y: 0.2, z: 0.2 },
          }),
          TransformNodeComponent({
            mode: "none",
          }),
          stateData.data.display.type == "model"
            ? VoxelModelComponent({
                voxelId: stateData.voxelId,
                voxelState: stateData.data.id,
              })
            : TextureModelComponent({
                textureId: stateData.data.display.source,
                textureType: stateData.data.display.textureType,
              }),
          ItemUseAnimationComponent({
            endRotation: {
              x: 90,
              y: event.actionButton == "primary" ? 25 : -25,
              z: 0,
            },
            endPosition: {
              x: event.actionButton == "primary" ? 0.2 : -0.2,
              y: 0.0,
              z: 0.7,
            },
          }),
        ]),
        event.origin.index
      );
    };

    component.node.events.addListener(EquipItemEvent.Event, listener);

    component.data = () => {
      component.node.events.removeListener(EquipItemEvent.Event, listener);
    };
  },
  dispose: (component) => component.data(),

  shared: new Shared(),
});
