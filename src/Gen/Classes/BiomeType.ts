import { Vec3Array } from "@amodx/math";
import { BiomeRegister } from "../Register/BiomeReigister";
import { Biome } from "./Biome.js";
import { DimensionGenerator } from "./DimensionGenerator";
import { GenNodes } from "./GenNodes";
import { BiomeRange, BiomeValue, getBiomeScore } from "Gen/Biome.types";

export interface BiomeTypeConstructor {
  data: BiomeTypeData;
  new (
    nodes: GenNodes,
    dimesnion: DimensionGenerator,
    range: BiomeRange
  ): BiomeType;
}

export type BiomeTypeData = {
  id: string;
  edgeFactor?: BiomeValue;
  biomes: [id: string, BiomeRange][];
  edgeBiomeTypes: [id: string, BiomeRange][];
  color: Vec3Array;
};

export abstract class BiomeType {
  biomes = new Map<string, Biome>();
  isRiver?: boolean;
  constructor(
    public nodes: GenNodes,
    public dimesnion: DimensionGenerator,
    public range: BiomeRange
  ) {}

  getBiomeFromValue(typeValue: BiomeValue, biomeValue: number): Biome {
    typeValue[4] = biomeValue;
    let bestScore = 0;
    let bestBiome: Biome | null = null;

    let bestRange: BiomeRange | null = null;
    for (const [id, range] of this.getData().biomes) {
      let score = getBiomeScore(typeValue, range);
      if (score > bestScore) {
        bestScore = score;
        bestRange = range;
        bestBiome = this.biomes.get(id)!;
      }
    }

    if (!bestBiome || !bestRange)
      return this.biomes.get(this.biomes.keys().next()!.value!)!;
    const data = bestBiome.getData();
    if (!data.edgeBiomes.length || !data.edgeFactor) return bestBiome;
    {
      const edgeFactorUp: BiomeValue = [
        typeValue[0] -
          (Array.isArray(data.edgeFactor[0])
            ? data.edgeFactor[0][0]
            : data.edgeFactor[0]),
        typeValue[1] -
          (Array.isArray(data.edgeFactor[1])
            ? data.edgeFactor[1][0]
            : data.edgeFactor[1]),
        typeValue[2] -
          (Array.isArray(data.edgeFactor[2])
            ? data.edgeFactor[2][0]
            : data.edgeFactor[2]),
        typeValue[3] -
          (Array.isArray(data.edgeFactor[3])
            ? data.edgeFactor[3][0]
            : data.edgeFactor[3]),
      ];

      const otherBiome = this.dimesnion.getBiomeTypeFromValue(edgeFactorUp);
      if (
        (bestRange.excludeRiver || this.range.excludeRiver) &&
        otherBiome.isRiver
      )
        return bestBiome;
      if (otherBiome != this)
        return this.getEdgeBiomeFromValue(typeValue, bestBiome, biomeValue);
    }

    {
      const edgeFactorDown: BiomeValue = [
        typeValue[0] +
          (Array.isArray(data.edgeFactor[0])
            ? data.edgeFactor[0][1]
            : data.edgeFactor[0]),
        typeValue[1] +
          (Array.isArray(data.edgeFactor[1])
            ? data.edgeFactor[1][1]
            : data.edgeFactor[1]),
        typeValue[2] +
          (Array.isArray(data.edgeFactor[2])
            ? data.edgeFactor[2][1]
            : data.edgeFactor[2]),
        typeValue[3] +
          (Array.isArray(data.edgeFactor[3])
            ? data.edgeFactor[3][1]
            : data.edgeFactor[3]),
      ];

      const otherBiome = this.dimesnion.getBiomeTypeFromValue(edgeFactorDown);
      if (
        (bestRange.excludeRiver || this.range.excludeRiver) &&
        otherBiome.isRiver
      )
        return bestBiome;

      if (otherBiome != this)
        return this.getEdgeBiomeFromValue(typeValue, bestBiome, biomeValue);
    }

    return bestBiome;
  }

  getEdgeBiomeFromValue(typeValue: BiomeValue, biome: Biome, value: number) {
    typeValue[4] = value;
    let bestScore = 0;
    let bestBiome: Biome | null = null;

    let bestRange: BiomeRange | null = null;
    for (const [id, range] of biome.getData().edgeBiomes) {
      let score = getBiomeScore(typeValue, range);
      if (score > bestScore) {
        bestScore = score;
        bestRange = range;
        bestBiome = this.biomes.get(id)!;
      }
    }

    if (!bestBiome || !bestRange)
      return this.biomes.get(this.biomes.keys().next()!.value!)!;

    return bestBiome;
  }
  getBiomeValue(x: number, y: number, z: number) {
    const scale = 120;
    return this.nodes.noise.biomeNoise(x / scale, 0, z / scale);
  }
  getBiome(x: number, y: number, z: number) {
    const value = this.getBiomeValue(x, y, z);
    const typeValue = this.dimesnion.getBiomeTypeValue(x, y, z);

    return this.getBiomeFromValue(typeValue, value);

    throw new Error(`No biome for biome type ${this.getData().id}`);
  }

  init() {
    for (const [biome] of this.getData().biomes) {
      const biomeClass = BiomeRegister.getBiome(biome);
      this.biomes.set(biome, new biomeClass(this.nodes, this));
      if (biomeClass.data.edgeBiomes.length) {
        for (const [biome] of biomeClass.data.edgeBiomes) {
          const biomeClass = BiomeRegister.getBiome(biome);
          this.biomes.set(biome, new biomeClass(this.nodes, this));
        }
      }
    }
  }

  abstract getData(): BiomeTypeData;
  abstract getClass(): BiomeTypeConstructor;
}
