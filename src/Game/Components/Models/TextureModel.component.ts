import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { TextureId } from "@divinevoxel/vlox/Textures/Texture.types";
import { NCS } from "@amodx/ncs/";
import { TransformNodeComponent } from "@dvegames/vlox/Babylon/TransformNode.component";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { TextureManager } from "@divinevoxel/vlox/Textures/TextureManager";
import { MeshTexture } from "@divinevoxel/vlox/Mesher/Items/MeshTexture";
import { DVEBRItemMesh } from "@divinevoxel/vlox-babylon/Meshes/DVEBRItemMesh";
export const TextureModelComponent = NCS.registerComponent({
  type: "texture-model",
  schema: NCS.schema({
    textureId: NCS.property<TextureId>(""),
    textureType: NCS.property(""),
  }),
  data: NCS.data<{
    mesh: Mesh;
  }>(),
  init(component) {
    const transformNode = TransformNodeComponent.getRequired(component.node);
    const { scene } = BabylonContext.getRequired(component.node).data;
    const textureId = component.schema.textureId;
    const textureTypeId = component.schema.textureType;
    (async () => {
      const textureType = TextureManager.getTexture(textureTypeId);
      const index = textureType.getTextureIndex(textureId);
      const data = await textureType.getTextureData(textureId);
      const compacted = MeshTexture(index, data as any);
      const mesh = DVEBRItemMesh.CreateSubMesh(
        compacted[0],
        scene,
        scene.getEngine() as any
      );
      component.data = { mesh };
      transformNode.data.parent(mesh);
    })();
  },
  dispose: (component) => component.data?.mesh?.dispose(),
});
