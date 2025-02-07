import { getBiomeRange } from "Gen/Biome.types";
import {
  BiomeType,
  BiomeTypeConstructor,
  BiomeTypeData,
} from "../../Classes/BiomeType";
import { RiverBiome } from "../Biomes/River/RiverBiome";

export class RiverBiomeType extends BiomeType {
  static data: BiomeTypeData = {
    id: "river",
    color: [0, 228, 245],
    biomes: [[RiverBiome.data.id, getBiomeRange()]],
    edgeBiomeTypes: [],
  };
  isRiver = true;

  getData(): BiomeTypeData {
    return this.getClass().data;
  }
  getClass(): BiomeTypeConstructor {
    return RiverBiomeType;
  }
}
