import { getBiomeRange } from "Gen/Biome.types";
import {
  BiomeType,
  BiomeTypeConstructor,
  BiomeTypeData,
} from "../../Classes/BiomeType";
import { OakForestBiome } from "../Biomes/Forest/OakForestBiome";
import { RiverBiomeType } from "./RiverBiomeType";
import { SpruceForestBiome } from "../Biomes/Forest/SpruceForestBiome";
import { DarkOakForestBiome } from "../Biomes/Forest/DarkOakForestBiome";
import { BirchForestBiome } from "../Biomes/Forest/BirchForestBiome";

export class ForestBiomeType extends BiomeType {
  static data: BiomeTypeData = {
    id: "forest",

    color: [19, 77, 17],
    biomes: [
      [OakForestBiome.data.id, getBiomeRange([-0.2, 0.3],[-.2,-.01],[0.1,.8])],
      [SpruceForestBiome.data.id, getBiomeRange([-0.8, -0.1],[-.4,-.2],[.2,.8])],
      [DarkOakForestBiome.data.id, getBiomeRange([-0.2, 0.3],[-.4,-.3],[.2,.5])],
      [BirchForestBiome.data.id, getBiomeRange([-0.3, 0.4,],[-.3,-.1],[.4,.8])],
    ],
    edgeBiomeTypes: [],
  };

  getData(): BiomeTypeData {
    return this.getClass().data;
  }
  getClass(): BiomeTypeConstructor {
    return ForestBiomeType;
  }
}
