import { BiomeRange, BiomeValue, getBiomeScore } from "Gen/Biome.types";
import { BiomeRegister } from "../Register/BiomeReigister";
import { BiomeType } from "./BiomeType";
import { GenNodes } from "./GenNodes";
import { Vec3Array } from "@amodx/math";
import { Biome } from "./Biome";
import { WormCaves } from "Gen/Register/Caves/WormCaves";
import { ValleysCarver } from "Gen/Register/Caves/ValleysCarver";
import { Caves } from "Gen/Register/Biomes/Caves";
import { Voxels } from "Gen/Register/Biomes/Voxels";
import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";

export type DimensionGeneratorData = {
  id: string;
  biomeTypes: [id: string, BiomeRange][];
};
const biomeValueCache = new Map<string, BiomeValue>();
const biomeCache = new Map<string, Biome>();
const blendedHeightCache = new Map<string, number>();
const heightCache = new Map<string, number>();
const biomeTypeCache = new Map<string, BiomeType>();
function vector3Hash(x: number, y: number, z: number) {
  return `${x}-${y}-${z}`;
}
export class DimensionGenerator {
  biomeTypes = new Map<string, BiomeType>();

  constructor(
    public nodes: GenNodes,
    public data: DimensionGeneratorData
  ) {}

  init() {
    for (const [biome, range] of this.data.biomeTypes) {
      const biomeClass = BiomeRegister.getBiomeType(biome);
      const biomeType = new biomeClass(this.nodes, this, range);
      this.biomeTypes.set(biome, biomeType);
      biomeType.init();
    }
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
    for (const [id, range] of this.data.biomeTypes) {
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
        bestBiomeType = this.biomeTypes.get(id)!;

        excludeRiver = range.excludeRiver ? 100 : excludeRiver;
      }
    }

