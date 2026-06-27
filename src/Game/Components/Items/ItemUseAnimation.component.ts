import { NCS } from "@amodx/ncs/";
import '@babylonjs/core/Animations/animatable.js';
import { Tools } from "@babylonjs/core/Misc/tools";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { CubicEase } from "@babylonjs/core/Animations/easing";
import { Animation } from "@babylonjs/core/Animations/animation";

import { Vec3Array, Vector3Like } from "@amodx/math";
import { UseItemEvent } from "../Inventory";
import { NodeRefernceComponent } from "@dvegames/vlox/NodeRefernce.component";
import { TransformNodeComponent } from "@dvegames/vlox/Babylon/TransformNode.component";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
const createSlideAnimations = (
  startFrame = 0,
  endFrame = 10,
  frameRate = 30,
  animations: Animation[] = [],
  start: Vec3Array,
  end: Vec3Array,
  property: string
) => {
  const ease = new CubicEase();

  const xSlide = new Animation(
    `${property}XSlide`,
    `${property}.x`,
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  const ySlide = new Animation(
    `${property}YSlide`,
    `${property}.y`,
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  const zSlide = new Animation(
    `${property}ZSlide`,
    `${property}.z`,
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  xSlide.setKeys([
    { frame: startFrame, value: start[0] },
    { frame: endFrame / 2, value: end[0] },
    { frame: endFrame, value: start[0] },
  ]);
  xSlide.setEasingFunction(ease);
  ySlide.setKeys([
    { frame: startFrame, value: start[1] },
    { frame: endFrame / 2, value: end[1] },
    { frame: endFrame, value: start[1] },
  ]);
  ySlide.setEasingFunction(ease);
  zSlide.setKeys([
    { frame: startFrame, value: start[2] },
    { frame: endFrame / 2, value: end[2] },
    { frame: endFrame, value: start[2] },
  ]);
  zSlide.setEasingFunction(ease);
  animations.push(xSlide, ySlide, zSlide);
};
const createAnimation = (
  mesh: TransformNode,
  component: (typeof ItemUseAnimationTrait)["default"]
) => {
  const startFrame = 0;
  const endFrame = 10;
  const frameRate = 30;
  const animations: Animation[] = [];

  createSlideAnimations(
    startFrame,
    endFrame,
    frameRate,
    animations,
    [mesh.position.x, mesh.position.y, mesh.position.z],
    [
      component.schema.endPosition.x,
      component.schema.endPosition.y,
      component.schema.endPosition.z,
    ],
    "position"
  );

  createSlideAnimations(
    startFrame,
    endFrame,
    frameRate,
    animations,
    [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
    [
      Tools.ToRadians(component.schema.endRotation.x),
      Tools.ToRadians(component.schema.endRotation.y),
      Tools.ToRadians(component.schema.endRotation.z),
    ],
    "rotation"
  );

  return animations;
};

export const ItemUseAnimationTrait = NCS.registerComponent({
  type: "item-use-animation",
  schema: NCS.schema({
    endRotation: NCS.property(Vector3Like.Create(-100, 0, 0)),
    endPosition: NCS.property(Vector3Like.Create(-100, 0, 0)),
  }),
  data: NCS.data<() => void>(),
  init(component) {
    const node = component.node;
    const { scene } = BabylonContext.getRequired(component.node).data;

    const transformComponent = TransformNodeComponent.getRequired(node);

    transformComponent.data.transformNode.animations.push(
      ...createAnimation(transformComponent.data.transformNode, component)
    );

    const refernceComponent = NodeRefernceComponent.getRequired(node);

    const itemNode = refernceComponent.data.node;
    if (!itemNode)
      throw new Error(
        `${NodeRefernceComponent.name} trait requires the ${NodeRefernceComponent.type} node refernce must be set.`
      );

    const listener = (event: UseItemEvent) => {
      //scene.stopAnimation(transformComponent.data.transformNode);
      scene.beginAnimation(
        transformComponent.data.transformNode,
        0,
        10,
        false,
        1.0
      );
    };
    itemNode.events.addListener(UseItemEvent.Event, listener);

    component.data = () => {
      itemNode.events.removeListener(UseItemEvent.Event, listener);
    };
  },
  dispose: (component) => component.data(),
});
