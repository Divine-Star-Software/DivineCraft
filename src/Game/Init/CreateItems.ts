import { Node, Graph, CreateNodeData } from "@amodx/ncs/";
import {
  ItemRegisterComponent,
  ItemRegisterEntryComponent,
} from "../Components/Inventory";

import { VoxelItemComponent } from "../Components/Items/VoxelItem.component";
import { VoxelTextureIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelTextureIndex";
import { VoxelIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import { VoxelSchemas } from "@divinevoxel/vlox/Voxels/State/VoxelSchemas";

export function CreateItemManager(graph: Graph) {
  const itemNodes: CreateNodeData[] = [];

  for (const voxelsStates of VoxelIndex.instance.stateArray) {
    for (const state of voxelsStates.stateArray) {
      if (!VoxelSchemas.mod.has(voxelsStates.voxelId)) continue;
      itemNodes.push(
        Node(
          {
            name: `Voxel Item: ${state.data.name}`,
          },
          [
            ItemRegisterEntryComponent({
              id: state.data.id,
              name: state.data.name,
              groupId: voxelsStates.voxelId,
              categoryId: "voxels",
              textureSrc: (
                VoxelTextureIndex.getImage(state.voxelId, state.data.id)! as any
              ).src,
            }),
            VoxelItemComponent({
              voxelData: state.getPaintData(),
            }),
          ],
        ),
      );
    }
  }

  const registerNode = graph.addNode(
    Node(
      {
        name: "Item Register",
      },
      [],
      ...itemNodes,
    ),
  );

  return ItemRegisterComponent.set(registerNode);
}
