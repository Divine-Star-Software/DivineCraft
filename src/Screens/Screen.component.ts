import { NCS } from "@amodx/ncs";
export const ScreenComponent = NCS.registerComponent({
  type: "screen",
  schema: NCS.schema({
    id: NCS.property(""),
    active: NCS.property(false),
  }),
});