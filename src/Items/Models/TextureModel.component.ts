import { Mesh, TransformNode, VertexBuffer, VertexData } from "@babylonjs/core";
import { NCS } from "@amodx/ncs/";
export const TextureModelComponent = NCS.registerComponent({
  type: "texture-model",
  schema: NCS.schema({
    textureType: NCS.property(""),
    textureId: NCS.property(""),
    textureVariation: NCS.property(""),
  }),
  data: NCS.data<{
    mesh: Mesh;
  }>(),
  init(component) {
/*     const tranform = TransformComponent.getRequired(component.node);
    const tranformNode = TransformNodeComponent.getRequired(component.node);

    const { scene } = BabylonContext.getRequired(component.node).data;
    const texture = [
      component.schema.textureType,
      component.schema.textureId,
      component.schema.textureVariation !== ""
        ? component.schema.textureVariation
        : undefined,
    ] as TextureId;
    const data = TextureManager.getTextureData(texture)?.rawData!;

    const meshData = MeshTexture(
      TextureRegister.getTextureUV(texture),
      Array.isArray(data) ? data[0] : (data as any)
    );

    const tempParent = new TransformNode("", scene);
    tempParent.rotation.set(...Vector3Like.ToArray(tranform.schema.rotation));

    tranformNode.data.parent(component.data.mesh);

    const mesh = new Mesh("", scene);
    DVEBRMesh.UpdateVertexData(
      mesh,
      scene.getEngine()! as any,
      meshData[2][0] as any
    );
    component.data = {
      mesh,
    };
    mesh.makeGeometryUnique();
    tempParent.rotation.set(...Vector3Like.ToArray(tranform.schema.rotation));

    mesh.bakeTransformIntoVertices(tempParent.getWorldMatrix());
    let normals: number[] = [];
    VertexData.ComputeNormals(
      mesh.getPositionData(),
      mesh.getIndices(),
      normals,
      { useRightHandedSystem: false }
    );

    component.data.mesh.setVerticesData(VertexBuffer.NormalKind, normals); */
  },
  dispose: (component) => component.data.mesh.dispose(),
});
