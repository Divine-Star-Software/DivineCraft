import { Flat2DIndex } from "@amodx/math/Volumes";
import { Vector2Like } from "@amodx/math";
import { InventorySlotComponent } from "./InventorySlot.component";
import {
  AddItemEvent,
  InventoryEvents,
  ItemsUpdatedEvet,
  RemoveItemEvents,
} from "./InventoryEvents";
import { ItemComponent } from "../Item.component";
import { ItemRegisterEntryComponent } from "../ItemRegisterEntry.component";
import {
  CreateNodeData,
  NCS,
  Node,
  NodeCursor,
  SerializedNodeData,
} from "@amodx/ncs/";

class Data {
  _cleanUp: () => void;
  index = Flat2DIndex.GetXYOrder();
  slots: NodeCursor[] = [];

  get node() {
    return this.component.node;
  }

  constructor(public component: (typeof InventoryComponent)["default"]) {}

  addItem(index: number, node: NodeCursor) {
    this.node.events.dispatch(
      AddItemEvent.Event,
      new AddItemEvent(this.component.node, node, [...this.index.getXY(index)])
    );
  }

  removeItem(index: number) {
    const slot = this.getSlot(index);
    const node = slot.getChild(0);
    if (!node) return;
    this.node.events.dispatch(
      RemoveItemEvents.Event,
      new RemoveItemEvents(this.component.node, node, [
        ...this.index.getXY(index),
      ])
    );
    node.returnCursor();
  }

  getSlot(index: number): NodeCursor;
  getSlot(x: number, y: number): NodeCursor;

  getSlot(x: number, y?: number) {
    let index = x;
    if (x !== undefined && y !== undefined) {
      index = this.index.getIndexXY(x, y);
    }
    const slot = this.slots[index];
    if (!slot)
      throw new RangeError(`${x}-${y} is out of range for the inventory.`);
    return slot;
  }
}

const indexer = Flat2DIndex.GetXYOrder();
class Shared {
  CreateSlots(width: number, height: number) {
    const slots: CreateNodeData[] = [];
    indexer.setBounds(width, height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        slots.push(
          Node(`Slot x: ${x} y: ${y}`, [
            InventorySlotComponent({
              index: indexer.getIndexXY(x, y),
            }),
          ])
        );
      }
    }

    return slots;
  }
  GetSlotIndeX(
    inventoryWidth: number,
    inventoryHeight: number,
    slotX: number,
    slotY: number
  ) {
    indexer.setBounds(inventoryWidth, inventoryHeight);
    return indexer.getIndexXY(slotX, slotY);
  }
}


export const InventoryComponent = NCS.registerComponent({
  type: "inventory",
  shared: new Shared(),
  schema: NCS.schema({
    activeIndex: NCS.property(0),
    size: NCS.property(Vector2Like.Create(1, 1)),
    locked: NCS.property(false),
  }),
  init(component) {
    const data = new Data(component.cloneCursor());
    component.data = data;
    component.data.index.setBounds(
      component.schema.size.x,
      component.schema.size.y
    );

    for (const child of component.node.children()) {
      const slotComponent = InventorySlotComponent.get(child);
      if (slotComponent) {
        component.data.slots[slotComponent.schema.index] = child.cloneCursor();
      }
    }

    const removeItemListener = (event: RemoveItemEvents) => {
      const slot = data.getSlot(...event.index);
      const slotItem = slot.getChild(0);
      if (slotItem) {
        slotItem.dispose();
        data.component.node.events.dispatch(
          InventoryEvents.ItemsUpdated,
          new ItemsUpdatedEvet(data.component.node)
        );
        slotItem.returnCursor();
      }
    };

    component.node.events.addListener(
      InventoryEvents.RemoveItem,
      removeItemListener
    );

    const itemAddedListener = (event: AddItemEvent) => {
      console.warn("add item", event, event.item.index, event.item.name);
      const slot = data.getSlot(...event.index);
      const itemNode = event.item;

      for (const comp of itemNode.traverseComponents()) {
        console.log(comp.type, comp.schema?.toJSON());
      }

      const entry = ItemRegisterEntryComponent.get(itemNode);
      console.log(entry, entry?.schema);
      if (entry) {
        const newItemNode: SerializedNodeData = NCS.serializeNode(itemNode);
        newItemNode.components ??= [];
        newItemNode.components.push(
          NCS.serializeComponentData(
            ItemComponent({
              name: entry.schema.name,
              textureSrc: entry.schema.textureSrc,
            })
          )
        );
        newItemNode.components = newItemNode.components.filter(
          (_) => _.type != ItemRegisterEntryComponent.type
        );
        console.warn(
          "ADD NEW NODE",
          newItemNode,
          NCS.deserializeNodeData(newItemNode)
        );
        data.node.graph.addNode(
          NCS.deserializeNodeData(newItemNode),
          slot.index
        );
      } else {
        itemNode.parentTo(slot);
      }

      data.node.events.dispatch(
        InventoryEvents.ItemsUpdated,
        new ItemsUpdatedEvet(component.node)
      );
    };

    component.node.events.addListener(
      InventoryEvents.AddItem,
      itemAddedListener
    );

    component.data._cleanUp = () => {
      data.node.events.removeListener(
        InventoryEvents.AddItem,
        itemAddedListener
      );
      data.node.events.removeListener(
        InventoryEvents.RemoveItem,
        removeItemListener
      );
    };
  },
  dispose(component) {
    component.data._cleanUp();
  },
});
