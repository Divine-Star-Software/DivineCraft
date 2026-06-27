import { NCS, NodeCursor } from "@amodx/ncs/";
import { PlayerControlsComponent } from "./PlayerControls.component";
import { PlayerInventoryComponent } from "./PlayerInventory.component";
import { PlayerHandsComponent } from "./PlayerHands.component";
import { PlayerToolsComponent } from "./PlayerTools.component";
import { VoxelIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import { GameContext } from "Game/Game.context";

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
    const controls = PlayerControlsComponent.getRequired(component.node);
    const inventory = PlayerInventoryComponent.getRequired(component.node);
    component.data = {
      node: component.node.cloneCursor(),
      controls,
      inventory,
      hands: PlayerHandsComponent.getRequired(component.node),
      tools: PlayerToolsComponent.getRequired(component.node),
    };
    const game = GameContext.getRequired(component.node);
    controls.data.swap.subscribe(() => {
      inventory.data.swap();
    });
    controls.data.middle.subscribe(async () => {
      const result = await game.data.gameSpace.data.space.pickWithProvider(0);
      if (!result) return;
      if (result.voxel.isAir() || !result.voxel.isRenderable()) return;
      const state = VoxelIndex.instance.getStateFromRawData(result.voxelData);

      if (!state) return;
      const node = game.data.items.data.getItemNode(state.data.id);

      if (node) {
        inventory.data.inventory.data.removeItem(
          inventory.data.inventory.schema.activeIndex,
        );
        inventory.data.inventory.data.addItem(
          inventory.data.inventory.schema.activeIndex,
          node,
        );
      }
    });

    controls.data.numberPressed.subscribe((index) => {
      inventory.data.inventory.schema.activeIndex = index - 1;
    });
    controls.data.wheelDown.subscribe(() => {
      if (!controls.schema.hotBarEnabled) return;
      const index = inventory.data.inventory.schema.activeIndex;
      if (index - 1 < 0) {
        inventory.data.inventory.schema.activeIndex =
          inventory.data.inventory.data.index.size - 1;
      } else {
        inventory.data.inventory.schema.activeIndex = index - 1;
      }
    });

    controls.data.wheelUp.subscribe(() => {
      if (!controls.schema.hotBarEnabled) return;
      const index = inventory.data.inventory.schema.activeIndex;
      if (index + 1 >= inventory.data.inventory.data.index.size) {
        inventory.data.inventory.schema.activeIndex = 0;
      } else {
        inventory.data.inventory.schema.activeIndex = index + 1;
      }
    });
  },
});
