import { NodeCursor } from "@amodx/ncs/";
import useInventory from "./useInventory";
import { useMemo } from "react";
import { InventorySlot } from "./InventorySlot";
import "./Inventory.css";
export const Inventory: React.FC<{
  node: NodeCursor;
  activeIndex?: number;
}> = ({ node }) => {
  const { inventory, size } = useInventory(node);

  const inventorySlots = useMemo(() => {
    const slots: NodeCursor[][] = [];
    for (let y = 0; y < size.y; y++) {
      slots[y] ??= [];
      for (let x = 0; x < size.x; x++) {
        slots[y][x] = inventory.data.getSlot(x, y);
      }
    }

    return slots;
  }, [inventory.node.index]);

  return (
    <span className="inventory">
      {inventorySlots.map((_, rowIndex) => (
        <div key={rowIndex} className="inventory-row">
          {_.map((_, index) => (
            <InventorySlot
              key={index}
              node={_}
              inventoryNode={inventory.node}
              locked={inventory.schema.locked}
            />
          ))}
        </div>
      ))}
    </span>
  );
};
