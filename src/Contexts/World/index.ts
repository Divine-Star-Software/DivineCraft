import { StartWorld } from "@divinevoxel/vlox/Init/StartWorld";
import { WorldSimulation } from "@divinevoxel/vlox/WorldSimulation";
import { WorldSimulationDimensions } from "@divinevoxel/vlox/WorldSimulation/Internal/WorldSimulationDimensions";
import { WorldSimulationTasks } from "@divinevoxel/vlox/WorldSimulation/Internal/WorldSimulationTasks";
import { TickInterval } from "Util/TickInterval";
import { CreateNodeData, NCS, NodeCursor } from "@amodx/ncs";
import { TransformComponent } from "@dvegames/vlox/Transform.component";
import { Threads } from "@amodx/threads";
import { LocationData } from "@divinevoxel/vlox/Math";
import { RawVoxelData } from "@divinevoxel/vlox";
import { VoxelBuildSpaceWorld } from "@divinevoxel/vlox/Builder/World/VoxelBuildSpaceWorld";
import { CachedBiomeRegister } from "Gen/Register/Cached/CachedBiomeRegister";
import { Vector3Like } from "@amodx/math";

//const worldStorage = new WorldStorage();
const DVEW = await StartWorld({
  // worldStorage,
});
const buildSpace = new VoxelBuildSpaceWorld();
WorldSimulation.doTickUpdates = false;
//await worldStorage.init("divine-craft", DVEW.threads.constructors);
WorldSimulation.init({
  // worldStorage,
  parent: DVEW.threads.parent,
  meshers: DVEW.threads.meshers,
  generators: DVEW.threads.generators,
});

const tickInterval = new TickInterval(() => WorldSimulation.tick(), 50);

const graph = NCS.createGraph();
let player: NodeCursor | null = null;
Threads.registerTask<LocationData>("log-sector", async (data) => {
  const activeSector = WorldSimulationDimensions.getDimension(
    data[0],
  )!.activeSectors.get(data[1], data[2], data[3]);
  if (!activeSector) {
    console.error("Could not find sector at:", data);
    return;
  }
  console.log(activeSector);
  console.log(WorldSimulationTasks.buildTasks);
  const dimension = WorldSimulationDimensions.getDimension(data[0])!;
  console.log(dimension);
  console.log(dimension.getTask(WorldSimulationTasks.buildTasks.data.id));
});
Threads.registerTask<CreateNodeData>("create-player", async (data) => {
  player = graph.addNode(data).cloneCursor();
});

WorldSimulation.Tasks.worldLoadTasks.addSubTask({
  id: "biome-cache-load",
  generationTask: true,
  checkInRequired: false,
  async run(dimesnion, location, taskId, task) {
    const [dimension, x, y, z] = location;
    const sector = CachedBiomeRegister.get(dimension, x, y, z);
    if (sector) return task.completeSubTask(taskId);
    if (!WorldSimulation.Tools.worldStorage) {
      const newSector = CachedBiomeRegister.new(dimension, x, y, z);
      DVEW.threads.generators.runTaskForAll(
        "sync-biome-cache",
        newSector.toJSON(),
      );
      return task.completeSubTask(taskId);
    }

    const newSector = CachedBiomeRegister.new(dimension, x, y, z);
    DVEW.threads.generators.runTaskForAll(
      "sync-biome-cache",
      newSector.toJSON(),
    );
    task.completeSubTask(taskId);
  },
});
WorldSimulation.Tasks.unloadTasks.addSubTask({
  id: "biome-cache-load",
  generationTask: true,
  checkInRequired: false,
  async run(dimesnion, location, taskId, task) {
    const [dimension, x, y, z] = location;
    const sector = CachedBiomeRegister.get(dimension, x, y, z);
    if (!sector) return task.completeSubTask(taskId);
    if (!WorldSimulation.Tools.worldStorage) {
      CachedBiomeRegister.delete(dimension, x, y, z);
      DVEW.threads.generators.runTaskForAll("desync-biome-cache", location);
      return task.completeSubTask(taskId);
    }

    CachedBiomeRegister.delete(dimension, x, y, z);
    DVEW.threads.generators.runTaskForAll("desync-biome-cache", location);
    task.completeSubTask(taskId);
  },
});

const radius = 300;
Threads.registerTask<{ position: Vector3Like }>(
  "load-world",
  async ({ position }) => {
    console.log("START WORLD", position);
    console.warn("start inital load", position.x, position.y, position.z);

    await WorldSimulation.Procedures.InitalLoad({
      //logTasks: true,
      genData: {
        position,
        renderRadius: radius - 100,
        generationRadius: radius - 50,
        maxRadius: radius,
      },
    });
  },
);
Threads.registerTask("start-world", async () => {
  if (!player) throw new Error(`Player not created yet`);
  const position = TransformComponent.getRequired(player).schema.position;
  const generator = WorldSimulation.createGenerator({
    position,
    renderRadius: radius - 100,
    generationRadius: radius - 50,
    maxRadius: radius,
  });

  WorldSimulation.addGenerator(generator);
  tickInterval.start();
});

Threads.registerTask("world-ready", () => {});
