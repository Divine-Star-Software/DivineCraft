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

export abstract class Biome {
  isRiver?: boolean;
  constructor(
    public nodes: GenNodes,
    public biomeType: BiomeType,
  ) {}

  getBlendedHeight(x: number, y: number, z: number) {
    const data = this.getData();
    const radius = 8;

    if (radius <= 0) return this.getHeight(x, y, z);

    let totalHeight = 0;
    let totalWeight = 0;

    for (let dx = -radius; dx <= radius; dx++) {
      for (let dz = -radius; dz <= radius; dz++) {
        const checkX = x + dx;
        const checkZ = z + dz;

        const distance = Math.sqrt(dx * dx + dz * dz);
        if (distance >= radius) continue;

        const weight = 0.5 * (1 + Math.cos((Math.PI * distance) / radius));

        const targetHeight = this.biomeType.dimesnion.biomes.getHeight(
          checkX,
          0,
          checkZ,
        );

        totalHeight += targetHeight * weight;
        totalWeight += weight;
      }
    }

    if (totalWeight === 0) return this.getHeight(x, y, z);
    return Math.round(totalHeight / totalWeight);
  }

  abstract getGenVoxel(
    x: number,
    y: number,
    z: number,
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