    if (!bestBiomeType) return this.biomeTypes.get("grass-land")!;
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
        if (
          otherBiome
            .getData()
            .edgeBiomeTypes.find((_) => _[0] == edgeBiome.getData().id)
        )
          return edgeBiome;
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
        if (
          otherBiome
            .getData()
            .edgeBiomeTypes.find((_) => _[0] == edgeBiome.getData().id)
        )
          return edgeBiome;
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
        return this.biomeTypes.get(id)!;
      }
    }
    throw new Error(`No biome type`);
  }

  _clearTimeOut: any;
  getRiverNoise(x: number, y: number, z: number) {
    const warpScale = 1600;
    let riverNoise = this.nodes.noise.biomeTypeRiverNoise(
      x / warpScale,
      (z * 1.2) / warpScale
    );
    let fluffNoise = this.nodes.noise.biomeDetailNoise(x / 50, 10, z / 50);
    let scale = fluffNoise * 0.05 + 0.1;

    // Check if the noise value is within the specified range
    if (riverNoise > -scale && riverNoise < scale) {
      // Map the noise value from the range [-0.05, 0.05] to [0, 1]
      return (riverNoise + scale) / (scale * 2);
    }
    return 0; // Return 0 for values outside of [-0.05, 0.05]
  }
  getElavation(x: number, y: number, z: number) {
    const elavationScale = 1024;
    const max = 2 ** 32;
    let fluffNoise =
      this.nodes.noise.biomeDetailNoise(x / 100, 50, z / 100) * 0.1;
    const elavation = this.nodes.noise.biomeTypeElevationNoise(
      (x - max) / elavationScale,
      (z + max) / elavationScale
    );
    let result = elavation + fluffNoise;

    if (result > 1 || result < -1) {
      fluffNoise = -fluffNoise;
      result = elavation + fluffNoise;
    }

    return Math.max(-1, Math.min(1, result));
  }

  getTempature(x: number, y: number, z: number) {
    const tempatureScale = 4096;
    const max = 2 ** 32;
    let fluffNoise =
      this.nodes.noise.biomeDetailNoise(x / 100, 5880, z / 100) * 0.1;
    const tempature = this.nodes.noise.biomeTypeTemperatureNoise(
      (x - max) / tempatureScale,
      (z - max) / tempatureScale
    );
    let result = tempature + fluffNoise;

    if (result > 1 || result < -1) {
      fluffNoise = -fluffNoise;
      result = tempature + fluffNoise;
    }

    return Math.max(-1, Math.min(1, result));
  }

  getMostiure(x: number, y: number, z: number) {
    const moistureScale = 1024;
    const max = 2 ** 32;
    let fluffNoise =
      this.nodes.noise.biomeDetailNoise(x / 100, 10980, z / 100) * 0.1;
    const moisture = this.nodes.noise.biomeTypeMoistureNoise(
      (x - max) / moistureScale,
      (z - max) / moistureScale
    );
    let result = moisture + fluffNoise;

    if (result > 1 || result < -1) {
      fluffNoise = -fluffNoise;
      result = moisture + fluffNoise;
    }

    return Math.max(-1, Math.min(1, result));
  }
  getBiomeTypeValue(x: number, y: number, z: number): BiomeValue {
    const mositure = this.getMostiure(x, y, z);
    const tempature = this.getElavation(x, y, z);
    const elavation = this.getTempature(x, y, z);
    const river = this.getRiverNoise(x, y, z);
    const value: BiomeValue = [tempature, mositure, elavation, river];

    return value;
  }

  clearCache() {
    biomeTypeCache.clear();
    biomeCache.clear();
    blendedHeightCache.clear();
    heightCache.clear();
  }

  getBiomeType(x: number, y: number, z: number) {
    const key = vector3Hash(x, y, z);
    let value = biomeTypeCache.get(key);
    if (value) return value;

    let biomeValue = this.getBiomeTypeValue(x, y, z);
    value = this.getBiomeTypeFromValue(biomeValue);

    biomeTypeCache.set(key, value);
    return value;
  }
  getBiome(x: number, y: number, z: number) {
    const key = vector3Hash(x, y, z);
    let value = biomeCache.get(key);
    if (value) return value;

    value = this.getBiomeType(x, y, z).getBiome(x, y, z);

    biomeCache.set(key, value);
    return value;
  }
  getHeight(x: number, y: number, z: number) {
    const key = vector3Hash(x, y, z);
    let height = heightCache.get(key);
    if (height) return height;
    height = Math.max(this.getBiome(x, y, z).getHeight(x, y, z), 1);
    heightCache.set(key, height);
    return height;
  }
  getBlendedHeight(x: number, y: number, z: number) {
    const key = vector3Hash(x, y, z);
    let height = blendedHeightCache.get(key);
    if (height) return height;
    height = Math.max(this.getBiome(x, y, z).getBlendedHeight(x, y, z), 1);
    blendedHeightCache.set(key, height);
    return height;
  }

  generateWorldSector(chunkX: number, chunkZ: number) {
    const { brush } = this.nodes;

    const dataTool = brush.dataCursor;
    let totalGenTime = 0;
    let genTimeCount = 0;
    let totalFillTime = 0;
    let fillTimeCount = 0;

    for (let x = chunkX; x < this.nodes.chunkWidth + chunkX; x++) {
      for (let z = chunkZ; z < this.nodes.chunkDepth + chunkZ; z++) {
        const biome = this.getBiome(x, 0, z);
        const height = this.getBlendedHeight(x, 0, z);
        if (height > WorldSpaces.world.bounds.MaxY - 20) continue;

        //generate
        for (let y = 0; y <= height; y++) {
          if (y == 0) {
            brush.setName(Voxels.Bedrock).setXYZ(x, y, z).paint();
            continue;
          }

          const carved = biome.getCarved(x, y, z);
          if (carved) continue;

          const voxel = biome.getGenVoxel(x, y, z);
          if (!voxel) continue;
          brush.setData(voxel).setXYZ(x, y, z).paint();
        }

        //fill
        let filled = false;
        let addedTopLayer = false;
        for (let y = height + 10; y >= 0; y--) {
          if (!filled) {
            const hitVoxel =
              dataTool.getVoxel(x, y, z)?.isRenderable() || y == 1;
            if (hitVoxel) {
              filled = true;
              biome.fill(x, y + 1, z);
            }
          }

          if (!addedTopLayer) {
            if (biome.addTopLayer(x, y, z)) {
              addedTopLayer = true;
            }
          }

          if (filled && addedTopLayer) break;
        }
      }
    }
  }

  /*   carveWorldColumn(chunkX: number, chunkZ: number) {
    const { brush, dataTool } = this.nodes;

    for (let x = chunkX; x < this.nodes.chunkWidth + chunkX; x++) {
      for (let z = chunkZ; z < this.nodes.chunkDepth + chunkZ; z++) {
        const biome = this.getBiome(x, 0, z);
        const height = this.getHeight(x, 0, z);

        for (let y = 1; y < height; y++) {
          if (biome.getCarved(x, y, z)) {
            brush.setXYZ(x, y, z).erase();
          }
        }
      }
    }
  }

  fillWorldColumn(chunkX: number, chunkZ: number) {
    const { brush, dataTool } = this.nodes;

    for (let x = chunkX; x < this.nodes.chunkWidth + chunkX; x++) {
      for (let z = chunkZ; z < this.nodes.chunkDepth + chunkZ; z++) {
        const biome = this.getBiome(x, 0, z);
        let filled = false;
        let addedTopLayer = false;
        const height = Math.min(
          Math.max(this.getHeight(x, 0, z) + 10, this.nodes.waterHeight + 1),
          this.nodes.worldHeight
        );

        for (let y = this.nodes.worldHeight; y >= 0; y--) {
          if (!filled) {
            const hitVoxel =
              (dataTool.loadInAt(x, y, z) && dataTool.isRenderable()) || y == 1;
            if (hitVoxel) {
              filled = true;
              biome.fill(x, y + 1, z);
            }
          }

          if (!addedTopLayer) {
            if (biome.addTopLayer(x, y, z)) {
              addedTopLayer = true;
            }
          }

          if (filled && addedTopLayer) break;
        }
      }
    }
  } */

  decorateWorldSector(chunkX: number, chunkZ: number) {
    const { brush } = this.nodes;

    for (let x = chunkX; x < this.nodes.chunkWidth + chunkX; x++) {
      for (let z = chunkZ; z < this.nodes.chunkDepth + chunkZ; z++) {
        const biome = this.getBiome(x, 0, z);
        const height = this.getBlendedHeight(x, 0, z);
        for (let y = 1; y <= height; y++) {
          biome.decorate(x, y, z);
        }
      }
    }
  }

  wormCanver: ValleysCarver;

  generateBiomeTypeImage(
    [sx, sy, sz]: Vec3Array,
    [ex, ey, ez]: Vec3Array
  ): Uint8ClampedArray {
    this.wormCanver = new ValleysCarver(this.nodes);
    const width = 1024;
    const height = 1024;
    const buffer = new Uint8ClampedArray(width * height * 4); // Each pixel has 4 entries (RGBA)
    console.log("Start");
    for (let z = sz; z <= ez; z++) {
      for (let x = sx; x <= ex; x++) {
        let total = 0;

        const index = ((z - sz) * width + (x - sx)) * 4;

        try {
          const [r, g, b] = this.getBiome(x, 0, z).getData().color;
          buffer[index] = r;
          buffer[index + 1] = g;
          buffer[index + 2] = b;

          buffer[index + 3] = 255;
        } catch (error) {
          buffer[index] = 255;

          buffer[index + 3] = 255;
        }
        /* 
        for (let layer = 0; layer < 4; layer++) {
          let noise = this.nodes.noise.detailNoise(
            x / 200,
            250_000 * layer,
            z / 200
          );
          let exist = this.nodes.noise.worldDetailNoise(
            x / 600,
            250_000 * layer,
            z / 600
          );
          let carveWorm = noise > -0.03 && noise < 0.03 && exist > .5;

          buffer[index + (layer % 3)] += 255 * (carveWorm ? 1 : 0);
        } */

        // Alpha channel set to fully opaque
        //    let noiseValue = this.getRiverNoise(x, 0, z);
        // Use an exponent to sharpen the ridges
        /*      let noiseValue = this.nodes.noise.detailNoise(x/300, z/300, 0);
        if (noiseValue > -0.07 && noiseValue < 0.07) {
          noiseValue = 1;
        } else {
          noiseValue = 0;
        } */

        //   buffer[index + 1] = 255 * this.getTempature(x, 0, z);
        //   buffer[index + 2] = 255 * this.getMostiure(x, 0, z);
        //    buffer[index + 3] = 255; // Alpha channel set to fully opaque */

        // const height = this.getHeight(x,0,z);
        // buffer[index] = 255 * height/120;
      }
    }

    console.log("done", buffer);

    return buffer;
  }
}
