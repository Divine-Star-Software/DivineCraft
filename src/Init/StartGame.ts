import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { GameManager } from "Game/GameManager";
import LoadingScreen from "UI/Loading";

export default async function () {
  LoadingScreen.progress.value = 0;
  LoadingScreen.progress.text("Create Player");
  await DivineVoxelEngineRender.instance.threads.world.waitTillTaskExist(
    "create-player",
  );
  await GameManager.startGame();
  await LoadingScreen.progress.updateProgressPercent(100);

  await DivineVoxelEngineRender.instance.threads.world.runTaskAsync(
    "start-world",
    [],
  );
}
