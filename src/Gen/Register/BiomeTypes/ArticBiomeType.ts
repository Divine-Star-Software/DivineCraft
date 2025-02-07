import { getBiomeRange } from "Gen/Biome.types";
import {
  BiomeType,
  BiomeTypeConstructor,
  BiomeTypeData,
} from "../../Classes/BiomeType";
import { TundraBiome } from "../Biomes/Artic/TundaBiome";
import { RiverBiomeType } from "./RiverBiomeType";
import { FrozenWaste } from "../Biomes/Artic/FrozenWaste";

export class ArticBiomeType extends BiomeType {
  static data: BiomeTypeData = {
    id: "artic",
    color: [255, 255, 255],

    biomes: [
      [TundraBiome.data.id, getBiomeRange([-0.8, -0.5])],
      [FrozenWaste.data.id, getBiomeRange([-1, -0.8])],
    ],
    edgeBiomeTypes: [],
  };

  getData(): BiomeTypeData {
    return this.getClass().data;
  }
  getClass(): BiomeTypeConstructor {
    return ArticBiomeType;
  }
}
