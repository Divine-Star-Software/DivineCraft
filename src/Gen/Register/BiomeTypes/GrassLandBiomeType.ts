import { getBiomeRange } from "Gen/Biome.types";
import {
  BiomeType,
  BiomeTypeConstructor,
  BiomeTypeData,
} from "../../Classes/BiomeType";
import { PrairieBiome } from "../Biomes/GrassLand/PrairieBiome";
import { RiverBiomeType } from "./RiverBiomeType";
import { SavannahBiome } from "../Biomes/GrassLand/SavannahBiome";

export class GrassLandBiomeType extends BiomeType {
  static data: BiomeTypeData = {
    id: "grass-land",
    color: [117, 255, 112],
    biomes: [
      [PrairieBiome.data.id,getBiomeRange([0.1, .3],[-.5,-.3])],
      [SavannahBiome.data.id,getBiomeRange([.3, .4],[-.3,-.1])],
    ],
    edgeBiomeTypes:[]
  };

  getData(): BiomeTypeData {
    return this.getClass().data;
  }
  getClass(): BiomeTypeConstructor {
    return GrassLandBiomeType;
  }
}
