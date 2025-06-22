import { ItemEvents, UseItemEvent } from "Items/Components/index";
import { NCS } from "@amodx/ncs/";
import { Vector3Like, Vec3ArrayLike } from "@amodx/math";
import {
  PlayerControlsComponent,
  PlayerInventoryComponent,
} from "Player/Components/index";
import { VoxelItemComponent } from "../Item/VoxelItem.component";
import { VoxelPlaceStragetgyComponent } from "@dvegames/vlox/Interaction/VoxelPlaceStrategy.component";
import { GameContext } from "Game.context";
import { WorldCursor } from "@divinevoxel/vlox/World";
import { VoxelCursor } from "@divinevoxel/vlox/Voxels/Cursor/VoxelCursor";
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

    const cursor = new WorldCursor();
    const useListener = async (event: UseItemEvent) => {
      const controls = PlayerControlsComponent.getRequired(event.origin);
      const picked = controls.data.pick();
      if (!picked) {
        controls.returnCursor();
        return false;
      }
      const inventory = PlayerInventoryComponent.getRequired(event.origin);
      const item = inventory.data.getItem();
      if (event.actionButton == "secondary") {
        cursor.setFocalPoint(
          0,
          picked.position.x,
          picked.position.y,
          picked.position.z
        );
        const voxel = cursor.getVoxel(
          picked.position.x,
          picked.position.y,
          picked.position.z
        );
        if (voxel && !voxel.isAir()) {
          const id = voxel.getStringId();
          const mod = voxel.getMod();
          await game.dver.threads.world.runTaskAsync("erase-voxel", [
            0,
            picked.position.x,
            picked.position.y,
            picked.position.z,
          ]);

          game.voxelParticles.data.explodeAt(
            picked.position.x,
            picked.position.y,
            picked.position.z,
            id,
            mod
          );
        }

        if (item) {
          item.events.dispatch(
            UseItemEvent.Event,
            new UseItemEvent(component.node, item, "primary")
          );
        }
        inventory.returnCursor();
        return true;
      }
      if (!item) {
        inventory.returnCursor();
        return false;
      }
      const voxelComp = VoxelItemComponent.get(item);
      if (voxelComp) {
        const position = Vector3Like.Add(picked.position, picked.normal);
        const placer = VoxelPlaceStragetgyComponent.getRequired(event.origin);
        placer.data.getState(voxelComp.schema.voxelData, picked as any);

        await game.dver.threads.world.runTaskAsync("paint-voxel", [
          [0, ...Vector3Like.ToArray(position)],
          VoxelCursor.VoxelDataToRaw(voxelComp.schema.voxelData),
        ]);

        item.events.dispatch(
          UseItemEvent.Event,
          new UseItemEvent(component.node, item, event.actionButton)
        );
        controls.returnCursor();
        voxelComp.returnCursor();
      }

      inventory.returnCursor();
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
