import { NodeCursor } from "@amodx/ncs/";

class ItemEvent {
  constructor(public origin: NodeCursor) {}
}

class ItemKeys {
  alt?: boolean;
  shift?: boolean;
  control?: boolean;
}

/**
 * Triggered at the start of using an item.
 */
export class UseItemEvent extends ItemEvent {
  static Event = "use-item";
  constructor(
    origin: NodeCursor,
    public item: NodeCursor,
    public actionButton: "primary" | "secondary",
    public keys: ItemKeys
  ) {
    super(origin);
  }
}

/**
 * Triggered at the end of using an item. Used for items that require the user to hold down the button.
 */
export class UseItemEndEvent extends ItemEvent {
  static Event = "use-item-end";
  constructor(
    origin: NodeCursor,
    public item: NodeCursor,
    public actionButton: "primary" | "secondary",
    public keyx: ItemKeys
  ) {
    super(origin);
  }
}

export class EquipItemEvent extends ItemEvent {
  static Event = "equip-item";
  constructor(
    origin: NodeCursor,
    public item: NodeCursor,
    public actionButton: "primary" | "secondary" = "primary"
  ) {
    super(origin);
  }
}

export class UnEquipItemEvent extends ItemEvent {
  static Event = "unequip-item";
  constructor(origin: NodeCursor, public item: NodeCursor) {
    super(origin);
  }
}

export class OpemItemMenuEvent extends ItemEvent {
  static Event = "open-item-menu";
  constructor(origin: NodeCursor, public item: NodeCursor) {
    super(origin);
  }
}
