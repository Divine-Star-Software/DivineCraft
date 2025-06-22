import { Biome, BiomeConstructor, BiomeData } from "../../../Classes/Biome";
import { StandardCaves } from "../../Caves/StandardCaves";
import { VoxelData, Voxels } from "../Voxels";
import { Trees } from "../Tree";
import { Plants } from "../Plants";
import { Caves } from "../Caves";

export class BirchForestBiome extends Biome {
  static data: BiomeData = {
    id: "birch-forest",
    heightBlendFactor: 1,
    color: [95, 204, 61],
    edgeBiomes: [],
  };
  caveCarver = new StandardCaves(this.nodes);

  getGenVoxel(x: number, y: number, z: number) {
    return VoxelData[Voxels.Stone];
  }

  getCarved(x: number, y: number, z: number): boolean {
    return Caves.getCarved(x, y, z);
  }
  getBlendtoHeight(x: number, y: number, z: number): number {
    return this.getHeight(x, y, z);
  }
  noiseQuery(x: number, y: number, z: number) {
    const [xOffSet, zOffSet] = [1000, 10000];
    const scale = 480;

    return (
      (1 +
        this.nodes.noise.worldGenNoise(
          (x + xOffSet) / scale,
          y / scale,
          (z + zOffSet) / scale
        )) /
      2
    );
  }
  getHeight(x: number, y: number, z: number): number {
    let height = this.noiseQuery(x, 0, z) * 30 + this.nodes.minHeight;
    return height;
  }

  addTopLayer(x: number, y: number, z: number) {
    const brush = this.nodes.brush;
    const dataTool = brush.dataCursor;
    const topAir = dataTool.getVoxel(x, y + 1, z)?.isAir();
    const voxel = dataTool.getVoxel(x, y, z)?.getName();

    if (topAir && voxel == Voxels.Stone!) {
      brush.setData(VoxelData[Voxels.GrassBlock]).setXYZ(x, y, z).paint();
      let i = 5;
      while (i--) {
        brush
          .setData(VoxelData[Voxels.Dirt])
          .setXYZ(x, y - 1 - i, z)
          .paint();
      }
      return true;
    }
    return false;
  }
  fill(x: number, y: number, z: number) {
    return false;
  }
  decorate(x: number, y: number, z: number) {
    const brush = this.nodes.brush;
    const dataTool = brush.dataCursor;
    const topAir = dataTool.getVoxel(x, y + 1, z)?.isAir();
    const voxel = dataTool.getVoxel(x, y, z)?.getName();
    if (topAir && voxel == Voxels.GrassBlock) {
      const value = Math.random();

      if (value > 0.85 && value < 0.89) {
        Plants.generateRandomFlower(this.nodes, x, y + 1, z);
        return;
      }

      if (value > 0.0 && value < 0.1) {
        Plants.generateRandomPlant(this.nodes, x, y + 1, z);
        return;
      }

      if (value > 0.2 && value < 0.25) {
        Trees.generateBirchTree(x, y + 1, z);
        return;
      }
    }
  }

  getData(): BiomeData {
    return this.getClass().data;
  }
  getClass(): BiomeConstructor {
    return BirchForestBiome;
  }
}
