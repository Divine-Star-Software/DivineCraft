import { NCS } from "@amodx/ncs/";
import { Observable } from "@amodx/core/Observers";
import { Vector2Like } from "@amodx/math";
import { Node, NodeCursor } from "@amodx/ncs/";
import { InventoryComponent } from "Items/Components/Inventory/Inventory.component";
import { InventoryEvents } from "Items/Components/Inventory/InventoryEvents";

class Data {
  inventory: (typeof InventoryComponent)["default"];

  offHandInventory: (typeof InventoryComponent)["default"];


  constructor(
    public playerNode: NodeCursor,
    public inventoryNode: NodeCursor,
    public offHandInventoryNode: NodeCursor
  ) {
    this.inventory = InventoryComponent.get(inventoryNode)!;
    this.offHandInventory = InventoryComponent.get(offHandInventoryNode)!;
  
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
            inventorySize.y
          )
        ),
        component.node.index
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
          ...InventoryComponent.shared!.CreateSlots(1, 1)
        ),
        component.node.index
      )
      .cloneCursor();

    component.data = new Data(
      component.node.cloneCursor(),
      inventoryNode,
      offHandInventoryNode
    );
  },
  dispose(component) {
    component.data.playerNode.returnCursor();
    component.data.inventoryNode.returnCursor();
    component.data.offHandInventoryNode.returnCursor();
  },
});
