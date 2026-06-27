import { elm } from "@amodx/elm";
import { NCS, NodeCursor } from "@amodx/ncs";
import {
  InventoryComponent,
  InventorySlotComponent,
} from "Game/Components/Inventory";
export class ItemDrag {
  static Create(
    originItemElement: HTMLElement,
    item: NodeCursor,
    inventory?: NodeCursor,
  ) {
    new ItemDrag(originItemElement, item, inventory);
  }
  itemElement: HTMLElement;

  constructor(
    public originItemElement: HTMLElement,
    public item: NodeCursor,
    public inventory?: NodeCursor,
  ) {
    this.itemElement = originItemElement.cloneNode(true) as any;
    this.itemElement.className = "dragging-item-node";
    document.body.append(this.itemElement);
    if (this.inventory) this.originItemElement.style.display = "none";

    window.document.body.style.cursor = "grabbing";
    window.addEventListener("pointermove", this.pointerMove);
    window.addEventListener("pointerup", this.pointerUp);
    window.addEventListener("blur", this.blured);
  }

  blured = () => {
    this.dispose();
  };

  pointerMove = (event: PointerEvent) => {
    const { clientX, clientY } = event;
    this.itemElement.style.left = clientX + "px";
    this.itemElement.style.top = clientY + "px";
  };

  pointerUp = (event: PointerEvent) => {
    try {
      const dropEl = document.elementFromPoint(
        event.clientX,
        event.clientY,
      ) as HTMLElement | null;
      const inventorySlotElement = dropEl
        ? elm.findParent(dropEl, "inventory-slot")
        : null;

      if (inventorySlotElement) {
        const inventorySlotNodeIndex = Number(
          inventorySlotElement.dataset["index"],
        );
        const inventorySlotNode = this.item.graph.getNode(
          inventorySlotNodeIndex,
        );
        const inventorySlot =
          InventorySlotComponent.getRequired(inventorySlotNode);
        const inventory =
          InventoryComponent.getRequiredParent(inventorySlotNode);

        if (this.inventory) {
          const nodesInventory = InventoryComponent.getRequired(this.inventory);
          if (nodesInventory.index == inventory.index) {
            if (
              inventorySlot.schema.index !==
              InventorySlotComponent.getRequiredParent(this.item).schema.index
            ) {
              inventory.data.removeItem(inventorySlot!.schema.index);
              inventory.data.moveItem(inventorySlot!.schema.index, this.item);
            }
          } else {
            inventory.data.removeItem(inventorySlot!.schema.index);
            nodesInventory.data.moveItemToInventory(
              inventory.node,
              inventorySlot!.schema.index,
              this.item,
            );
          }
        } else {
          inventory.data.removeItem(inventorySlot!.schema.index);
          inventory.data.addItem(inventorySlot!.schema.index, this.item);
        }
      }
    } catch (error) {
      console.error("Error while dropping item", error);
    } finally {
      this.dispose();
    }
  };

  dispose() {
    if (this.inventory && this.originItemElement.isConnected) {
      this.originItemElement.style.display = "";
    }
    window.document.body.style.cursor = "";
    this.itemElement.remove();
    window.removeEventListener("pointermove", this.pointerMove);
    window.removeEventListener("pointerup", this.pointerUp);
    window.removeEventListener("blur", this.blured);
  }
}
