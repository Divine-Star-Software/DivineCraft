import { BiomeRange, Range, getBiomeRange } from "Gen/Biome.types";
import {
  DimensionGenerator,
  DimensionGeneratorData,
} from "Gen/Classes/DimensionGenerator";
import { ArticBiomeType } from "Gen/Register/BiomeTypes/ArticBiomeType";
import { DesertBiomeType } from "Gen/Register/BiomeTypes/DesertBiomeType";
import { ForestBiomeType } from "Gen/Register/BiomeTypes/ForestBiomeType";
import { GrassLandBiomeType } from "Gen/Register/BiomeTypes/GrassLandBiomeType";
import { MountainBiomeType } from "Gen/Register/BiomeTypes/MountainBiomeTypes";
import { OceanBiomeType } from "Gen/Register/BiomeTypes/OceanBiomeTypes";
import { RiverBiomeType } from "Gen/Register/BiomeTypes/RiverBiomeType";

const OceanLine = -.35;
const MountainLine = .8;

export const OverWorldGenData: DimensionGeneratorData = {
  id: "overworld",
  biomeTypes: [
    [DesertBiomeType.data.id, getBiomeRange([0.6, 1], [-1, -0.5], [OceanLine, MountainLine])], // Desert
    [ArticBiomeType.data.id, getBiomeRange([-1, -0.8], [-0.7, 0], [OceanLine, MountainLine])], // Arctic
    [
      OceanBiomeType.data.id,
      getBiomeRange(
        [-1, 0.5],
        [0.1, 1],
        [-1, OceanLine],
        undefined,
        undefined,
        false,
        false,
        false,
        true,
        false,
        true
      ),
    ], // Ocean
    [
      GrassLandBiomeType.data.id,
      getBiomeRange([-0.2, 0.5], [-0.5, -0.2], [OceanLine, MountainLine]),
    ], // Grassland
    [
      ForestBiomeType.data.id,
      getBiomeRange([-0.2, 0.3], [-0.55, -0.1 ], [OceanLine, MountainLine]),
    ], // Forest
    [MountainBiomeType.data.id, getBiomeRange([-0.4, 0.7], [-1, 0], [MountainLine, 1])], // Mountains
    [
      RiverBiomeType.data.id,
      getBiomeRange(
        [-1, 1],
        [-1,1],
        [OceanLine, MountainLine - .2],
        [.3, 1.2],
        undefined,
        false,
        false,
        false,
        true
      ),
    ],
  ],
};
