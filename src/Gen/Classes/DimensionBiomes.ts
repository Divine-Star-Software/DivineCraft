import { DimensionGenerator } from "./DimensionGenerator";
import { BiomeRange, BiomeValue, getBiomeScore } from "Gen/Biome.types";
import { BiomeType } from "./BiomeType";
import { Biome } from "./Biome";
import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
import { Flat3DIndex, Vector3Like } from "@amodx/math";
import { CachedBiomeSector } from "Gen/Register/Cached/CachedBiomeSector";
import { CachedBiomeRegister } from "Gen/Register/Cached/CachedBiomeRegister";

export class DimensionBiomes {
  _biomeTypes = new Map<string, BiomeType>();
  _biomeTypeCount = 1;
  _biomeTypePalette: string[] = [];
  _biomeTypeMap: Record<string, number> = {};

  _biomes = new Map<string, Biome>();
  _biomeCount = 1;
  _biomePalette: string[] = [];
  _biomeMap: Record<string, number> = {};

  _cache: Record<number, Record<number, Record<number, CachedBiomeSector>>> =
    {};

  constructor(public dimension: DimensionGenerator) {}

  registerType(id: string, type: BiomeType) {
    this._biomeTypes.set(id, type);
    this._biomeTypePalette[this._biomeTypeCount] = id;
    this._biomeTypeMap[id] = this._biomeTypeCount;
    this._biomeTypeCount++;
    type.init();
    for (const [id, biome] of type.biomes) {
      if (this._biomes.has(id)) continue;
      this._biomes.set(id, biome);
      this._biomePalette[this._biomeCount] = id;
      this._biomeMap[id] = this._biomeCount;
      this._biomeCount++;
    }
  }

  _start = Vector3Like.Create();
  private _tempPosition = Vector3Like.Create();

  getCachedSector(x: number, y: number, z: number) {
    WorldSpaces.sector.getPosition(x, y, z, this._tempPosition);
    const rx = this._start.x - this._tempPosition.x;
    const ry = this._start.y - this._tempPosition.y;
    const rz = this._start.z - this._tempPosition.z;

    if (!this._cache[rx] || !this._cache[rx][ry] || !this._cache[rx][ry][rz]) {
      this._cache[rx] ??= {};
      this._cache[rx][ry] ??= {};
      const sector = CachedBiomeRegister.get(
        this.dimension.dimension,
        x,
        y,
        z,
      )!;
      this._cache[rx][ry][rz] = sector;
    }

    return this._cache[rx][ry][rz];
  }

  start(x: number, y: number, z: number) {
    WorldSpaces.sector.getPosition(x, y, z, this._start);
    this._start.y = 0;
  }

  stop() {
    this._cache = {};
  }

  isInRange(values: BiomeValue, range: BiomeRange) {
    if (
      range.temperature[0] <= values[0] &&
      range.temperature[1] >= values[0] &&
      range.moisture[0] <= values[1] &&
      range.moisture[1] >= values[1] &&
      range.elevation[0] <= values[2] &&
      range.elevation[1] >= values[2]
    ) {
      return true;
    }
    return false;
  }

