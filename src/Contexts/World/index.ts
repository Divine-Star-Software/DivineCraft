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

//const worldStorage = new WorldStorage();
const DVEW = await StartWorld({
  // worldStorage,
});
//await worldStorage.init("divine-craft", DVEW.threads.constructors);
WorldSimulation.init({
  // worldStorage,
  parent: DVEW.threads.parent,
  meshers: DVEW.threads.meshers,
  generators: DVEW.threads.generators,
});

const dimension = WorldSimulation.getDimension(0);

const brush = dimension.getBrush();
Threads.registerTask<[LocationData, RawVoxelData]>(
  "paint-voxel",
  async ([location, raw]) => {
    brush.setXYZ(location[1], location[2], location[3]);
    brush.setRaw(raw);
    await brush.paintAsync();
  }
);
Threads.registerTask<LocationData>("erase-voxel", async (location) => {
  brush.setXYZ(location[1], location[2], location[3]);
  await brush.eraseAsync();
});
const tickInterval = new TickInterval(() => WorldSimulation.tick(), 50);

const graph = NCS.createGraph();
let player: NodeCursor | null = null;
Threads.registerTask<LocationData>("log-sector", async (data) => {
  const activeSector = WorldSimulationDimensions.getDimension(
    data[0]
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
Threads.registerTask("start-world", async () => {
  if (!player) throw new Error(`Player not created yet`);
  const position = TransformComponent.getRequired(player).schema.position;
  console.warn("start inital load");

  await WorldSimulation.Procedures.InitalLoad({
    logTasks: true,
    genData: {
      position,
      renderRadius: 150,
      generationRadius: 250,
      maxRadius: 300,
    },
  });

  const generator = WorldSimulation.createGenerator({
    position,
    renderRadius: 150,
    generationRadius: 250,
    maxRadius: 300,
  });

  WorldSimulation.addGenerator(generator);
  console.warn("start building");
  tickInterval.start();
});

Threads.registerTask("world-ready", () => {});
