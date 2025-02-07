import { Observable } from "@amodx/core/Observers";
import { NodeCursor } from "@amodx/ncs/";
import { InventorySlotComponent } from "Items/Components/Inventory/InventorySlot.component";
import { useEffect, useMemo } from "react";

export default function useInventorySlot(node: NodeCursor) {
  const inventorySlot = useMemo(() => {
    return InventorySlotComponent.getRequired(node);
  }, [node.index]);

  const slotUpdated = useMemo(() => {
    const observer = new Observable();
    return observer;
  }, [node.index]);

  useEffect(() => {
    const listener = () => {
      slotUpdated.notify();
    };
    inventorySlot.node.observers.childAdded.subscribe(listener);
    inventorySlot.node.observers.childRemoved.subscribe(listener);
    return () => {
      inventorySlot.node.observers.childAdded.unsubscribe(listener);
      inventorySlot.node.observers.childRemoved.unsubscribe(listener);
    };
  }, [node.index]);

  return {
    slotUpdated,
    inventorySlot,
    get index() {
      return inventorySlot.schema.index;
    },
    getInventoryItem() {
      if (
        inventorySlot.node.childrenArray &&
        !inventorySlot.node.childrenArray.length
      )
        return null;

      const node = inventorySlot.node.getChild(0);

      return node;
    },
  };
}
