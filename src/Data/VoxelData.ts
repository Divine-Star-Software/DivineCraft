import { VoxelData } from "@divinevoxel/core";

export const voxelData: VoxelData[] = [
  //dream
  {
    id: "dc_cobble_stone",
    tags: [
      ["#dve_substance", "#dve_solid"],
      ["#dve_shape_id", "#dve_box"],
      ["#dve_collider_id", "#dve_box"],
      ["#dve_check_collisions", true],
      ["#dve_material", "stone"],
    ],
  },
  {
    id: "dc_stone",
    tags: [
      ["#dve_substance", "#dve_solid"],
      ["#dve_shape_id", "#dve_box"],
      ["#dve_collider_id", "#dve_box"],
      ["#dve_check_collisions", true],
      ["#dve_material", "stone"],
    ],
  },
  {
    id: "dc_sand",
    tags: [
      ["#dve_substance", "#dve_solid"],
      ["#dve_shape_id", "#dve_box"],
      ["#dve_collider_id", "#dve_box"],
      ["#dve_check_collisions", true],
      ["#dve_material", "sand"],
    ],
  },
  {
    id: "dc_grass_block",
    tags: [
      ["#dve_substance", "#dve_solid"],
      ["#dve_shape_id", "#dve_box"],
      ["#dve_collider_id", "#dve_box"],
      ["#dve_check_collisions", true],
      ["#dve_material", "grass"],
    ],
  },
  {
    id: "dc_dirt",
    tags: [
      ["#dve_substance", "#dve_solid"],
      ["#dve_shape_id", "#dve_box"],
      ["#dve_collider_id", "#dve_box"],
      ["#dve_check_collisions", true],
      ["#dve_material", "dirt"],
    ],
  },
  {
    id: "dc_glow_stone",
    tags: [
      ["#dve_substance", "#dve_glow"],
      ["#dve_shape_id", "#dve_box"],
      ["#dve_is_light_source", true],
      ["#dve_light_value", [15, 15, 15]],
      ["#dve_collider_id", "#dve_box"],
      ["#dve_check_collisions", true],
      ["#dve_material", "stone"],
    ],
  },
  {
    id: "dc_oak_log",
    tags: [
      ["#dve_substance", "#dve_solid"],
      ["#dve_shape_id", "#dve_box"],
      ["#dve_collider_id", "#dve_box"],
      ["#dve_check_collisions", true],
      ["#dve_material", "wood"],
    ],
  },
  {
    id: "dc_oak_leaves",
    tags: [
      ["#dve_substance", "#dve_flora"],
      ["#dve_shape_id", "#dve_box"],
      ["#dve_collider_id", "#dve_box"],
      ["#dve_check_collisions", true],
      ["#dve_material", "grass"],
    ],
  },
  {
    id: "dc_water",
    tags: [
      ["#dve_substance", "#dve_liquid"],
      ["#dve_shape_id", "#dve_liquid"],
      ["#dve_collider_id", "#dve_box"],
      ["#dve_check_collisions", true],
      ["#dve_material", "water"],
    ],
  },
];
