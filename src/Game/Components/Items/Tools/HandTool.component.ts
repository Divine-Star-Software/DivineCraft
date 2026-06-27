import { UseItemEvent } from "../../Inventory";
import { NCS, NodeCursor } from "@amodx/ncs/";
import { Vector3Like, Vec3ArrayLike } from "@amodx/math";
import {
  PlayerControlsComponent,
  PlayerInventoryComponent,
} from "Game/Components/Player/index";
import { VoxelItemComponent } from "../../Items/VoxelItem.component";
import { VoxelPlaceStragetgyComponent } from "@dvegames/vlox/Interaction/VoxelPlaceStrategy.component";
import { GameContext } from "Game/Game.context";
import { WorldCursor } from "@divinevoxel/vlox/World";
import { VoxelCursor } from "@divinevoxel/vlox/Voxels/Cursor/VoxelCursor";
import { VoxelPickResult } from "@divinevoxel/vlox/Voxels/Interaction/VoxelPickResult";
export const HandToolComponent = NCS.registerComponent({
  type: "hand-tool",
  schema: NCS.schema({
    option1: NCS.property(0),
    option2: NCS.property(false),
  }),
  data: NCS.data<() => void>(),
  init(component) {
    component = component.cloneCursor();
    const game = GameContext.getRequired(component.node)!.data;

    const place = (
      picked: VoxelPickResult,
      item: NodeCursor,
      event: UseItemEvent,
    ) => {
      const voxelComp = VoxelItemComponent.get(item);
      if (voxelComp) {
        const position = Vector3Like.Add(picked.position, picked.normal);
        const placer = VoxelPlaceStragetgyComponent.getRequired(event.origin);
        placer.data.getState(voxelComp.schema.voxelData, picked as any);

        game.gameSpace.data.space.paintVoxel(
          position,
          voxelComp.schema.voxelData,
        );

        item.events.dispatch(
          UseItemEvent.Event,
          new UseItemEvent(component.node, item, event.actionButton, {}),
        );
        voxelComp.returnCursor();
      }
    };
    const remove = (picked: VoxelPickResult) => {
      const voxel = picked.voxel;
      if (voxel && !voxel.isAir()) {
        const id = voxel.getStringId();
        const mod = voxel.getMod();
        game.gameSpace.data.space.eraseVoxel(picked.position);
        game.voxelParticles.data.explodeAt(
          picked.position.x,
          picked.position.y,
          picked.position.z,
          id,
          mod,
        );
      }
    };

    const useListener = async (event: UseItemEvent) => {
      const controls = PlayerControlsComponent.getRequired(event.origin);
      const picked = controls.data.pick();
      controls.returnCursor();
      if (!picked) {
        return false;
      }
      const inventory = PlayerInventoryComponent.getRequired(event.origin);
      const item =
        event.actionButton == "secondary"
          ? inventory.data.getOffHandItem()
          : inventory.data.getItem();
      if (!item) {
        remove(picked);
      } else {
        const voxelComp = VoxelItemComponent.get(item);
        if (voxelComp) {
          place(picked, item, event);
        }
        item.events.dispatch(
          UseItemEvent.Event,
          new UseItemEvent(component.node, item, "primary", {}),
        );
      }

      inventory.returnCursor();
    };

    component.node.events.addListener(UseItemEvent.Event, useListener);

    component.data = () => {
      component.node.events.removeListener(UseItemEvent.Event, useListener);
    };
  },
  dispose(component) {
    component.data();
  },
});
