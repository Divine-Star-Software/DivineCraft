import { WorldGeneration } from "@divinevoxel/vlox/Tasks/WorldGeneration/WorldGeneration";

import { WorldGenInterface } from "@divinevoxel/vlox/Tasks/WorldGeneration/WorldGen.types";
import { GenerateTasks } from "@divinevoxel/vlox/Tasks/Tasks.types";

import { WorldGenBrush } from "@divinevoxel/vlox/Tasks/WorldGeneration/WorldGenBrush";
import { GenNodes } from "./Classes/GenNodes";
import { DimensionGenerator } from "./Classes/DimensionGenerator";
import RegisterAllBiomes from "./Register/RegisterAllBiomes";
import { OverWorldGenData } from "./Dimensions/OverWorld";
import { NooiseLayers } from "./Classes/NoiseLayers";
import { Threads } from "@amodx/threads";
import { Vec3Array } from "@amodx/math";
import { Trees } from "./Register/Biomes/Tree";
import { Coral } from "./Register/Biomes/Coral";
import { Caves } from "./Register/Biomes/Caves";

const brush = new WorldGenBrush();
let clearTimer: any;
export class WorldGen implements WorldGenInterface {
  static instance: WorldGen;
  nodes: GenNodes;
  overWorldGen: DimensionGenerator;
  constructor() {
    if (WorldGen.instance) return WorldGen.instance;
    WorldGen.instance = this;
  }
  init() {
    RegisterAllBiomes();
    WorldGeneration.setWorldGen(this);
    const noise = new NooiseLayers();
    this.nodes = new GenNodes();
    noise.init({
      biomeNoise: 8394723847382,
      biomeDetailNoise: 7089879878979,
      biomeTypeMoistureNoise: 2748927489274,
      biomeTypeTemperatureNoise: 1748927483928,
      biomeTypeElevationNoise: 7384723847938,
      biomeTypeRiverNoise: 3472983472983,
      worldNoise: 1892738192738,
      detailNoise: 3928743928743,
      oreNoise: 1928371928371,
      worldDetailNoise: 4938274938274,
      worldGenDetailNoise: 1029381029381,
    });
    this.nodes.init({ noise, brush });
    this.overWorldGen = new DimensionGenerator(this.nodes, OverWorldGenData);
    this.overWorldGen.init();
    Trees.init(this.nodes);
    Caves.init(this.nodes);
    Coral.init(this.nodes);
  }

  async generate([[dimension, cx, y, cz], data]: GenerateTasks): Promise<any> {
    //  await brush.worldAlloc([x,y,z],[x + 16,y,z + 16])
    // const t1 = performance.now();
    brush.start(dimension, cx, y, cz);

    this.overWorldGen.generateWorldColumn(cx, cz);

    /*    for (let x = cx; x < cx + 16; x++) {
      for (let z = cz; z < cz + 16; z++) {
        for (let y = 0; y < 70; y++) {
        brush.setName("dc_stone").setXYZ(x, y, z).paint();
        }
      }
    }
 */
    brush.stop();
    //    console.log("generated", [cx, cz], performance.now() - t1);
  }
  async decorate([[dimension, x, y, z], data]: GenerateTasks): Promise<any> {
    brush.start(dimension, x, y, z);
    this.overWorldGen.decorateWorldColumn(x, z);
    clearTimeout(clearTimer);
    clearTimer = setTimeout(() => this.overWorldGen.clearCache(), 60_000);
    brush.stop();
  }
}
export type GetBiomeImageTasks = [start: Vec3Array, end: Vec3Array];
Threads.registerTask<GetBiomeImageTasks>("get-biome-image", ([start, end]) => {
  const image = WorldGen.instance.overWorldGen.generateBiomeTypeImage(
    start,
    end
  );
  return [image, [image.buffer]];
});
