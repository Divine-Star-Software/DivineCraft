import { NodeCursor } from "@amodx/ncs/";

export enum ItemEvents {
  Use = "use",
  Equip = "equip",
  OpenMenu = "open-menu",
}

class ItemEvent {
  constructor(public origin: NodeCursor) {}
}

export class UseItemEvent extends ItemEvent {
  static Event = ItemEvents.Use;
  constructor(origin: NodeCursor, public item: NodeCursor, public actionButton : "primary" |"secondary") {
    super(origin);
  }
}

export class EquipItemEvent extends ItemEvent {
  static Event = ItemEvents.Equip;

  constructor(origin: NodeCursor, public item: NodeCursor) {
    super(origin);
  }
}

export class OpemItemMenuEvent extends ItemEvent {
  static Event = ItemEvents.OpenMenu;
  constructor(origin: NodeCursor, public item: NodeCursor) {
    super(origin);
  }
}
