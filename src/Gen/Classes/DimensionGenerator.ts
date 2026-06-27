import { BiomeRange } from "Gen/Biome.types";
import { BiomeRegister } from "../Register/BiomeReigister";
import { GenNodes } from "./GenNodes";
import { Vec3Array } from "@amodx/math";
import { Voxels } from "Gen/Register/Biomes/Voxels";
import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
import { DimensionBiomes } from "./DimensionBiomes";

export type DimensionGeneratorData = {
  id: string;
  biomeTypes: [id: string, BiomeRange][];
};

export class DimensionGenerator {
  biomes = new DimensionBiomes(this);

  dimension = 0;
  constructor(

    public nodes: GenNodes,
    public data: DimensionGeneratorData,
  ) {}

  init() {
    for (const [biome, range] of this.data.biomeTypes) {
      const biomeClass = BiomeRegister.getBiomeType(biome);
      const biomeType = new biomeClass(this.nodes, this, range);
      this.biomes.registerType(biome, biomeType);
    }
    console.log("done", this.biomes);
  }
  getRiverNoise(x: number, y: number, z: number) {
    const warpScale = 1600;
    let riverNoise = this.nodes.noise.biomeTypeRiverNoise(
      x / warpScale,
      (z * 1.2) / warpScale,
    );
    let fluffNoise = this.nodes.noise.biomeDetailNoise(x / 50, 10, z / 50);
    let scale = fluffNoise * 0.05 + 0.1;

    if (riverNoise > -scale && riverNoise < scale) {
      return (riverNoise + scale) / (scale * 2);
    }
    return 0;
  }
  getTempature(x: number, y: number, z: number) {
    const elavationScale = 1024;
    const max = 2 ** 32;
    let fluffNoise =
      this.nodes.noise.biomeDetailNoise(x / 100, 50, z / 100) * 0.1;
    const elavation = this.nodes.noise.biomeTypeElevationNoise(
      (x - max) / elavationScale,
      (z + max) / elavationScale,
    );
    let result = elavation + fluffNoise;

    if (result > 1 || result < -1) {
      fluffNoise = -fluffNoise;
      result = elavation + fluffNoise;
    }

    return Math.max(-1, Math.min(1, result));
  }

  getElavation(x: number, y: number, z: number) {
    const tempatureScale = 4096;
    const max = 2 ** 32;
    let fluffNoise =
      this.nodes.noise.biomeDetailNoise(x / 100, 5880, z / 100) * 0.1;
    const tempature = this.nodes.noise.biomeTypeTemperatureNoise(
      (x - max) / tempatureScale,
      (z - max) / tempatureScale,
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
      (z - max) / moistureScale,
    );
    let result = moisture + fluffNoise;

    if (result > 1 || result < -1) {
      fluffNoise = -fluffNoise;
      result = moisture + fluffNoise;
    }

    return Math.max(-1, Math.min(1, result));
  }

  generateWorldSector(chunkX: number, chunkZ: number) {
    const { brush } = this.nodes;
    this.biomes.start(chunkX, 0, chunkZ);
    const dataTool = brush.dataCursor;
    let totalGenTime = 0;
    let genTimeCount = 0;
    let totalFillTime = 0;
    let fillTimeCount = 0;

    for (let x = chunkX; x < this.nodes.chunkWidth + chunkX; x++) {
      for (let z = chunkZ; z < this.nodes.chunkDepth + chunkZ; z++) {
        const biome = this.biomes.getBiome(x, 0, z);
        const height = this.biomes.getBlendedHeight(x, 0, z);
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

    this.biomes.stop();
  }

  decorateWorldSector(chunkX: number, chunkZ: number) {
    const { brush } = this.nodes;
    this.biomes.start(chunkX, 0, chunkZ);
    for (let x = chunkX; x < this.nodes.chunkWidth + chunkX; x++) {
      for (let z = chunkZ; z < this.nodes.chunkDepth + chunkZ; z++) {
        const biome = this.biomes.getBiome(x, 0, z);
        const height = this.biomes.getBlendedHeight(x, 0, z);
        for (let y = 1; y <= height; y++) {
          biome.decorate(x, y, z);
        }
      }
    }
    this.biomes.stop();
  }

  generateBiomeTypeImage(
    [sx, sy, sz]: Vec3Array,
    [ex, ey, ez]: Vec3Array,
  ): Uint8ClampedArray {
    const width = 1024;
    const height = 1024;
    const buffer = new Uint8ClampedArray(width * height * 4); // Each pixel has 4 entries (RGBA)
    console.log("Start");
    for (let z = sz; z <= ez; z++) {
      for (let x = sx; x <= ex; x++) {
        let total = 0;

        const index = ((z - sz) * width + (x - sx)) * 4;

        try {
          const [r, g, b] = this.biomes.getBiome(x, 0, z).getData().color;
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
