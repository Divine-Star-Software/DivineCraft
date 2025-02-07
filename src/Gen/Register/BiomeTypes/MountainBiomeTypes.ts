import { getBiomeRange } from "Gen/Biome.types";
import {
  BiomeType,
  BiomeTypeConstructor,
  BiomeTypeData,
} from "../../Classes/BiomeType";
import { RockyMountianBiome } from "../Biomes/Mountian/RockyMountianBiome";
import { HighGravelHillsBiome } from "../Biomes/Mountian/HighGravelHillsBiome";

export class MountainBiomeType extends BiomeType {
  static data: BiomeTypeData = {
    id: "mountain",
    color: [129, 142, 143],

    biomes: [
      [
        RockyMountianBiome.data.id,
        getBiomeRange(undefined, undefined, [0.85, 1]),
      ],
      [
        HighGravelHillsBiome.data.id,
        getBiomeRange(undefined, undefined, [0.7, 0.85]),
      ],
    ],
    edgeBiomeTypes: [],
  };

  getData(): BiomeTypeData {
    return this.getClass().data;
  }
  getClass(): BiomeTypeConstructor {
    return MountainBiomeType;
  }
}
