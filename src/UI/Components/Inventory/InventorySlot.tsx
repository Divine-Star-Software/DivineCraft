import { NodeCursor } from "@amodx/ncs/";
import React, { useEffect, useState } from "react";
import useInventorySlot from "./useInventorySlot";
import { useDragNDrop } from "../../Hooks/useDragNDrop";
import { Item } from "./Item";
import useInventory from "./useInventory";

export const InventorySlot: React.FC<{
  node: NodeCursor;
  inventoryNode: NodeCursor;
  locked?: boolean;
}> = ({ node, inventoryNode, locked }) => {
  const { inventorySlot, getInventoryItem, slotUpdated } =
    useInventorySlot(node);
  const { inventory } = useInventory(inventoryNode);

  const [active, setActive] = useState(
    inventorySlot?.schema.index == inventory.schema.activeIndex
  );

  useEffect(() => {
    const listener = (value: number) => {
      if (inventorySlot?.schema.index == value) {
        setActive(() => true);
      } else {
        setActive(() => false);
      }
    };
    const observer = inventory.schema
      .getCursor()
      .getOrCreateObserver(inventory.schema.getSchemaIndex().activeIndex);

    observer.subscribe(listener);

    return () => {
      observer.unsubscribe(listener);
    };
  }, []);

  const [item, setItem] = useState(getInventoryItem());
  slotUpdated.clear();
  slotUpdated.subscribe(() => {
    setItem(getInventoryItem());
  });

  let dragProps: any = {};
  if (!locked) {
    const [observers, ref, props] = useDragNDrop({ drag: false, drop: true });
    dragProps = props;
    observers.dropped.clear();
    observers.dropped.subscribe(([transfer]) => {
      const nodeId = Number(transfer.getData("text/plain"));

      const droppedNode = inventorySlot.node.graph
        .getNode(nodeId)
        .cloneCursor();

      inventory.data.addItem(inventorySlot!.schema.index, droppedNode);
    });
  }

  return (
    <div
      {...dragProps}
      className={`inventory-slot ${active ? "active" : ""} ${locked ? "locked" : ""}`}
      onContextMenu={(event) => {
        event.preventDefault();
        if (locked) return;
        inventory!.data.removeItem(inventorySlot!.schema.index);
      }}
    >
      {item && <Item node={item} />}
    </div>
  );
};
