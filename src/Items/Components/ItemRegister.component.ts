import { NCS } from "@amodx/ncs/";
import { ItemRegisterEntryComponent } from "./ItemRegisterEntry.component";
class Data {
  items = new Map<string, number>();
  constructor(public component: (typeof ItemRegisterComponent)["default"]) {}
  getItem(id: string) {
    const item = this.component.data.items.get(id);
    if (!item) throw new Error(`Item with id ${id} does not exist`);
    return item;
  }
}
export const ItemRegisterComponent = NCS.registerComponent<Data>({
  type: "item-register",
  init(component) {
    component.data = new Data(component.cloneCursor());
    for (const child of component.node.children()) {
      const entry = ItemRegisterEntryComponent.get(child);
      if (!entry) continue;
      component.data.items.set(entry.schema.id, entry.node.index);
      entry.returnCursor();
    }
  },
  dispose: (component) => component.data.component.returnCursor(),
});
