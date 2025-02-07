import { Biome, BiomeConstructor, BiomeData } from "../../../Classes/Biome";
import { StandardCaves } from "../../Caves/StandardCaves";
import { VoxelData, Voxels } from "../Voxels";
import { Trees } from "../Tree";
import { RiverBankBiome } from "./RiverBankBiome";
import { Plants } from "../Plants";
import { Caves } from "../Caves";
import { getBiomeRange } from "Gen/Biome.types";
const [xOffSet, zOffSet] = [1000, 10000];
const scale = 480;
export class RiverBiome extends Biome {
  static data: BiomeData = {
    id: "river",
    heightBlendFactor: 0.25,
    color: [3, 206, 252],
    edgeFactor: [0.0, 0.0, 0.0, [0.1, 0.3]],
    edgeBiomes: [[RiverBankBiome.data.id, getBiomeRange()]],
  };
  caveCarver = new StandardCaves(this.nodes);

  isRiver = true;
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
      this.nodes.waterHeight -
      5 -
      ((1 +
        this.nodes.noise.worldGenNoise(
          (x + xOffSet) / scale,
          0,
          (z + zOffSet) / scale
        )) /
        2) *
        5;

    return height;
  }
  getLayerVoxel(x: number, y: number, z: number) {
    const value =
      (1 + this.nodes.noise.worldGenNoise(x / 200, y / 200, z / 200)) / 2;
    if (value >= 0.7) return Voxels.Gravel;
    if (value < 0.7 && value > 0.4) return Voxels.Dirt;
    if (value <= 0.4 && value > 0.2) return Voxels.Sand;
    return Voxels.Clay;
  }
  addTopLayer(x: number, y: number, z: number) {
    const brush = this.nodes.brush;
    const dataTool = brush.dataCursor;
    const topVoxel = dataTool.getVoxel(x, y + 1, z);
    const topAir =
      topVoxel?.isAir() ||
      (topVoxel?.isRenderable() &&
        dataTool.getVoxel(x, y + 1, z)!.getSubstanceData()["dve_is_liquid"]);
    const voxel = dataTool.getVoxel(x, y, z)?.getName();
 
    if (topAir && voxel == Voxels.Stone!) {
      brush
        .setName(this.getLayerVoxel(x, y, z))
        .setXYZ(x, y, z)
        .paint();
      let i = 5;
      while (i--) {
        brush
          .setName(this.getLayerVoxel(x, y - 1, z))
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
    brush.setName(Voxels.Water).setLevel(7);
    while (i <= this.nodes.waterHeight) {
      if (y < this.nodes.waterHeight) {
        brush.setXYZ(x, i, z).paint();
      }
      i++;
    }
    brush.setLevel(0);
  }
  decorate(x: number, y: number, z: number) {
    const brush = this.nodes.brush;
    const dataTool = brush.dataCursor;
    const topVoxel = dataTool.getVoxel(x, y + 1, z);
    const topAir =
      topVoxel?.isAir() ||
      (topVoxel?.isRenderable() &&
        dataTool.getVoxel(x, y + 1, z)!.getSubstanceData()["dve_is_liquid"]);
    const voxel = dataTool.getVoxel(x, y, z)?.getName();
    if (
      topAir &&
      (voxel == Voxels.Dirt || voxel == Voxels.Sand) &&
      y < this.nodes.waterHeight - 1
    ) {
      if (Math.random() > 0.98) {
        Plants.generateWaterPlant(this.nodes, x, y + 1, z);
      }
    }
  }

  getData(): BiomeData {
    return this.getClass().data;
  }
  getClass(): BiomeConstructor {
    return RiverBiome;
  }
}
