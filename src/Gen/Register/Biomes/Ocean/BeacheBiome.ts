import { Biome, BiomeConstructor, BiomeData } from "../../../Classes/Biome";
import { StandardCaves } from "../../Caves/StandardCaves";
import { VoxelData, Voxels } from "../Voxels";
import { Trees } from "../Tree";
import { Plants } from "../Plants";
import { Caves } from "../Caves";
const [xOffSet, zOffSet] = [1000, 10000];
const scale = 480;
export class BeacheBiome extends Biome {
  static data: BiomeData = {
    id: "beache",
    heightBlendFactor: 0.5,
    color: [252, 252, 3],
    edgeBiomes: [],
    minHeight: 60,
  };
  caveCarver = new StandardCaves(this.nodes);

  getGenVoxel(x: number, y: number, z: number) {
    return VoxelData[Voxels.Stone];
  }

  getCarved(x: number, y: number, z: number): boolean {
    return Caves.getCarved(x, y, z);
  }
  getBlendtoHeight(x: number, y: number, z: number): number {
    return this.nodes.waterHeight;
  }
  noiseQuery(x: number, y: number, z: number) {
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
    if (topAir && voxel == Voxels.Stone) {
      brush.setData(VoxelData[Voxels.Sand]).setXYZ(x, y, z).paint();
      let i = 5;
      while (i--) {
        brush
          .setData(VoxelData[Voxels.Sand])
          .setXYZ(x, y - 1 - i, z)
          .paint();
      }
      return true;
    }
    return false;
  }
  fill(x: number, y: number, z: number) {
    const { brush } = this.nodes;
    let i = y;
    while (i <= this.nodes.waterHeight) {
      if (y < this.nodes.waterHeight) {
        brush.setName(Voxels.Sand).setXYZ(x, i, z).paint();
      }
      i++;
    }
  }
  decorate(x: number, y: number, z: number) {
    const brush = this.nodes.brush;
    const dataTool = brush.dataCursor;
    const topAir = dataTool.getVoxel(x, y + 1, z)?.isAir();
    const voxel = dataTool.getVoxel(x, y, z)?.getName();
    if (topAir && voxel == Voxels.GrassBlock) {
      const value = Math.random();

      if (value > 0.999) {
        Trees.generateOakTree(x, y + 1, z);
        return;
      }
      if (value > 0.85 && value < 0.89) {
        Plants.generateRandomPlant(this.nodes, x, y + 1, z);
        return;
      }
    }
    if (topAir && voxel == Voxels.Sand) {
      const value = Math.random();
      if (value > 0.88 && value < 0.89) {
        Plants.generateRandomPlant(this.nodes, x, y + 1, z);
        return;
      }
      if (value > 0.0002 && value < 0.005) {
        Plants.generateReed(this.nodes, x, y + 1, z);
        return;
      }
    }
  }

  getData(): BiomeData {
    return this.getClass().data;
  }
  getClass(): BiomeConstructor {
    return BeacheBiome;
  }
}
