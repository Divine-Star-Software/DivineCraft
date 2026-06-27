import { NCS } from "@amodx/ncs/";
export const ItemRegisterEntryComponent = NCS.registerComponent({
  type: "item-register-entry",
  schema: NCS.schema({
    id: NCS.property(""),
    name: NCS.property(""),
    categoryId: NCS.property(""),
    groupId: NCS.property(""),
    textureSrc: NCS.property(""),
  }),
});
