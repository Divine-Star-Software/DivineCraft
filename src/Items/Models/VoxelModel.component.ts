import { NCS } from "@amodx/ncs/";
import { Mesh } from "@babylonjs/core";

import { DVEBRMesh } from "@divinevoxel/vlox-babylon/Meshes/DVEBRMesh";
import { VoxelModelIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelModelIndex";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { TransformNodeComponent } from "@dvegames/vlox/Babylon/TransformNode.component";
import { CompactSubMesh } from "@divinevoxel/vlox/Mesher/Types/Mesher.types";
export const VoxelModelComponent = NCS.registerComponent({
  type: "voxel-model",
  schema: NCS.schema({
    voxelId: NCS.property(""),
    voxelState: NCS.property(""),
  }),
  data: NCS.data<{
    mesh: Mesh;
  }>(),
  init(component) {
    const transformNode = TransformNodeComponent.getRequired(component.node);

    const { scene } = BabylonContext.getRequired(component.node).data;

    const mesh = new Mesh("", scene);

    mesh.alwaysSelectAsActiveMesh = true;
    
    const model = VoxelModelIndex.getModel(
      component.schema.voxelId,
      component.schema.voxelState
    );
    const material = VoxelModelIndex.getMaterial(
      component.schema.voxelId,
      component.schema.voxelState
    );
    if (!model || !material) {
      return console.error(
        "Could not make mesh for voxel with data:",
        component.schema.voxelState
      );
    }
    DVEBRMesh.UpdateVertexData(
      mesh,
      scene.getEngine()! as any,
      (model.model[1] as CompactSubMesh[])[0]
    );

    mesh.isPickable = false;
    mesh.renderingGroupId = 2;
    mesh.material = material;
    component.data = { mesh };

    transformNode.data.parent(mesh);
  },
  dispose: (component) => component.data.mesh.dispose(),
});
