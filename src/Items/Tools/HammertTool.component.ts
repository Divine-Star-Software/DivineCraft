import {
  ItemEvents,
  UseItemEvent,
} from "Items/Components/index";
import { NCS } from "@amodx/ncs/";
import { PlayerControlsComponent } from "Player/Components/PlayerControls.component";
import { RendererContext } from "@dvegames/vlox/Contexts/Renderer.context";
import { TaskTool } from "@divinevoxel/vlox/Tools/Tasks/TasksTool";
import { AdvancedBrush } from "@divinevoxel/vlox/Tools/Brush/AdvancedBrushTool";

export const HammerToolComponent = NCS.registerComponent({
  type: "hammer-tool",
  schema: NCS.schema({
    option1: NCS.property(0),
    option2: NCS.property(false),
  }),
  data: NCS.data<() => void>(),
  init(component) {
    const { dve } = RendererContext.getRequired(component.node).data;
    
    const useListener = (event: UseItemEvent) => {
    
    };

    component.node.events.addListener(ItemEvents.Use, useListener);

    component.data = () => {
      component.node.events.removeListener(ItemEvents.Use, useListener);
    };
  },
  dispose(component) {
    component.data();
  },
});
