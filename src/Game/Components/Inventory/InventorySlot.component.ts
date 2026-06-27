import { NCS } from "@amodx/ncs/";
export const InventorySlotComponent = NCS.registerComponent({
  type: "inventory-slot",
  schema: NCS.schema({
    index: NCS.property(0),
  }),
});
