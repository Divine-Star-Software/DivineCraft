import {
  EquipItemEvent,
  ItemEvents,
  UseItemEvent,
} from "Items/Components/index";
import { NCS } from "@amodx/ncs/";
import { VoxelRemoverComponent } from "@dvegames/vlox/Core/Components/Voxels/Interaction/VoxelRemover.component";
import { PlayerControlsComponent } from "Player/Components/PlayerControls.component";
import { RendererContext } from "@dvegames/vlox/Core/Contexts/Renderer.context";
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
    const brush = new AdvancedBrush(new TaskTool(dve.threads.constructors));
    const useListener = (event: UseItemEvent) => {
      const controls = PlayerControlsComponent.getRequired(event.origin);
      const picked = controls.data.pick();
      if(!picked){controls.returnCursor(); return;}
      brush.setXYZ(...picked.pickedPosition).eraseAndAwaitUpdate();
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
