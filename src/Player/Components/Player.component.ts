import { NCS, NodeCursor } from "@amodx/ncs/";
import { PlayerControlsComponent } from "./PlayerControls.component";
import { PlayerInventoryComponent } from "./PlayerInventory.component";
import { PlayerHandsComponent } from "./PlayerHands.component";
import { PlayerToolsComponent } from "./PlayerTools.component";

export const PlayerComponent = NCS.registerComponent({
  type: "player",
  schema: NCS.schema({
    id: NCS.property(""),
    name: NCS.property(""),
  }),
  data: NCS.data<{
    node: NodeCursor;
    controls: (typeof PlayerControlsComponent)["default"];
    inventory: (typeof PlayerInventoryComponent)["default"];
    hands: (typeof PlayerHandsComponent)["default"];
    tools: (typeof PlayerToolsComponent)["default"];
  }>(),
  init(component) {
    component.data = {
      node: component.node.cloneCursor(),
      controls: PlayerControlsComponent.getRequired(component.node),
      inventory: PlayerInventoryComponent.getRequired(component.node),
      hands: PlayerHandsComponent.getRequired(component.node),
      tools: PlayerToolsComponent.getRequired(component.node),
    };
  },
});
