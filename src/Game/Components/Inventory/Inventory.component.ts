import { Flat2DIndex } from "@amodx/math/Volumes";
import { Vector2Like } from "@amodx/math";
import { InventorySlotComponent } from "./InventorySlot.component";
import {
  AddItemEvent,
  RemoveItemEvent,
  ItemsUpdatedEvent,
} from "./InventoryEvents";
import { ItemComponent } from "./Item.component";
import { ItemRegisterEntryComponent } from "./ItemRegisterEntry.component";
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

  addItem(index: number, itemNode: NodeCursor) {
    if (this.hasItem(index)) this.removeItem(index);
    this.node.events.dispatch(
      AddItemEvent.Event,
      new AddItemEvent(this.component.node, itemNode, [
        ...this.index.getXY(index),
      ])
    );
  }

  moveItem(index: number, itemNode: NodeCursor) {
    const invetnorySlot = InventorySlotComponent.getRequiredParent(itemNode);
    this.getSlot(invetnorySlot.schema.index).removeChild(0);
    if (this.hasItem(index)) this.removeItem(index);
    this.getSlot(index).addChild(itemNode);
    this.node.events.dispatch(
      ItemsUpdatedEvent.Event,
      new ItemsUpdatedEvent(this.node)
    );
    invetnorySlot.returnCursor();
  }

  moveItemToInventory(
    inventoryNode: NodeCursor,
    slotIndex: number,
    itemNode: NodeCursor
  ) {
    const invetnorySlot = InventorySlotComponent.getRequiredParent(itemNode);
    const otherInventory = InventoryComponent.getRequired(inventoryNode);
    const itemData = NCS.serializeNode(itemNode);
    this.removeItem(invetnorySlot.schema.index);

    otherInventory.data.addItem(
      slotIndex,
      this.node.graph.addNode(NCS.deserializeNodeData(itemData))
    );

    invetnorySlot.returnCursor();
    otherInventory.returnCursor();
  }

  removeItem(index: number) {
    const slot = this.getSlot(index);
    const node = slot.getChild(0);
    if (!node) return;
    this.node.events.dispatch(
      RemoveItemEvent.Event,
      new RemoveItemEvent(this.component.node, node, [
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

  hasItem(index: number) {
    return this.getSlot(index).getChild(0) !== null;
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
  data: NCS.data<Data>(),
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

    const removeItemListener = (event: RemoveItemEvent) => {
      const slot = data.getSlot(...event.index);
      const slotItem = slot.getChild(0);
      if (slotItem) {
        slot.removeChild(0);
        slotItem.dispose();
        data.node.events.dispatch(
          ItemsUpdatedEvent.Event,
          new ItemsUpdatedEvent(data.node)
        );
        slotItem.returnCursor();
      }
    };

    component.node.events.addListener(
      RemoveItemEvent.Event,
      removeItemListener
    );

    const itemAddedListener = (event: AddItemEvent) => {
      const slot = data.getSlot(...event.index);
      const itemNode = event.item;
      const entry = ItemRegisterEntryComponent.get(itemNode);
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

        data.node.graph.addNode(
          NCS.deserializeNodeData(newItemNode),
          slot.index
        );
      } else {
        itemNode.parentTo(slot);
      }

      data.node.events.dispatch(
        ItemsUpdatedEvent.Event,
        new ItemsUpdatedEvent(data.node)
      );
    };

    component.node.events.addListener(AddItemEvent.Event, itemAddedListener);

    component.data._cleanUp = () => {
      data.node.events.removeListener(AddItemEvent.Event, itemAddedListener);
      data.node.events.removeListener(
        RemoveItemEvent.Event,
        removeItemListener
      );
    };
  },
  dispose(component) {
    component.data._cleanUp();
  },
});
