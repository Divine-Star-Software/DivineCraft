import { NCS } from "@amodx/ncs/";
import { Vector2Like } from "@amodx/math";
import { Node, NodeCursor } from "@amodx/ncs/";
import {
  InventoryComponent,
  InventorySlotComponent,
  ItemsUpdatedEvent,
} from "../Inventory";

class Data {
  inventory: (typeof InventoryComponent)["default"];
  offHandInventory: (typeof InventoryComponent)["default"];

  constructor(
    public playerNode: NodeCursor,
    public inventoryNode: NodeCursor,
    public offHandInventoryNode: NodeCursor,
  ) {
    this.inventory = InventoryComponent.get(inventoryNode)!;
    this.offHandInventory = InventoryComponent.get(offHandInventoryNode)!;
  }

  clearInventory() {
    for (const child of this.offHandInventoryNode.children()) {
      const item = child.getChild(0);
      if (item) item.dispose();
    }
    for (const child of this.inventoryNode.children()) {
      const item = child.getChild(0);
      if (item) item.dispose();
    }
  }

  getOffHandItem() {
    const item = this.offHandInventory.data.getSlot(0).getChild(0);
    return item || null;
  }

  getItem() {
    const item = this.inventory.data
      .getSlot(this.inventory.schema.activeIndex)
      .getChild(0);

    return item || null;
  }

  swap() {
    const offHandSlot = this.offHandInventory.data.getSlot(0);
    const mainSlot = this.inventory.data.getSlot(
      this.inventory.schema.activeIndex,
    );
    const child1 = offHandSlot.getChild(0);
    const child1Data = child1 ? NCS.serializeNode(child1) : null;
    const child2 = mainSlot.getChild(0);
    const child2Data = child2 ? NCS.serializeNode(child2) : null;

    const slot = InventorySlotComponent.getRequired(mainSlot);

    this.offHandInventory.data.removeItem(0);
    this.inventory.data.removeItem(slot.schema.index);

    if (child2Data)
      this.offHandInventory.data.addItem(
        0,
        this.inventoryNode.graph.addNode(NCS.deserializeNodeData(child2Data)),
      );

    if (child1Data)
      this.inventory.data.addItem(
        slot.schema.index,
        this.inventoryNode.graph.addNode(NCS.deserializeNodeData(child1Data)),
      );
  }
}

export const PlayerInventoryComponent = NCS.registerComponent({
  type: "player-inventory",
  data: NCS.data<Data>(),
  init(component) {
    const graph = component.node.graph;
    const inventorySize: Vector2Like = { x: 9, y: 1 };
    const inventoryNode = graph
      .addNode(
        Node(
          "Main Inventory",
          [
            InventoryComponent({
              size: inventorySize,
            }),
          ],
          ...InventoryComponent.shared!.CreateSlots(
            inventorySize.x,
            inventorySize.y,
          ),
        ),
        component.node.index,
      )
      .cloneCursor();

    const offHandInventoryNode = graph
      .addNode(
        Node(
          "Off Hand Inventory",
          [
            InventoryComponent({
              size: { x: 1, y: 1 },
            }),
          ],
          ...InventoryComponent.shared!.CreateSlots(1, 1),
        ),
        component.node.index,
      )
      .cloneCursor();

    component.data = new Data(
      component.node.cloneCursor(),
      inventoryNode,
      offHandInventoryNode,
    );
  },
  dispose(component) {
    component.data.playerNode.returnCursor();
    component.data.inventoryNode.returnCursor();
    component.data.offHandInventoryNode.returnCursor();
  },
});
