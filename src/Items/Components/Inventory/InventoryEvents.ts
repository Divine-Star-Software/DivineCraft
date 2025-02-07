import { Vec2Array } from "@amodx/math";
import { Node, NodeCursor } from "@amodx/ncs/";

export enum InventoryEvents {
  AddItem = "add-item",
  RemoveItem = "remove-item",
  ItemsUpdated = "items-updated"
}

class InventoryEvent {
  constructor(public origin: NodeCursor) {}
}

export class RemoveItemEvents extends InventoryEvent {
  static Event = InventoryEvents.RemoveItem;
  constructor(
    origin: NodeCursor,
    public item: NodeCursor,
    public index: Vec2Array
  ) {
    super(origin);
  }
}

export class AddItemEvent extends InventoryEvent {
  static Event = InventoryEvents.AddItem;
  constructor(
    origin: NodeCursor,
    public item: NodeCursor,
    public index: Vec2Array
  ) {
    super(origin);
  }
}

export class ItemsUpdatedEvet extends InventoryEvent {
  static Event = InventoryEvents.ItemsUpdated;
  constructor(
    origin: NodeCursor,
  ) {
    super(origin);
  }
}
