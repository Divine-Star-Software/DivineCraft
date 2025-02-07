import { NodeCursor } from "@amodx/ncs/";
import { InventoryComponent } from "Items/Components/Inventory/Inventory.component";
import { useMemo } from "react";

export default function useInventory(node: NodeCursor) {
  const inventory = useMemo(() => {
    return InventoryComponent.get(node)!;
  }, [node.index]);

  return {
    inventory,
    get size() {
      return inventory.schema.size;
    },
  };
}
