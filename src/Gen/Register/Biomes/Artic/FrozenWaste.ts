import { Biome, BiomeConstructor, BiomeData } from "../../../Classes/Biome";
import { StandardCaves } from "../../Caves/StandardCaves";
import { VoxelData, Voxels } from "../Voxels";
import { Trees } from "../Tree";
import { Plants } from "../Plants";
import { Caves } from "../Caves";
const [xOffSet, zOffSet] = [1000, 10000];
const scale = 100;

export class FrozenWaste extends Biome {
  static data: BiomeData = {
    id: "frozen-waste",
    heightBlendFactor: 1,
    color: [255, 255, 255],
    edgeBiomes: [],
  };

  getGenVoxel(x: number, y: number, z: number) {
    let height = this.noiseQuery(x, y, z) * 40 + this.nodes.minHeight;
    if (y > height) return false;
    return VoxelData[Voxels.Stone];
  }

  getCarved(x: number, y: number, z: number): boolean {
    return Caves.getCarved(x, y, z);
  }

  getBlendtoHeight(x: number, y: number, z: number): number {
    return this.getHeight(x, y, z);
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
    let height = this.noiseQuery(x, 0, z) * 40 + this.nodes.minHeight;
    return height;
  }

  addTopLayer(x: number, y: number, z: number) {
    const brush = this.nodes.brush;
    const dataTool = brush.dataCursor;
    const topAir = dataTool.getVoxel(x, y + 1, z)?.isAir();
    const voxel = dataTool.getVoxel(x, y, z)?.getName();
    if (topAir && voxel == Voxels.Stone!) {
      brush.setData(VoxelData[Voxels.Gravel]).setXYZ(x, y, z).paint();
      brush
        .setData(VoxelData[Voxels.Snow])
        .setXYZ(x, y + 1, z)
        .paint();

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

  }

  getData(): BiomeData {
    return this.getClass().data;
  }
  getClass(): BiomeConstructor {
    return FrozenWaste;
  }
}
