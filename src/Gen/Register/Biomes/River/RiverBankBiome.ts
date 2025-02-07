import { Biome, BiomeConstructor, BiomeData } from "../../../Classes/Biome";
import { StandardCaves } from "../../Caves/StandardCaves";
import { VoxelData, Voxels } from "../Voxels";
import { Trees } from "../Tree";
import { Plants } from "../Plants";
import { Caves } from "../Caves";
const [xOffSet, zOffSet] = [1000, 10000];
const scale = 120;
export class RiverBankBiome extends Biome {
  static data: BiomeData = {
    id: "river-bank",
    heightBlendFactor: 0.25,
    color: [43, 26, 1],
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
    let height = this.noiseQuery(x, 0, z) * 5 + (this.nodes.waterHeight + 5);
    return height;
  }

  addTopLayer(x: number, y: number, z: number) {
    const brush = this.nodes.brush;
    const dataTool = brush.dataCursor;
    const topAir = dataTool.getVoxel(x, y + 1, z)?.isAir() || true;
    const voxel = dataTool.getVoxel(x, y, z)?.getName();
    if (topAir && voxel == Voxels.Stone) {
      brush
        .setName(this.getFillVoxel(x, y, z, true))
        .setXYZ(x, y, z)
        .paint();
      let i = 5;
      while (i--) {
        brush
          .setName(this.getFillVoxel(x, y - 1 - i, z))
          .setXYZ(x, y - 1 - i, z)
          .paint();
      }
      return true;
    }
    return false;
  }

  getFillVoxel(x: number, y: number, z: number, top = false) {
    const value =
      (1 +
        this.nodes.noise.worldGenNoise(
          x / 20 + 10,
          y / 20 + 100,
          z / 20 + 10
        )) /
      2;

    if (value > 0.5 && value < 1) return Voxels.Sand;
    if (value > 0.3 && value < 0.5)
      return top ? Voxels.GrassBlock : Voxels.Dirt;
    return Voxels.Gravel;
  }
  fill(x: number, y: number, z: number) {
    const brush = this.nodes.brush;
    const dataTool = brush.dataCursor;
    let i = y;
    while (i <= this.nodes.waterHeight) {
      if (y < this.nodes.waterHeight) {
        if (!dataTool.getVoxel(x, y, z)?.isRenderable()) {
          brush
            .setName(this.getFillVoxel(x, i, z, i == this.nodes.waterHeight))
            .setXYZ(x, i, z)
            .paint();
        }
      }
      i++;
    }
  }
  decorate(x: number, y: number, z: number) {
    const brush = this.nodes.brush;
    const dataTool = brush.dataCursor;
    const topAir = dataTool.getVoxel(x, y + 1, z)?.isAir() || true;
    const voxel = dataTool.getVoxel(x, y, z)?.getName();
    if (topAir && voxel == Voxels.GrassBlock) {
      const value = Math.random();

      if (value > 0.99) {
        Trees.generateOakTree(x, y + 1, z);
        return;
      }
      if (value > 0.9 && value < 0.92) {
        Plants.generateReed(this.nodes, x, y + 1, z);
        return;
      }

      if (value > 0.0 && value < 0.1) {
        Plants.generateRandomPlant(this.nodes, x, y + 1, z);
        return;
      }
    }
  }

  getData(): BiomeData {
    return this.getClass().data;
  }
  getClass(): BiomeConstructor {
    return RiverBankBiome;
  }
}
