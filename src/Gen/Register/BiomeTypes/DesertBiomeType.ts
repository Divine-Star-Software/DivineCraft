import { getBiomeRange } from "Gen/Biome.types";
import {
  BiomeType,
  BiomeTypeConstructor,
  BiomeTypeData,
} from "../../Classes/BiomeType";
import { DesertBiome } from "../Biomes/Desert/DesertBiome";
import { RiverBiomeType } from "./RiverBiomeType";
import { DeaSeaBiome } from "../Biomes/Desert/DeaSeaBiome";

export class DesertBiomeType extends BiomeType {
  static data: BiomeTypeData = {
    id: "desert",
    color: [166, 132, 40],
    biomes: [
      [
        DesertBiome.data.id,
        getBiomeRange([-1, 1], [-1, 1], [0.3, 0.7], [-1, 1]),
      ],
      [DeaSeaBiome.data.id, getBiomeRange([-1, 1], [-1, 1], [0, 0.2], [-1, 1])],
    ],
    edgeBiomeTypes: [],
  };

  getData(): BiomeTypeData {
    return this.getClass().data;
  }
  getClass(): BiomeTypeConstructor {
    return DesertBiomeType;
  }
}
