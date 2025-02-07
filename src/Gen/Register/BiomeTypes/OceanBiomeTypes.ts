import { getBiomeRange } from "Gen/Biome.types";
import {
  BiomeType,
  BiomeTypeConstructor,
  BiomeTypeData,
} from "../../Classes/BiomeType";
import { ShallowOceanBiome } from "../Biomes/Ocean/ShallowOceanBiome";
import { TropicalOceanBiome } from "../Biomes/Ocean/TropicalOceanBiome";
import { DeepOceanBiome } from "../Biomes/Ocean/DeepOceanBiome";
import { FrozenOceanBiome } from "../Biomes/Ocean/FrozenOceanBiome";

export class OceanBiomeType extends BiomeType {
  static data: BiomeTypeData = {
    id: "ocean",
    color: [2, 83, 89],
    biomes: [
      [ShallowOceanBiome.data.id, getBiomeRange([-0.2, 0.4], [0,1], [-.4, 0])],
      [TropicalOceanBiome.data.id, getBiomeRange([0.8, 1], [0, 1], [-.1, 0])],
      [DeepOceanBiome.data.id, getBiomeRange([-1, 0.4], [0, 1], [-1,-.5])],
      [FrozenOceanBiome.data.id, getBiomeRange([-1, -.5], [0, 1], [-.5, 0])],
    ],
    edgeBiomeTypes: [],
  };

  getData(): BiomeTypeData {
    return this.getClass().data;
  }
  getClass() {
    return OceanBiomeType;
  }
}
