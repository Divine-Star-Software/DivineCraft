import { NodeCursor } from "@amodx/ncs/";
import { elm } from "@amodx/elm";
import {
  InventoryComponent,
  InventorySlotComponent,
  ItemComponent,
} from "Game/Components/Inventory";
import { ItemDrag } from "./ItemDrag";
import "./Inventory.css";
function InventorySlot({
  node,
  locked,
  active,
}: {
  node: NodeCursor;
  inventoryNode: NodeCursor;
  locked?: boolean;
  active?: boolean;
}) {
  const childNode = node.getChild(0);
  return elm(
    "div",
    {
      className: `inventory-slot ${active ? "active" : ""} ${
        locked ? "locked" : ""
      }`,
      dataset: {
        index: String(node.index),
      },
    },
    childNode && Item({ node: childNode })
  );
}
function Item({ node }: { node: NodeCursor }) {
  const item = ItemComponent.getRequired(node);
  let className = "item";
  if (item.schema.attributes.includes("custom")) className += " custom";
  return elm(
    "div",
    {
      className,
      draggable: false,
    },
    elm("img", {
      className: "item-image",
      src: item!.schema.textureSrc,
    })
  );
}

export function Inventory({
  node,
}: {
  node: NodeCursor;
  activeIndex?: number;
}) {
  const inventory = InventoryComponent.getRequired(node);
  const size = inventory.schema.size;
  const updatedListener = (node: NodeCursor) => {
    const slotComponent = InventorySlotComponent.getRequired(node);
    const index = slotComponent.schema.index;
    const element = slotElements[index];
    element.replaceChildren();
    if (node.childrenArray && !node.childrenArray.length) return null;
    const childNode = node.getChild(0);
    if (childNode) element.append(Item({ node: childNode }));
  };

  const slots: NodeCursor[][] = [];
  for (let y = 0; y < size.y; y++) {
    slots[y] ??= [];
    for (let x = 0; x < size.x; x++) {
      const inventorySlot = inventory.data.getSlot(x, y);
      slots[y][x] = inventorySlot;
      inventorySlot.observers.childrenUpdated.subscribe(updatedListener);
    }
  }

  const slotElements: HTMLDivElement[] = [];

  const activeIndexListener = () => {
    for (let i = 0; i < slotElements.length; i++) {
      const isActive = i == inventory.schema.activeIndex;
      const slotElement = slotElements[i];
      isActive
        ? slotElement!.classList.add("active")
        : slotElement!.classList.remove("active");
    }
  };
  const activeIndexObserver = inventory.schema
    .getCursor()
    .getOrCreateObserver(inventory.schema.getSchemaIndex().activeIndex);

  activeIndexObserver.subscribe(activeIndexListener);

  return elm(
    "div",
    {
      className: "inventory",
      draggable: false,
      onwheel(ev) {
        ev.stopPropagation();
      },
      ondrag(ev) {
        ev.preventDefault();
        ev.stopPropagation();
      },
      ondragstart(ev) {
        ev.preventDefault();
        ev.stopPropagation();
      },
      oncontextmenu(ev) {
        ev.preventDefault();
        ev.stopPropagation();
      },
      onpointerdown(ev) {
        if (ev.button == 1) return;
        const target = ev.target as HTMLElement;
        const inventorySlotElement = elm.findParent(target, "inventory-slot");
        if (inventorySlotElement) {
          const inventorySlotIndex = Number(
            inventorySlotElement.dataset["index"]
          );
          const inventorySlotNode =
            inventory.node.graph.getNode(inventorySlotIndex);
          const item = inventorySlotNode.getChild(0);
          if (!item) return;
          if (ev.button == 2) {
            const inventorySlot =
              InventorySlotComponent.getRequired(inventorySlotNode);
            inventory.data.removeItem(inventorySlot.schema.index);
          } else {
            new ItemDrag(
              elm.findChild(inventorySlotElement, "item")!,
              item,
              node
            );
          }
        }
      },
      hooks: {
        unmount() {
          activeIndexObserver.unsubscribe(activeIndexListener);
          for (let y = 0; y < size.y; y++) {
            for (let x = 0; x < size.x; x++) {
              const inventorySlot = inventory.data.getSlot(x, y);
              inventorySlot.observers.childrenUpdated.unsubscribe(
                updatedListener
              );
            }
          }
        },
      },
    },
    slots.map((row) =>
      elm(
        "div",
        "inventory-row",
        row.map((node, i) => {
          const slotElement = InventorySlot({
            node,
            inventoryNode: inventory.node,
            locked: inventory.schema.locked,
            active: inventory.schema.activeIndex == i,
          });
          slotElements.push(slotElement);
          return slotElement;
        })
      )
    )
  );
}
