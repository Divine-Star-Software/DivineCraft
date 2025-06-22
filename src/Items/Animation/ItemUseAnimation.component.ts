import { NCS } from "@amodx/ncs/";
import { Tools, TransformNode } from "@babylonjs/core";
import { Animation } from "@babylonjs/core/Animations/animation";

import { Vec3Array, Vector3Like } from "@amodx/math";
import { ItemEvents, UseItemEvent } from "Items/Components/index";
import { NodeRefernceComponent } from "@dvegames/vlox/NodeRefernce.component";
import { TransformNodeComponent } from "@dvegames/vlox/Babylon/TransformNode.component";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";

const createAnimation = (
  mesh: TransformNode,
  component: (typeof ItemUseAnimationTrait)["default"]
) => {
  const startFrame = 0;
  const endFrame = 5;
  const frameRate = 20;
  const animations: Animation[] = [];

  const createSlideAnimations = (
    start: Vec3Array,
    end: Vec3Array,
    property: string
  ) => {
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
    ySlide.setKeys([
      { frame: startFrame, value: start[1] },
      { frame: endFrame / 2, value: end[1] },
      { frame: endFrame, value: start[1] },
    ]);
    zSlide.setKeys([
      { frame: startFrame, value: start[2] },
      { frame: endFrame / 2, value: end[2] },
      { frame: endFrame, value: start[2] },
    ]);

    animations.push(xSlide, ySlide, zSlide);
  };

  // Position Animation
  const startPos: Vec3Array = [
    mesh.position.x,
    mesh.position.y,
    mesh.position.z,
  ];
  const endPos: Vec3Array = [
    mesh.position.x + component.schema.endPosition.x,
    mesh.position.y + component.schema.endPosition.y,
    mesh.position.z + component.schema.endPosition.z,
  ];
  createSlideAnimations(startPos, endPos, "position");

  // Rotation Animation
  const startRot: Vec3Array = [
    mesh.rotation.x,
    mesh.rotation.y,
    mesh.rotation.z,
  ];
  const endRot: Vec3Array = [
    Tools.ToRadians(component.schema.endRotation.x) + mesh.rotation.x,
    Tools.ToRadians(component.schema.endRotation.y) + mesh.rotation.y,
    Tools.ToRadians(component.schema.endRotation.z) + mesh.rotation.z,
  ];
  createSlideAnimations(startRot, endRot, "rotation");

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
      scene.beginAnimation(transformComponent.data.transformNode, 0, 5);
    };
    itemNode.events.addListener(ItemEvents.Use, listener);

    component.data = () => {
      itemNode.events.removeListener(ItemEvents.Use, listener);
    };
  },
  dispose: (component) => component.data(),
});
