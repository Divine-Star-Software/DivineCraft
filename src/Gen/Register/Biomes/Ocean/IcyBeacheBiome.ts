import { Biome, BiomeConstructor, BiomeData } from "../../../Classes/Biome";
import { StandardCaves } from "../../Caves/StandardCaves";
import { VoxelData, Voxels } from "../Voxels";
import { Trees } from "../Tree";
import { Plants } from "../Plants";
import { Caves } from "../Caves";
const [xOffSet, zOffSet] = [1000, 10000];
const scale = 480;
export class IcyBeacheBiome extends Biome {
  static data: BiomeData = {
    id: "icy-beach",
    heightBlendFactor: 0.5,
    color: [230, 230, 85],
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
  getHeight(x: number, y: number, z: number): number {

    let height =
      ((1 +
        this.nodes.noise.worldGenNoise(
          (x + xOffSet) / scale,
          0,
          (z + zOffSet) / scale
        )) /
        2) *
        5 +
      this.nodes.minHeight;
    return height;
  }

  addTopLayer(x: number, y: number, z: number) {
    const brush = this.nodes.brush;
    const dataTool = brush.dataCursor;
    const topAir = dataTool.getVoxel(x, y + 1, z)?.isAir() || true;
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
    const topAir = dataTool.getVoxel(x, y + 1, z)?.isAir() || true;
    const voxel = dataTool.getVoxel(x, y, z)?.getName();
    if (topAir && voxel == Voxels.Sand) {
      const value = Math.random();

      if (value < 0.95) {
        brush
          .setName(Voxels.Snow)
          .setXYZ(x, y + 1, z)
          .paint();
        return;
      }
    }
  }

  getData(): BiomeData {
    return this.getClass().data;
  }
  getClass(): BiomeConstructor {
    return IcyBeacheBiome;
  }
}
