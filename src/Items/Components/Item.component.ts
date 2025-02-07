import { NCS } from "@amodx/ncs/";
export const ItemComponent = NCS.registerComponent({
  type: "item",
  schema: NCS.schema({
    name: NCS.property(""),
    textureSrc: NCS.property(""),
  }),
});
