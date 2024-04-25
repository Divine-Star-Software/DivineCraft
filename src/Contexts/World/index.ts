import { DivineVoxelEngineWorld } from "@divinevoxel/core/Contexts/World";
import { StartWorld } from "@divinevoxel/foundation/Default/Init/StartWorld";
import { WorldGen } from "./WorldGen";
import { voxelData } from "../../Data/VoxelData";
import { InitWorldPlayer } from "Player/WorldPlayer";
const {DVEW, core } = await StartWorld({
  nexusEnabled: true,
  voxels: voxelData,
});

const worldGen = new WorldGen();

DivineVoxelEngineWorld.instance.TC.registerTasks("start-world", async () => {
  const numChunks = 5;
  let startX = -16 * numChunks;
  let startZ = -16 * numChunks;
  let endX = 16 * numChunks;
  let endZ = 16 * numChunks;

  const builder = core.getBuilder();

  const tasks = core.getTasksTool();
  tasks.setFocalPoint(["main", 0, 0, 0]);
  for (let x = startX; x < endX; x += 16) {
    for (let z = startZ; z < endZ; z += 16) {
      builder.setXZ(x, z).fillColumn();
      worldGen.generateWorldColumn(x, z);
      worldGen.fillWorldColumn(x, z);
      worldGen.decorateWorldColumn(x, z);
      tasks.propagation.queued.add(["main", x, 0, z]);
      tasks.worldSun.queued.add(["main", x, 0, z]);
    }
  }

  await tasks.worldSun.queued.runAndAwait();
  await tasks.propagation.queued.runAndAwait();

  for (let x = startX; x < endX; x += 16) {
    for (let z = startZ; z < endZ; z += 16) {
      builder.setXZ(x, z).buildColumn();
    }
  }

  InitWorldPlayer(DVEW);
});
