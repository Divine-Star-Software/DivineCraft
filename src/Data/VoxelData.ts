import { VoxelData } from "@divinevoxel/vlox";

export const voxelData: VoxelData[] = [
  //dream
  {
    id: "70764e8a",
    name: "dc_cobble_stone",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "stone",
      dve_named_states: [
        {
          id: "dc_cobble_stone",
          name: "Cobblestone",
          mod: "varation=default",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "varation=default",
            state: "*",
          },
        },
        {
          id: "dc_mossy_cobblestone",
          name: "Mossy Cobblestone",
          mod: "varation=mossy",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "varation=mossy",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modSchema: [
          {
            name: "varation",
            type: "string",
            values: ["default", "mossy"],
          },
        ],
        modRelationSchema: [],
        inputs: {
          "varation=default": {
            texture: "dc_cobble_stone",
          },
          "varation=mossy": {
            texture: "dc_mossy_cobble_stone",
          },
        },
      },
    },
  },
  {
    id: "e59f4ec4",
    name: "dc_water",
    properties: {
      dve_substance: "dve_liquid",
      dve_rendered_material: "dve_liquid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "water",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_can_have_secondary: true,
      dve_model_data: {
        id: "dve_liquid",
        inputs: {
          "*": {
            flowTexture: "dc_water:flow",
            stillTexture: "dc_water:still",
          },
        },
      },
    },
  },
  {
    id: "6f89ecfa",
    name: "dc_stone",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "stone",
      dve_named_states: [
        {
          id: "dc_stone",
          name: "Stone",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_stone" },
        },
      },
    },
  },
  {
    id: "dfc9678f",
    name: "dc_sand",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "sand",
      dve_named_states: [
        {
          id: "dc_sand",
          name: "Sand",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_sand" },
        },
      },
    },
  },
  {
    id: "8538a60d",
    name: "dc_grass_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "grass",
      dve_named_states: [
        {
          id: "dc_grass_block",
          name: "Grass Block",
          mod: "snowed=false",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "snowed=false",
            state: "*",
          },
        },
        {
          id: "dc_snowed_grass_block",
          name: "Snowed Grass Block",
          mod: "snowed=false",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "snowed=true",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_oriented_cube",
        modSchema: [
          {
            name: "snowed",
            type: "string",
            values: ["false", "true"],
          },
        ],
        modRelationSchema: [],
        inputs: {
          "snowed=false": {
            upTex: "dc_grass_block:top",
            downTex: "dc_dirt",
            northTex: "dc_grass_block:side",
            southTex: "dc_grass_block:side",
            eastTex: "dc_grass_block:side",
            westTex: "dc_grass_block:side",
          },
          "snowed=true": {
            upTex: "dc_snow",
            downTex: "dc_dirt",
            northTex: "dc_grass_block:snowed",
            southTex: "dc_grass_block:snowed",
            eastTex: "dc_grass_block:snowed",
            westTex: "dc_grass_block:snowed",
          },
        },
      },
    },
  },
  {
    id: "19384995",
    name: "dc_dirt",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "dirt",
      dve_named_states: [
        {
          id: "dc_dirt",
          name: "Dirt",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_dirt" },
        },
      },
    },
  },
  {
    id: "f186c5f1",
    name: "dc_glow_stone",
    properties: {
      dve_substance: "dve_glow",
      dve_rendered_material: "dve_glow",
      dve_is_light_source: true,
      dve_light_value: [15, 15, 15],
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "stone",
      dve_named_states: [
        {
          id: "dc_glow_stone",
          name: "Glow Stone",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_glow_stone" },
        },
      },
    },
  },
  {
    id: "c8f7ed8e",
    name: "dc_sea_lantern",
    properties: {
      dve_substance: "dve_glow",
      dve_rendered_material: "dve_glow",
      dve_is_light_source: true,
      dve_light_value: [15, 15, 15],
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "stone",
      dve_named_states: [
        {
          id: "dc_sea_lantern",
          name: "stea Latern",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_sea_lantern" },
        },
      },
    },
  },
  {
    id: "ab4662d0",
    name: "dc_redstone_lamp",
    properties: {
      dve_substance: "dve_glow",
      dve_rendered_material: "dve_glow",
      dve_is_light_source: false,
      dve_light_value: [15, 15, 15],
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "stone",
      dve_can_be_powered: true,
      dve_logic_data: [
        {
          type: "powered",
          on: [
            {
              type: "tag",
              tagId: "dve_is_light_source",
              value: true,
            },
          ],
          off: [
            {
              type: "tag",
              tagId: "dve_is_light_source",
              value: false,
            },
          ],
        },
      ],
      dve_named_states: [
        {
          id: "dc_redstone_lamp",
          name: "Redstone Lamp",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_redstone_lamp:on" },
        },
      },
    },
  },
  // Wood and Leaves
  {
    id: "f0ea0f10",
    name: "dc_oak_leaves",
    properties: {
      dve_substance: "dve_flora",
      dve_is_transparent: true,
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "leaves",
      dve_named_states: [
        {
          id: "dc_oak_leaves",
          name: "Oak Leaves",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": {
            texture: "dc_oak_leaves",
            transparent: true,
          },
        },
      },
    },
  },
  {
    id: "425f37ce",
    name: "dc_oak_fence",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_oak_fence",
          name: "Oak Fence",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_fence",
        inputs: {
          "*": {
            upTex: "dc_oak_planks",
            downTex: "dc_oak_planks",
            northTex: "dc_oak_planks",
            southTex: "dc_oak_planks",
            eastTex: "dc_oak_planks",
            westTex: "dc_oak_planks",
          },
        },
      },
    },
  },
  {
    id: "7ed70bd5",
    name: "dc_oak_slab",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_stair",
      dve_check_collisions: true,
      dve_voxel_material: "stone",

      dve_named_states: [
        {
          id: "pvg_oak_plank_slab",
          name: "Oak Slab",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_half_cube",
        inputs: {
          "*": {
            upDownTextures: "dc_oak_planks",
            sideTextures: "dc_oak_planks",
          },
        },
      },
    },
  },
  {
    id: "fa1b6f06",
    name: "dc_oak_trap_door",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",

      dve_named_states: [
        {
          id: "dc_oak_trap_door",
          name: "Oak Trap Door",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_thin_panel",
        inputs: {
          "*": {
            upDownTextures: "dc_oak_trapdoor",
            sideTextures: "dc_oak_trapdoor",
            upDownTexturesTransparent: true,
          },
        },
      },
    },
  },
  {
    id: "25b0ee4b",
    name: "dc_oak_stairs",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_stair",
      dve_check_collisions: true,
      dve_voxel_material: "stone",

      dve_named_states: [
        {
          id: "dc_oak_stairs",
          name: "Oak Stairs",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "placement=down,direction=north,connected=false",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_stair",
        inputs: {
          "*": { texture: "dc_oak_planks" },
        },
      },
    },
  },
  {
    id: "ca00ccfb",
    name: "dc_oak_log",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_named_states: [
        {
          id: "dc_oak_log",
          name: "Oak Log",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_oriented_cube",
        modRelationSchema: [],
        inputs: {
          "*": {
            upTex: "dc_oak_log:top",
            downTex: "dc_oak_log:top",
            northTex: "dc_oak_log:side",
            southTex: "dc_oak_log:side",
            eastTex: "dc_oak_log:side",
            westTex: "dc_oak_log:side",
          },
        },
      },
    },
  },
  {
    id: "0261427b",
    name: "dc_oak_planks",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_named_states: [
        {
          id: "dc_oak_planks",
          name: "Oak Planks",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_oak_planks" },
        },
      },
    },
  },
  {
    id: "e2a00fc5",
    name: "dc_dark_oak_leaves",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_is_transparent: true,
      dve_voxel_material: "grass",
      dve_named_states: [
        {
          id: "dc_dark_oak_leaves",
          name: "Dark Oak Leaves",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": {
            texture: "dc_dark_oak_leaves",
            transparent: true,
          },
        },
      },
    },
  },
  {
    id: "b9fefdd8",
    name: "dc_dark_oak_log",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_named_states: [
        {
          id: "dc_dark_oak_log",
          name: "Dark Oak Log",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_oriented_cube",
        modRelationSchema: [],
        inputs: {
          "*": {
            upTex: "dc_dark_oak_log:top",
            downTex: "dc_dark_oak_log:top",
            northTex: "dc_dark_oak_log:side",
            southTex: "dc_dark_oak_log:side",
            eastTex: "dc_dark_oak_log:side",
            westTex: "dc_dark_oak_log:side",
          },
        },
      },
    },
  },
  {
    id: "afb4a173",
    name: "dc_dark_oak_planks",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_named_states: [
        {
          id: "dc_dark_oak_planks",
          name: "Dark Oak Log Planks",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_dark_oak_planks" },
        },
      },
    },
  },
  {
    id: "1389e932",
    name: "dc_dark_oak_fence",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_oak_fence",
          name: "Oak Fence",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_fence",
        inputs: {
          "*": {
            upTex: "dc_dark_oak_planks",
            downTex: "dc_dark_oak_planks",
            northTex: "dc_dark_oak_planks",
            southTex: "dc_dark_oak_planks",
            eastTex: "dc_dark_oak_planks",
            westTex: "dc_dark_oak_planks",
          },
        },
      },
    },
  },
  {
    id: "2009cf09",
    name: "dc_dark_oak_slab",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_stair",
      dve_check_collisions: true,
      dve_voxel_material: "stone",

      dve_named_states: [
        {
          id: "pvg_oak_plank_slab",
          name: "Oak Slab",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_half_cube",
        inputs: {
          "*": {
            upDownTextures: "dc_dark_oak_planks",
            sideTextures: "dc_dark_oak_planks",
          },
        },
      },
    },
  },
  {
    id: "ea11c01c",
    name: "dc_dark_oak_trap_door",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",

      dve_named_states: [
        {
          id: "dc_oak_trap_door",
          name: "Oak Trap Door",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_thin_panel",
        inputs: {
          "*": {
            upDownTextures: "dc_dark_oak_trapdoor",
            sideTextures: "dc_dark_oak_trapdoor",
            upDownTexturesTransparent: true,
          },
        },
      },
    },
  },
  {
    id: "c12fe26d",
    name: "dc_dark_oak_stairs",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_stair",
      dve_check_collisions: true,
      dve_voxel_material: "stone",

      dve_named_states: [
        {
          id: "dc_dark_oak_stairs",
          name: "Dark Oak Stairs",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "placement=down,direction=north,connected=false",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_stair",
        inputs: {
          "*": { texture: "dc_dark_oak_planks" },
        },
      },
    },
  },




  {
    id: "cc03dc84",
    name: "dc_acacia_leaves",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_is_transparent: true,
      dve_voxel_material: "grass",
      dve_named_states: [
        {
          id: "dc_acacia_leaves",
          name: "Acacia Leaves",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": {
            texture: "dc_acacia_leaves",
            transparent: true,
          },
        },
      },
    },
  },
  {
    id: "947ae26a",
    name: "dc_acacia_log",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_named_states: [
        {
          id: "dc_acacia_log",
          name: "Acacia Log",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_oriented_cube",
        modRelationSchema: [],
        inputs: {
          "*": {
            upTex: "dc_acacia_log:top",
            downTex: "dc_acacia_log:top",
            northTex: "dc_acacia_log:side",
            southTex: "dc_acacia_log:side",
            eastTex: "dc_acacia_log:side",
            westTex: "dc_acacia_log:side",
          },
        },
      },
    },
  },
  {
    id: "cded0e9a",
    name: "dc_acacia_planks",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_named_states: [
        {
          id: "dc_acacia_planks",
          name: "Acacia Planks",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_acacia_planks" },
        },
      },
    },
  },
  {
    id: "42a89bd3",
    name: "dc_acacia_fence",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_acacia_fence",
          name: "Acacia Fence",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_fence",
        inputs: {
          "*": {
            upTex: "dc_acacia_planks",
            downTex: "dc_acacia_planks",
            northTex: "dc_acacia_planks",
            southTex: "dc_acacia_planks",
            eastTex: "dc_acacia_planks",
            westTex: "dc_acacia_planks",
          },
        },
      },
    },
  },
  {
    id: "d489e148",
    name: "dc_acacia_slab",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_stair",
      dve_check_collisions: true,
      dve_voxel_material: "stone",

      dve_named_states: [
        {
          id: "dc_acacia_slab",
          name: "Acacia Slab",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_half_cube",
        inputs: {
          "*": {
            upDownTextures: "dc_acacia_planks",
            sideTextures: "dc_acacia_planks",
          },
        },
      },
    },
  },
  {
    id: "e9bc5ad2",
    name: "dc_acacia_trap_door",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",

      dve_named_states: [
        {
          id: "dc_acacia_trap_door",
          name: "Acacia Trap Door",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_thin_panel",
        inputs: {
          "*": {
            upDownTextures: "dc_acacia_trapdoor",
            sideTextures: "dc_acacia_trapdoor",
            upDownTexturesTransparent: true,
          },
        },
      },
    },
  },
  {
    id: "67d33357",
    name: "dc_acacia_stairs",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_stair",
      dve_check_collisions: true,
      dve_voxel_material: "stone",

      dve_named_states: [
        {
          id: "dc_acacia_stairs",
          name: "Acacia Stairs",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "placement=down,direction=north,connected=false",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_stair",
        inputs: {
          "*": { texture: "dc_acacia_planks" },
        },
      },
    },
  },



  {
    id: "4a0a9151",
    name: "dc_birch_leaves",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "grass",
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_birch_leaves",
          name: "Acacia Birch Leaves",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": {
            texture: "dc_birch_leaves",
            transparent: true,
          },
        },
      },
    },
  },
  {
    id: "cafc7e87",
    name: "dc_birch_log",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_named_states: [
        {
          id: "dc_birch_log",
          name: "Birch Log",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_oriented_cube",
        modRelationSchema: [],
        inputs: {
          "*": {
            upTex: "dc_birch_log:top",
            downTex: "dc_birch_log:top",
            northTex: "dc_birch_log:side",
            southTex: "dc_birch_log:side",
            eastTex: "dc_birch_log:side",
            westTex: "dc_birch_log:side",
          },
        },
      },
    },
  },
  {
    id: "3b6805cf",
    name: "dc_birch_planks",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_named_states: [
        {
          id: "dc_birch_planks",
          name: "Birch Planks",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": {
            texture: "dc_birch_planks",
          },
        },
      },
    },
  },
  {
    id: "6883085c",
    name: "dc_birch_fence",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "ddc_birch_fence",
          name: "Birch Fence",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_fence",
        inputs: {
          "*": {
            upTex: "dc_birch_planks",
            downTex: "dc_birch_planks",
            northTex: "dc_birch_planks",
            southTex: "dc_birch_planks",
            eastTex: "dc_birch_planks",
            westTex: "dc_birch_planks",
          },
        },
      },
    },
  },
  {
    id: "b632cd94",
    name: "dc_birch_slab",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_stair",
      dve_check_collisions: true,
      dve_voxel_material: "stone",

      dve_named_states: [
        {
          id: "dc_acacia_slab",
          name: "Acacia Slab",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_half_cube",
        inputs: {
          "*": {
            upDownTextures: "dc_birch_planks",
            sideTextures: "dc_birch_planks",
          },
        },
      },
    },
  },
  {
    id: "673b3819",
    name: "dc_birch_trapdoor",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",

      dve_named_states: [
        {
          id: "dc_birch_trapdoor",
          name: "Birch Trap Door",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_thin_panel",
        inputs: {
          "*": {
            upDownTextures: "dc_birch_trapdoor",
            sideTextures: "dc_birch_trapdoor",
            upDownTexturesTransparent: true,
          },
        },
      },
    },
  },
  {
    id: "5e64df9a",
    name: "dc_birch_stairs",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_stair",
      dve_check_collisions: true,
      dve_voxel_material: "stone",

      dve_named_states: [
        {
          id: "dc_birch_stairs",
          name: "Birch Stairs",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "placement=down,direction=north,connected=false",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_stair",
        inputs: {
          "*": { texture: "dc_birch_planks" },
        },
      },
    },
  },





  {
    id: "7d3f20d4",
    name: "dc_spruce_log",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_named_states: [
        {
          id: "dc_spruce_log",
          name: "Spruce Log",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_oriented_cube",
        modRelationSchema: [],
        inputs: {
          "*": {
            upTex: "dc_spruce_log:top",
            downTex: "dc_spruce_log:top",
            northTex: "dc_spruce_log:side",
            southTex: "dc_spruce_log:side",
            eastTex: "dc_spruce_log:side",
            westTex: "dc_spruce_log:side",
          },
        },
      },
    },
  },
  {
    id: "0c41cb35",
    name: "dc_spruce_leaves",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "leaves",
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_spruce_leaves",
          name: "Spruce Leaves",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": {
            texture: "dc_spruce_leaves",
            transparent: true,
          },
        },
      },
    },
  },
  {
    id: "5af53f54",
    name: "dc_spruce_planks",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_named_states: [
        {
          id: "dc_spruce_planks",
          name: "Spruce Planks",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_spruce_planks" },
        },
      },
    },
  },
 


  {
    id: "f69e9704",
    name: "dc_spruce_fence",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_spruce_fence",
          name: "Spruce Fence",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_fence",
        inputs: {
          "*": {
            upTex: "dc_spruce_planks",
            downTex: "dc_spruce_planks",
            northTex: "dc_spruce_planks",
            southTex: "dc_spruce_planks",
            eastTex: "dc_spruce_planks",
            westTex: "dc_spruce_planks",
          },
        },
      },
    },
  },
  {
    id: "3e7b6421",
    name: "dc_spruce_slab",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_stair",
      dve_check_collisions: true,
      dve_voxel_material: "stone",

      dve_named_states: [
        {
          id: "dc_spruce_slab",
          name: "Spruce Slab",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_half_cube",
        inputs: {
          "*": {
            upDownTextures: "dc_spruce_planks",
            sideTextures: "dc_spruce_planks",
          },
        },
      },
    },
  },
  {
    id: "0c4df9a8",
    name: "dc_spruce_trapdoor",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "wood",

      dve_named_states: [
        {
          id: "dc_acacia_trap_door",
          name: "Spruce Trap Door",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_thin_panel",
        inputs: {
          "*": {
            upDownTextures: "dc_spruce_trapdoor",
            sideTextures: "dc_spruce_trapdoor",
            upDownTexturesTransparent: true,
          },
        },
      },
    },
  },
  {
    id: "0328fd29",
    name: "dc_spruce_stairs",
    properties: {
      dve_is_transparent: true,
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",

      dve_collider_id: "dve_stair",
      dve_check_collisions: true,
      dve_voxel_material: "stone",

      dve_named_states: [
        {
          id: "dc_spruce_stairs",
          name: "Spruce Stairs",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "placement=down,direction=north,connected=false",
          },
        },
      ],

      dve_model_data: {
        id: "dve_simple_stair",
        inputs: {
          "*": { texture: "dc_spruce_planks" },
        },
      },
    },
  },















  {
    id: "cf2a8738",
    name: "dc_snow",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "snow",
      dve_named_states: [
        {
          id: "dc_snow",
          name: "Snow",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_snow" },
        },
      },
    },
  },

  {
    id: "77dc282b",
    name: "dc_ice",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "ice",
      dve_named_states: [
        {
          id: "dc_ice",
          name: "Ice",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_ice" },
        },
      },
    },
  },
  {
    id: "fa5f7612",
    name: "dc_andesite",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "stone",
      dve_named_states: [
        {
          id: "dc_andesite",
          name: "Andesite",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_andesite" },
        },
      },
    },
  },
  {
    id: "579b6698",
    name: "dc_smooth_andesite",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "stone",
      dve_named_states: [
        {
          id: "dc_smooth_andesite",
          name: "Smooth Andesite",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_smooth_andesite" },
        },
      },
    },
  },
  {
    id: "326f916a",
    name: "dc_granite",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "stone",
      dve_named_states: [
        {
          id: "dc_granite",
          name: "Granite",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_granite" },
        },
      },
    },
  },
  {
    id: "4ff63bca",
    name: "dc_smooth_granite",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "stone",
      dve_named_states: [
        {
          id: "dc_smooth_granite",
          name: "Smooth Granite",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_smooth_granite" },
        },
      },
    },
  },
  {
    id: "f54d356d",
    name: "dc_gravel",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "stone",
      dve_named_states: [
        {
          id: "dc_gravel",
          name: "Gravel",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_gravel" },
        },
      },
    },
  },
  {
    id: "f07d434c",
    name: "dc_clay",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "stone",
      dve_named_states: [
        {
          id: "dc_clay",
          name: "Clay",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_clay" },
        },
      },
    },
  },
  {
    id: "6e498e07",
    name: "dc_glass",
    properties: {
      dve_substance: "dve_transparent",
      dve_rendered_material: "dve_transparent",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "glass",
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_glass",
          name: "Glass",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_glass" },
        },
      },
    },
  },
  {
    id: "1d489e1b",
    name: "dc_podzol",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "dirt",
      dve_named_states: [
        {
          id: "dc_podzol",
          name: "Podzol",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_podzol:top" },
        },
      },
    },
  },
  // new voxels
  {
    id: "7938748a",
    name: "dc_emerald_ore",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "ore",
      dve_named_states: [
        {
          id: "dc_emerald_ore",
          name: "Emerald Ore",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_emerald_ore" },
        },
      },
    },
  },
  {
    id: "a287bcd0",
    name: "dc_gold_ore",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "ore",
      dve_named_states: [
        {
          id: "dc_gold_ore",
          name: "Gold Ore",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_gold_ore" },
        },
      },
    },
  },
  {
    id: "4fc60e89",
    name: "dc_iron_ore",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "ore",
      dve_named_states: [
        {
          id: "dc_iron_ore",
          name: "Iron Ore",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_iron_ore" },
        },
      },
    },
  },
  {
    id: "fb2f30a8",
    name: "dc_lapis_ore",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "ore",
      dve_named_states: [
        {
          id: "dc_lapis_ore",
          name: "Lapis Ore",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_lapis_ore" },
        },
      },
    },
  },
  {
    id: "feeaeba8",
    name: "dc_redstone_ore",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "ore",
      dve_named_states: [
        {
          id: "dc_redstone_ore",
          name: "Redstone Ore",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_redstone_ore" },
        },
      },
    },
  },
  {
    id: "bf8a6e8f",
    name: "dc_redstone_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "ore",
      dve_is_power_source: true,
      dve_power_value: 15,
      dve_named_states: [
        {
          id: "dc_redstone_block",
          name: "Redstone Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_redstone_block" },
        },
      },
    },
  },
  {
    id: "583d493b",
    name: "dc_coal_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "coal",
      dve_named_states: [
        {
          id: "dc_coal_block",
          name: "Coal Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_coal_block" },
        },
      },
    },
  },
  {
    id: "3e5b9ecb",
    name: "dc_diamond_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "diamond",
      dve_named_states: [
        {
          id: "dc_diamond_block",
          name: "Diamond Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_diamond_block" },
        },
      },
    },
  },
  {
    id: "20cfeac5",
    name: "dc_gold_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "gold",
      dve_named_states: [
        {
          id: "dc_gold_block",
          name: "Gold Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_gold_block" },
        },
      },
    },
  },
  {
    id: "26682c6a",
    name: "dc_iron_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "iron",
      dve_named_states: [
        {
          id: "dc_iron_block",
          name: "Iron Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_iron_block" },
        },
      },
    },
  },
  {
    id: "d716d562",
    name: "dc_mushroom_stem_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "iron",
      dve_named_states: [
        {
          id: "dc_mushroom_stem_block",
          name: "Mushroom Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_mushroom_stem_block" },
        },
      },
    },
  },
  {
    id: "4fa3c80e",
    name: "dc_red_mushroom_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "iron",
      dve_named_states: [
        {
          id: "dc_red_mushroom_block",
          name: "Red Mushroom Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_red_mushroom_block" },
        },
      },
    },
  },
  {
    id: "703028e4",
    name: "dc_brown_mushroom_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "iron",
      dve_named_states: [
        {
          id: "dc_brown_mushroom_block",
          name: "Brown Mushroom Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_brown_mushroom_block" },
        },
      },
    },
  },
  {
    id: "031d23f1",
    name: "dc_mycelium",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "mycelium",
      dve_named_states: [
        {
          id: "dc_mycelium",
          name: "Mycelium Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": { texture: "dc_mycelium:top" },
        },
      },
    },
  },
  {
    id: "afef8509",
    name: "dc_blue_orchid_flower",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "grass",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_blue_orchid_flower",
          name: "Blue Orchid Flower",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_blue_orchid_flower",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "6c85cbff",
    name: "dc_dandelion_flower",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "grass",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_dandelion_flower",
          name: "Dandelion Flower",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_dandelion_flower",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "9fe6d4af",
    name: "dc_oxeye_daisy_flower",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "grass",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_oxeye_daisy_flower",
          name: "Oxeye Daisy Flower",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_oxeye_daisy_flower",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "5d694d23",
    name: "dc_tulip_flower",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "grass",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_tulip_flower",
          name: "Tulip Flower",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_tulip_flower:white",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "5172f9e8",
    name: "dc_waterlily_flower",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "grass",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_waterlily_flower",
          name: "Waterlily Flower",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_waterlily_flower",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "50a80fe0",
    name: "dc_vine",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_shape_id: "dve_panel",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "grass",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_vine",
          name: "Vine",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_vine",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "75f3e621",
    name: "dc_fern",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "grass",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_fern",
          name: "Fern",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_fern",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "c06d7536",
    name: "dc_sea_grass",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "grass",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_sea_grass",
          name: "Sea Grass",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_sea_grass",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "7bc90d22",
    name: "dc_reeds",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "reed",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_reeds",
          name: "Reeds",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_reeds",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "e3dd8bf1",
    name: "dc_kelp",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "grass",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_kelp",
          name: "Kelp",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_kelp",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "7f1518eb",
    name: "dc_grass",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "grass",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_grass",
          name: "Grass",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_grass",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "8843fc40",
    name: "dc_cactus",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "grass",
      dve_named_states: [
        {
          id: "dc_cactus",
          name: "Cactus",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_cactus:side" },
        },
      },
    },
  },
  // Coral and Coral Blocks
  {
    id: "add8a54c",
    name: "dc_brain_coral",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "coral",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_brain_coral",
          name: "Brain Coral",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_brain_coral",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "57fa3505",
    name: "dc_brain_coral_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "coral_block",
      dve_named_states: [
        {
          id: "dc_brain_coral_block",
          name: "Brain Coral Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_brain_coral_block" },
        },
      },
    },
  },
  {
    id: "be439f14",
    name: "dc_bubble_coral",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "coral",
      dve_named_states: [
        {
          id: "dc_bubble_coral",
          name: "Bubble Coral",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_bubble_coral",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "409a4b8e",
    name: "dc_bubble_coral_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "coral_block",
      dve_named_states: [
        {
          id: "dc_bubble_coral_block",
          name: "Bubble Coral Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_bubble_coral_block" },
        },
      },
    },
  },
  {
    id: "123c62c2",
    name: "dc_dead_brain_coral_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "dead_coral_block",
      dve_named_states: [
        {
          id: "dc_dead_brain_coral_block",
          name: "Dead Brain Coral Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_dead_brain_coral_block" },
        },
      },
    },
  },
  {
    id: "f2224234",
    name: "dc_dead_bubble_coral_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "dead_coral_block",
      dve_named_states: [
        {
          id: "dc_dead_bubble_coral_block",
          name: "Dead Bubble Coral Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_dead_bubble_coral_block" },
        },
      },
    },
  },
  {
    id: "a2982858",
    name: "dc_dead_fire_coral",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "coral",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_dead_fire_coral",
          name: "Dead Fire Coral",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_dead_fire_coral",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "a58d33a0",
    name: "dc_dead_fire_coral_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "dead_coral_block",
      dve_named_states: [
        {
          id: "dc_dead_fire_coral_block",
          name: "Dead Fire Coral Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_dead_fire_coral_block" },
        },
      },
    },
  },
  {
    id: "d5cb023c",
    name: "dc_dead_horn_coral",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "coral",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_dead_horn_coral",
          name: "Dead Horn Coral",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_dead_horn_coral",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "bfa6dd69",
    name: "dc_dead_horn_coral_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "dead_coral_block",
      dve_named_states: [
        {
          id: "dc_dead_horn_coral",
          name: "Dead Horn Coral Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        inputs: {
          "*": {
            texture: "dc_dead_horn_coral_block",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "30779fc8",
    name: "dc_dead_tube_coral",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "coral",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_dead_tube_coral",
          name: "Dead Tube Coral",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_dead_tube_coral",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "ed419647",
    name: "dc_dead_tube_coral_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "dead_coral_block",
      dve_named_states: [
        {
          id: "dc_dead_tube_coral_block",
          name: "Dead Tube Coral",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_dead_tube_coral_block" },
        },
      },
    },
  },
  {
    id: "1260bec9",
    name: "dc_dead_brain_coral",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "coral",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_dead_brain_coral",
          name: "Dead Brain Coral Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_dead_brain_coral",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "3a4e6f1d",
    name: "dc_dead_bubble_coral",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "coral",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_dead_bubble_coral",
          name: "Dead Bubble Coral",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_dead_bubble_coral",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "dbf1a22e",
    name: "dc_fire_coral",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "coral",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_fire_coral",
          name: "Fire Coral",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_fire_coral",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "82b3bf69",
    name: "dc_fire_coral_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "coral_block",
      dve_named_states: [
        {
          id: "dc_fire_coral_block",
          name: "Dead Fire Coral Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_fire_coral_block" },
        },
      },
    },
  },
  {
    id: "7c28759b",
    name: "dc_horn_coral",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "coral",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_horn_coral",
          name: "Horn Coral",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_horn_coral",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "4bab4ba5",
    name: "dc_horn_coral_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "coral_block",
      dve_named_states: [
        {
          id: "dc_horn_coral_block",
          name: "Dead Horn Coral Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_horn_coral_block" },
        },
      },
    },
  },
  {
    id: "259a55cb",
    name: "dc_tube_coral",
    properties: {
      dve_substance: "dve_flora",
      dve_rendered_material: "dve_flora",
      dve_collider_id: "dve_cube",
      dve_check_collisions: false,
      dve_voxel_material: "coral",
      dve_no_ao: true,
      dve_is_transparent: true,
      dve_named_states: [
        {
          id: "dc_tube_coral",
          name: "Tube Coral",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_crossed_panels",
        inputs: {
          "*": {
            texture: "dc_tube_coral",
            doubleSided: true,
          },
        },
      },
    },
  },
  {
    id: "f05da8a9",
    name: "dc_tube_coral_block",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "coral_block",
      dve_named_states: [
        {
          id: "dc_tube_coral_block",
          name: "Dead Tube Coral Block",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_tube_coral_block" },
        },
      },
    },
  },
  // Prismarine Variants
  {
    id: "9306cf6c",
    name: "dc_dark_prismarine",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "prismarine",
      dve_named_states: [
        {
          id: "dc_dark_prismarine",
          name: "Dark Prismarine",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_dark_prismarine" },
        },
      },
    },
  },
  {
    id: "f5f84aad",
    name: "dc_prismarine",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "prismarine",
      dve_named_states: [
        {
          id: "dc_prismarine",
          name: "Prismarine",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_prismarine" },
        },
      },
    },
  },
  {
    id: "35cf94f4",
    name: "dc_prismarine_bricks",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "prismarine",
      dve_named_states: [
        {
          id: "dc_prismarine_bricks",
          name: "Prismarine Bricks",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_prismarine_bricks" },
        },
      },
    },
  },
  // Basic Blocks
  {
    id: "1cba5680",
    name: "dc_bedrock",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "bedrock",
      dve_named_states: [
        {
          id: "dc_bedrock",
          name: "Bedrock",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_bedrock" },
        },
      },
    },
  },
  {
    id: "f6613644",
    name: "dc_obsidan",
    properties: {
      dve_substance: "dve_solid",
      dve_rendered_material: "dve_solid",
      dve_collider_id: "dve_cube",
      dve_check_collisions: true,
      dve_voxel_material: "obsidian",
      dve_named_states: [
        {
          id: "dc_obsidan",
          name: "Obsidan",
          mod: "*",
          state: "*",
          properties: {},
          display: {
            type: "model",
            mod: "*",
            state: "*",
          },
        },
      ],
      dve_model_data: {
        id: "dve_simple_cube",
        modRelationSchema: [],
        inputs: {
          "*": { texture: "dc_obsidan" },
        },
      },
    },
  },
];
