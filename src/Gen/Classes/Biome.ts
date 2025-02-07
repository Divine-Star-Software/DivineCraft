import { PaintVoxelData } from "@divinevoxel/vlox/Voxels";
import { GenNodes } from "./GenNodes";
import { BiomeType } from "./BiomeType";
import { BiomeEdgeFactor, BiomeRange } from "Gen/Biome.types";
import { Vec3Array } from "@amodx/math";
export type BiomeData = {
  id: string;
  minHeight?: number;
  edgeFactor?: BiomeEdgeFactor;
  heightBlendFactor: number;
  edgeBiomes: [id: string, BiomeRange][];
  color: Vec3Array;
};

export interface BiomeConstructor {
  data: BiomeData;
  new (nodes: GenNodes, biomeType: BiomeType): Biome;
}

// Find the first different biome in each cardinal direction and get its height
const directions = [
  { dx: 1, dz: 0 }, // East
  { dx: -1, dz: 0 }, // West
  { dx: 0, dz: 1 }, // North
  { dx: 0, dz: -1 }, // South
];
export abstract class Biome {
  isRiver?: boolean;
  constructor(
    public nodes: GenNodes,
    public biomeType: BiomeType
  ) {}
  findHeightInDirection(
    height: number,
    x: number,
    z: number,
    dx: number,
    dz: number,
    reachFactor: number
  ) {
    let heightSum = height;
    let validBiomesCount = 1;
    for (let i = 1; i <= reachFactor; i++) {
      const checkX = x + i * dx;
      const checkZ = z + i * dz;
      const testBiome = this.biomeType.dimesnion.getBiome(checkX, 0, checkZ);
      if (testBiome !== this) {
        //    heightSum += testBiome.getBlendtoHeight(checkX, 0, checkZ);
        heightSum += testBiome.getHeight(checkX, 0, checkZ);
        //   heightSum += this.biomeType.dimesnion.getHeight(checkX, 0, checkZ);
        validBiomesCount++;
      }
    }
    return heightSum / validBiomesCount;
  }

  getBlendedHeight(x: number, y: number, z: number) {
    const data = this.getData();
    if (data.heightBlendFactor <= 0) return this.getHeight(x, y, z);
    /* 
    const size = 8;

    let totalHeight = 0;
    let totalSum = 0;

    for (let ix = x - size / 2; ix < x + size / 2; ix++) {
      for (let iz = z - size / 2; iz < z + size / 2; iz++) {
        const testBiome = this.biomeType.dimesnion.getBiome(x, 0, z);
        totalHeight += testBiome.getHeight(x, y, z);
        totalSum++;
      }
    }

    return totalHeight / totalSum; */

    /*     const reachFactor = 32 * data.heightBlendFactor;
    let height = Math.round(this.getHeight(x, y, z));

    const minHeight = this.getData().minHeight;
    if (minHeight !== undefined) {
      if (height < minHeight) return minHeight;
    }

    return height; */
    const reachFactor = 32 * data.heightBlendFactor;
    let height = Math.round(this.getHeight(x, y, z));

    let heightSum = height;
    let count = 1; // Start with the current biome

    // Include the original cardinal directions
    heightSum += this.findHeightInDirection(height, x, z, 0, 1, reachFactor);
    heightSum += this.findHeightInDirection(height, x, z, 0, -1, reachFactor);
    heightSum += this.findHeightInDirection(height, x, z, 1, 0, reachFactor);
    heightSum += this.findHeightInDirection(height, x, z, -1, 0, reachFactor);
    count += 4;

    // Include the diagonal directions
    heightSum += this.findHeightInDirection(height, x, z, 1, 1, reachFactor);
    heightSum += this.findHeightInDirection(height, x, z, 1, -1, reachFactor);
    heightSum += this.findHeightInDirection(height, x, z, -1, 1, reachFactor);
    heightSum += this.findHeightInDirection(height, x, z, -1, -1, reachFactor);
    count += 4;

    const finalHeight = Math.round(heightSum / count);
    const minHeight = this.getData().minHeight;
    if (minHeight !== undefined) {
      if (finalHeight < minHeight) return minHeight;
    }
    return finalHeight;
  }

  abstract getGenVoxel(
    x: number,
    y: number,
    z: number
  ): Partial<PaintVoxelData> | false;
  abstract getCarved(x: number, y: number, z: number): boolean;
  abstract getBlendtoHeight(x: number, y: number, z: number): number;
  abstract getHeight(x: number, y: number, z: number): number;
  abstract decorate(x: number, y: number, z: number): void;
  abstract fill(x: number, y: number, z: number): void;
  abstract addTopLayer(x: number, y: number, z: number): boolean;

  abstract getData(): BiomeData;
  abstract getClass(): BiomeConstructor;
}
