import { Vector3Like } from "@amodx/math";
import { NCS } from "@amodx/ncs";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { GameContext } from "../../Game.context";
import { WorldCursor } from "@divinevoxel/vlox/World";
import { ArchivedVoxelTemplate } from "@divinevoxel/vlox/Templates/Archive/ArchivedVoxelTemplate";
import { VoxelBuildSpace } from "@divinevoxel/vlox/Builder/VoxelBuildSpace";
import { RayProvider } from "@divinevoxel/vlox/Builder/RayProvider";
import { TypedEventTarget } from "@divinevoxel/vlox/Util/TypedEventTarget";
import { Scene } from "@babylonjs/core/scene";
import { Ray } from "@babylonjs/core/Culling/ray";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
interface BuilderRayEvents {
  updated: GameSpaceRayEvent;
}
class GameSpaceRayEvent<Data extends any = null> {
  constructor(public data: Data) {}
}
class GameSpaceRay
  extends TypedEventTarget<BuilderRayEvents>
  implements RayProvider
{
  origin = Vector3Like.Create();
  direction = Vector3Like.Create();
  length = 100;

  private ray = new Ray(Vector3.Zero(), Vector3.Zero());
  constructor(public scene: Scene) {
    super();
  }

  update() {
    const camera = this.scene.activeCamera!;
    camera.getForwardRayToRef(this.ray, this.length);
    this.ray.origin.x = camera.globalPosition.x;
    this.ray.origin.y = camera.globalPosition.y;
    this.ray.origin.z = camera.globalPosition.z;

    const changed =
      !Vector3Like.Equals(this.origin, this.ray.origin) ||
      !Vector3Like.Equals(this.direction, this.ray.direction);
    Vector3Like.Copy(this.origin, this.ray.origin);
    Vector3Like.Copy(this.direction, this.ray.direction);

    if (changed) this.dispatch("updated", new GameSpaceRayEvent(null));
  }
}
class Data {
  space: VoxelBuildSpace;
  ray: GameSpaceRay;
  worldCursor = new WorldCursor();
  archived: ArchivedVoxelTemplate;
  _dispose: () => void;
  constructor(
    public DVER: DivineVoxelEngineRender,
    public scene: Scene,
    public component: (typeof GameSpaceComponent)["default"],
  ) {
    this.ray = new GameSpaceRay(scene);
    this.space = new VoxelBuildSpace(DVER, this.ray);
  }

}

export const GameSpaceComponent = NCS.registerComponent({
  type: "game-space",
  schema: NCS.schema({}),
  data: NCS.data<Data>(),
  init(component) {
    const game = GameContext.getRequired(component.node);
    const { scene } = BabylonContext.getRequired(component.node).data;
    const data = new Data(game.data.DVER, scene, component);
    component.data = data;
    const beforeRender = scene.onBeforeRenderObservable.add(() => {
      data.ray.update();
    });
    data._dispose = () => {
      scene.onBeforeRenderObservable.remove(beforeRender);
    };
  },
  dispose(component) {
    component.data._dispose();
  },
});