  getBiomeTypeInRange(value: BiomeValue): BiomeType {
    let bestScore = 0;
    let bestBiomeType: BiomeType | null = null;
    let excludeRiver = 0;
    let bestNotRiverScore = 0;
    for (const [id, range] of this.dimension.data.biomeTypes) {
      let score = getBiomeScore(value, range);
      if (
        score > bestNotRiverScore &&
        range.river[1] <= 0 &&
        range.excludeRiver
      ) {
        bestNotRiverScore = score;
      }
      if (score > bestScore) {
        if (
          range.river[1] >= 0 &&
          excludeRiver > 0 &&
          bestScore == bestNotRiverScore
        ) {
          score = 0;
          continue;
        }
        bestScore = score;
        bestBiomeType = this._biomeTypes.get(id)!;

        excludeRiver = range.excludeRiver ? 100 : excludeRiver;
      }
    }

    if (!bestBiomeType) return this._biomeTypes.get("grass-land")!;
    return bestBiomeType;
  }
  getBiomeTypeFromValue(value: BiomeValue): BiomeType {
    let bestScore = 0;
    let bestBiomeType = this.getBiomeTypeInRange(value);
    const data = bestBiomeType.getData();
    if (!data.edgeBiomeTypes.length || !data.edgeFactor) return bestBiomeType;
    {
      const edgeFactorUp: BiomeValue = [
        value[0] + data.edgeFactor[0],
        value[1] + data.edgeFactor[1],
        value[2] + data.edgeFactor[2],
        value[3] + data.edgeFactor[3],
      ];

      const otherBiome = this.getBiomeTypeInRange(edgeFactorUp);
      if (otherBiome != bestBiomeType) {
        const edgeBiome = this.getEdgeBiomeTypeFromValue(bestBiomeType, value);
        const edgeBiomeTypes = otherBiome.getData().edgeBiomeTypes;
        for (let i = 0; i < edgeBiomeTypes.length; i++) {
          if (edgeBiomeTypes[i][0] == edgeBiome.getData().id) return edgeBiome;
        }
      }
    }
    {
      const edgeFactorDown: BiomeValue = [
        value[0] - data.edgeFactor[0],
        value[1] - data.edgeFactor[1],
        value[2] - data.edgeFactor[2],
        value[3] - data.edgeFactor[3],
      ];

      const otherBiome = this.getBiomeTypeInRange(edgeFactorDown);
      if (otherBiome != bestBiomeType) {
        const edgeBiome = this.getEdgeBiomeTypeFromValue(bestBiomeType, value);
        const edgeBiomeTypes = otherBiome.getData().edgeBiomeTypes;
        for (let i = 0; i < edgeBiomeTypes.length; i++) {
          if (edgeBiomeTypes[i][0] == edgeBiome.getData().id) return edgeBiome;
        }
      }
    }
    return bestBiomeType;
  }
  getBiomeFromValue(typeValue: BiomeValue, biomeValue: number) {
    let biomeType = this.getBiomeTypeFromValue(typeValue);
    return biomeType.getBiomeFromValue(typeValue, biomeValue);
  }
  getEdgeBiomeTypeFromValue(biomeType: BiomeType, value: BiomeValue) {
    for (const [id, range] of biomeType.getData().edgeBiomeTypes) {
      if (this.isInRange(value, range)) {
        return this._biomeTypes.get(id)!;
      }
    }
    throw new Error(`No biome type`);
  }
  getBiomeTypeValue(x: number, y: number, z: number): BiomeValue {
    const mositure = this.dimension.getMostiure(x, y, z);
    const elavation = this.dimension.getElavation(x, y, z);
    const tempature = this.dimension.getTempature(x, y, z);
    const river = this.dimension.getRiverNoise(x, y, z);
    const value: BiomeValue = [tempature, mositure, elavation, river];
    return value;
  }

  getBiomeType(x: number, y: number, z: number) {
    const cachedSector = this.getCachedSector(x, y, z);
    const index = cachedSector.getIndex(x, y, z);
    const value = cachedSector.biomeTypeCache[index];
    if (value) {
      return this._biomeTypes.get(this._biomeTypePalette[value])!;
    }

    let biomeValue = this.getBiomeTypeValue(x, y, z);
    const biomeType = this.getBiomeTypeFromValue(biomeValue);

    cachedSector.biomeTypeCache[index] =
      this._biomeTypeMap[biomeType.getData().id];

    return biomeType;
  }
  getBiome(x: number, y: number, z: number) {
    const cachedSector = this.getCachedSector(x, y, z);
    const index = cachedSector.getIndex(x, y, z);
    const value = cachedSector.biomeCache[index];
    if (value) {
      return this._biomes.get(this._biomePalette[value])!;
    }
    const biome = this.getBiomeType(x, y, z).getBiome(x, y, z);
    cachedSector.biomeCache[index] = this._biomeMap[biome.getData().id];

    return biome;
  }
  getHeight(x: number, y: number, z: number) {
    const cachedSector = this.getCachedSector(x, y, z);
    const index = cachedSector.getIndex(x, y, z);
    const value = cachedSector.biomeHeightCache[index];
    if (value !== CachedBiomeSector.NOT_FOUND_HEIGHT) return value;
    const height = Math.max(this.getBiome(x, y, z).getHeight(x, y, z), 1);
    cachedSector.biomeHeightCache[index] = height;
    return height;
  }
  getBlendedHeight(x: number, y: number, z: number) {
    const cachedSector = this.getCachedSector(x, y, z);
    const index = cachedSector.getIndex(x, y, z);
    const value = cachedSector.biomeBlendHeightCache[index];
    if (value !== CachedBiomeSector.NOT_FOUND_HEIGHT) return value;
    const height = Math.max(
      this.getBiome(x, y, z).getBlendedHeight(x, y, z),
      1,
    );
    cachedSector.biomeBlendHeightCache[index] = height;
    return height;
  }
}
