import { StartWorld } from "@divinevoxel/vlox/Init/StartWorld";
import { IWG } from "@divinevoxel/vlox/Tasks/IWG/";
import { SafeInterval } from "@amodx/core/Intervals/SafeInterval";
import { CreateNodeData, NCS, NodeCursor } from "@amodx/ncs";
import { TransformComponent } from "@dvegames/vlox/Core/Components/Base/Transform.component";
import { WorldStorage } from "./Storage";
import { Threads } from "@amodx/threads";
import RegisterCoreTasksWorld from "@dvegames/vlox/Core/Tasks/World/RegisterTasksWorld";

//const worldStorage = new WorldStorage();
const DVEW = await StartWorld({
  //worldStorage,
});
RegisterCoreTasksWorld(DVEW);
//await worldStorage.init("divine-craft", DVEW.threads.constructors);
IWG.init({
  // worldStorage,
  parent: DVEW.threads.parent,
  threads: DVEW.threads.constructors,
});
const generateInterval = new SafeInterval(() => IWG.update(), 10);
const tickInterval = new SafeInterval(() => IWG.tick(), 50);

const graph = NCS.createGraph();
let player: NodeCursor | null = null;
Threads.registerTask<CreateNodeData>("create-player", async (data) => {
  player = graph.addNode(data).cloneCursor();
});
Threads.registerTask("start-world", async () => {
  if (!player) throw new Error(`Player not created yet`);
  const position = TransformComponent.getRequired(player).schema.position;
  console.warn("start inital load");
  
 
  await IWG.Procedures.InitalLoad({
    dimension: "main",
    logTasks: true,
    genData: {
      position,
      renderRadius: 150,
      generationRadius: 250,
      maxRadius: 300,
    },
  });

  const generator = IWG.createGenerator({
    dimension: "main",
    position,
    renderRadius: 150,
    generationRadius: 250,
    maxRadius: 300,
  });

  IWG.addGenerator(generator);
  console.warn("start building");
  tickInterval.start();
  generateInterval.start();
});

Threads.registerTask("world-ready",()=>{});