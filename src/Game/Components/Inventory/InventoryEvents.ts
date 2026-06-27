import { Vec2Array } from "@amodx/math";
import { NodeCursor } from "@amodx/ncs/";

class InventoryEvent {
  constructor(public origin: NodeCursor) {}
}

export class AddItemEvent extends InventoryEvent {
  static Event = "inventory-add-item";
  constructor(
    origin: NodeCursor,
    public item: NodeCursor,
    public index: Vec2Array
  ) {
    super(origin);
  }
}

export class RemoveItemEvent extends InventoryEvent {
  static Event = "inventory-remove-item";
  constructor(
    origin: NodeCursor,
    public item: NodeCursor,
    public index: Vec2Array
  ) {
    super(origin);
  }
}

export class ItemsUpdatedEvent extends InventoryEvent {
  static Event = "inventory-items-updated";
  constructor(origin: NodeCursor) {
    super(origin);
  }
}
