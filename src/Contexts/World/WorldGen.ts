const voxels = {
  stone: "dc_stone",
  cobbleStone: "dc_cobble_stone",
  grassBlock: "dc_grass_block",
  oakLog: "dc_oak_log",
  oakLeaves: "dc_oak_leaves",
  water: "dc_water",
  glowStone: "dc_glow_stone",
  sand: "dc_sand",
  dirt: "dc_dirt",
};

import { PerlinNoise3d } from "@divinestar/rng/perlin/index";
const perlin = new PerlinNoise3d();
perlin.noiseSeed(2039482390);

const biomePerlin = new PerlinNoise3d();
biomePerlin.noiseSeed(203948239);

import { AdvancedBrush } from "@divinevoxel/foundation/Default/Tools/Brush/AdvancedBrushTool";
import { DataTool } from "@divinevoxel/foundation/Default/Tools/Data/DataTool";

enum Biomes {
  Ocean,
  Beach,
  Grassland,
}

const brush = new AdvancedBrush();
const dataTool = new DataTool();
export class WorldGen {
  chunkDepth = 16;
  chunkWidth = 16;
  worldHeight = 60;
  waterHeight = 30;

  getBiome(x: number, z: number): Biomes {
    const [xOffSet, yOffset, zOffSet] = [1000, 100, 10000];
    const scale = 120;
    let value = biomePerlin.get(
      (x + xOffSet) / scale,
      0,
      (z + zOffSet) / scale
    );
    if (value > 0.6) return Biomes.Ocean;
    if (value <= 0.6 && value >= 0.5) return Biomes.Beach;
    return Biomes.Grassland;
  }

  inNoiseRange(x: number, y: number, z: number) {
    const p1 = perlin;
    const [xOffSet, yOffset, zOffSet] = [1000, 100, 10000];
    const scale = 30;
    let height = p1.get((x + xOffSet) / scale, 0, (z + zOffSet) / scale) * 0.5;
    let detail =
      p1.get((x - xOffSet) / 15, (y + yOffset) / 15, (z - zOffSet) / 15) * 0.5;
    let r = height + detail;
    let elevation = y / 140;
    return r > 0.3 + elevation && r < 0.4 + elevation;
  }
  noiseHeight(x: number, z: number) {
    const p1 = perlin;
    const [xOffSet, zOffSet] = [1000, 10000];
    const scale = 30;
    let height =
      p1.get((x + xOffSet) / scale, 0, (z + zOffSet) / scale) *
      this.worldHeight;
    return height;
  }
  generateTree(x: number, y: number, z: number) {
    brush.setId("dc_oak_log").setXYZ(x, y, z).paint();
    for (let dy = y + 1; dy <= y + 6; dy++) {
      brush.setId("dc_oak_log").setXYZ(x, dy, z).paint();
    }
    this.addLeaves(x, y + 6, z);
    this.addLeaves(x, y + 5, z);
    brush
      .setId("dc_oak_leaves")
      .setXYZ(x, y + 7, z)
      .paint();
  }

  addLeaves(x: number, y: number, z: number) {
    const offsets = [-1, 0, 1];
    offsets.forEach((dx) => {
      offsets.forEach((dz) => {
        if (dx !== 0 || dz !== 0) {
          brush
            .setId("dc_oak_leaves")
            .setXYZ(x + dx, y, z + dz)
            .paint();
        }
      });
    });
  }

  generateWorldColumn(chunkX: number, chunkZ: number) {
    brush.start();
    for (let x = chunkX; x < this.chunkWidth + chunkX; x++) {
      for (let z = chunkZ; z < this.chunkDepth + chunkZ; z++) {
        for (let y = 0; y < this.worldHeight; y++) {
          if (y == 0) {
            brush.setId(voxels.stone).setXYZ(x, y, z).paint();
            continue;
          }
          if (!this.inNoiseRange(x, y, z)) {
            continue;
          }

          brush.setId(voxels.stone).setXYZ(x, y, z).paint();
        }
      }
    }
    brush.stop();
  }
  fillWorldColumn(chunkX: number, chunkZ: number) {
    brush.start();
    for (let x = chunkX; x < this.chunkWidth + chunkX; x++) {
      for (let z = chunkZ; z < this.chunkDepth + chunkZ; z++) {
        let groundHeight = this.noiseHeight(x, z);
        const biomes = this.getBiome(x, z);
        for (let y = 1; y < this.worldHeight; y++) {
          if (dataTool.loadInAt(x, y, z) && dataTool.isRenderable()) continue;
          if (y < this.waterHeight && biomes == Biomes.Ocean) {
            brush.setId(voxels.water).setXYZ(x, y, z).paint();
          }
          if (
            (y < this.waterHeight || y < groundHeight) &&
            biomes == Biomes.Beach
          ) {
            brush.setId(voxels.sand).setXYZ(x, y, z).paint();
          }
        }
      }
    }
    brush.stop();
  }
  decorateWorldColumn(chunkX: number, chunkZ: number) {
    brush.start();
    for (let x = chunkX; x < this.chunkWidth + chunkX; x++) {
      for (let z = chunkZ; z < this.chunkDepth + chunkZ; z++) {
        for (let y = 1; y < this.worldHeight; y++) {
          dataTool.loadInAt(x, y + 1, z);

          const topAir = dataTool.isAir();
          dataTool.loadInAt(x, y, z);
          const voxel = dataTool.getStringId();

          if (topAir && voxel == voxels.stone) {
            brush.setId(voxels.grassBlock).setXYZ(x, y, z).paint();
            let i = 5;
            while (i--) {
              brush
                .setId(voxels.dirt)
                .setXYZ(x, y - 1 - i, z)
                .paint();
            }
            if (Math.random() > 0.99) {
              this.generateTree(x, y + 1, z);
            }
          }
        }
      }
    }
    brush.stop();
  }
}
