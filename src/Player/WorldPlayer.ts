import { PlaceVoxelTask, PlayerTasks, RemoveVoxelTask } from "./Player.types";

import { AdvancedBrush } from "@divinevoxel/foundation/Default/Tools/Brush/AdvancedBrushTool";
import { DataTool } from "@divinevoxel/foundation/Default/Tools/Data/DataTool";
import { Vec3Array } from "@divinevoxel/core/Math";
import { SetUpPlayerData } from "./Core/Data/SetUpPlayerData";
import { DivineVoxelEngineWorld } from "@divinevoxel/core/Contexts/World";
import { PlayerManager } from "./Core/Data/index";
import { WorldPlayer } from "./Core/World/WorldPlayer";
export async function InitWorldPlayer(DVEW: DivineVoxelEngineWorld) {
  console.log("SET UP PLAER DASTA WORLD", PlayerManager);
  await SetUpPlayerData(DVEW.TC);

  console.log("done", DVEW);
  const worlPlayer = new WorldPlayer(DVEW, PlayerManager);

  const brush = new AdvancedBrush();
  const dataTool = new DataTool();

  DVEW.TC.registerTasks(
    PlayerTasks.Place,
    async ([location, data]: [Vec3Array, any]) => {
      if (location[0] == Infinity) return;
      console.log(
        "PLACE VOXEL",
        location,
        data,
        !dataTool.setXYZ(...location).loadIn() || !dataTool.isAir()
      );
      if (!dataTool.setXYZ(...location).loadIn() || !dataTool.isAir()) return;
      console.log("PLACE VOXEL", location, data);
      await brush
        .setXYZ(...location)
        .setId(data.id!)
        .paintAndAwaitUpdate();
    }
  );
  DVEW.TC.registerTasks(PlayerTasks.Remove, ([location]: [Vec3Array]) => {
    if (location[0] == Infinity) return;
    brush.setXYZ(...location).eraseAndAwaitUpdate();
  });

  setInterval(() => {
    worlPlayer.update();
  }, 100);
}
