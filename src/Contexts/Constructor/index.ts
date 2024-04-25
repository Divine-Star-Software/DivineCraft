import { StartContrusctor } from "@divinevoxel/foundation/Default/Init/StartConstructor";
import { DVEDefaultBuilder } from "@divinevoxel/foundation/Default/Builder/Builder";
const defaults = DVEDefaultBuilder.defaults;
await StartContrusctor({
  builder: {
    constructors: [
      defaults.box.simple("dc_grass_block", {
        top: ["#dve_solid", "dc_grass_block",],
        bottom: ["#dve_solid", "dc_grass_block", "bottom"],
        north: ["#dve_solid", "dc_grass_block", "side"],
        south: ["#dve_solid", "dc_grass_block", "side"],
        east: ["#dve_solid", "dc_grass_block", "side"],
        west: ["#dve_solid", "dc_grass_block", "side"],
      }),
      defaults.box.simple("dc_cobble_stone", [
        "#dve_solid",
        "dc_cobble_stone",
      ]),
      defaults.box.simple("dc_dirt", [
        "#dve_solid",
        "dc_dirt",
      ]),
      defaults.box.simple("dc_glow_stone", [
        "#dve_glow",
        "dc_glow_stone",
      ]),
      defaults.liquid.simple("dc_water", [
        ["#dve_liquid", "dc_water"],
        ["#dve_liquid", "dc_water"],
      ]),
      defaults.box.simple("dc_oak_leaves", [
        "#dve_flora",
        "dc_oak_leaves",
      ]),
      defaults.box.simple("dc_oak_log", [
        "#dve_solid",
        "dc_oak_log",
      ]),
      defaults.box.simple("dc_sand", [
        "#dve_solid",
        "dc_sand",
      ]),
      defaults.box.simple("dc_stone", [
        "#dve_solid",
        "dc_stone",
      ]),
    ],
  },
});
