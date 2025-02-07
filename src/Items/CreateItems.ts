import { Node, Graph, CreateNodeData } from "@amodx/ncs/";
import {
  ItemRegisterComponent,
  ItemRegisterEntryComponent,
} from "./Components/index";

import { VoxelItemComponent } from "./Item/VoxelItem.component";
import { VoxelTextureIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelTextureIndex";
import { VoxelIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import { SchemaRegister } from "@divinevoxel/vlox/Voxels/State/SchemaRegister";

export function CreateItemManager(graph: Graph) {
  const itemNodes: CreateNodeData[] = [];

  for (const voxelsStates of VoxelIndex.instance.stateArray) {
    for (const state of voxelsStates.stateArray) {
      if (!SchemaRegister.voxelModSchemaData.has(voxelsStates.voxelId))
        continue;
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
              voxelId: voxelsStates.voxelId,
              voxelState: state.data.id,
              voxelData: state.getPaintData(),
            }),
          ]
        )
      );
    }
  }

  const registerNode = graph.addNode(
    Node(
      {
        name: "Item Register",
      },
      [],
      ...itemNodes
    )
  );

  return ItemRegisterComponent.set(registerNode);
}
