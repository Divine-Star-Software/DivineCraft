import { TextureData } from "@divinevoxel/foundation/Textures/Texture.types";
import { TextureManager } from "@divinevoxel/foundation/Textures/TextureManager";

TextureManager.defaultTexturePath = "assets/textures";
export const textureData: TextureData[] = [
  {
    type: "#dve_solid",
    id: "dc_grass_block",
    frames: 0,
    variations: {
      side: { frames: 0 },
      bottom: { frames: 0 },
    },
  },
  {
    type: "#dve_glow",
    id: "dc_glow_stone",
    frames: 0,
  },
  {
    type: "#dve_solid",
    id: "dc_cobble_stone",
    frames: 0,
  },
  {
    type: "#dve_solid",
    id: "dc_stone",
    frames: 0,
  },
  {
    type: "#dve_solid",
    id: "dc_sand",
    frames: 0,
  },
  {
    type: "#dve_solid",
    id: "dc_dirt",
    frames: 0,
  },
  {
    type: "#dve_flora",
    id: "dc_oak_leaves",
    frames: 0,
  },
  {
    type: "#dve_solid",
    id: "dc_oak_log",
    frames: 0,
  },
  {
    type: "#dve_liquid",
    id: "dc_water",
    frames: 0,
  },

];
