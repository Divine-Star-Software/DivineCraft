import "./core.css";
import InitDVE from "Init/InitDVE";
import InitUI from "UI/InitUI";
import { GameManager } from "Game/GameManager";
import LoadingScreen from "UI/Loading";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import InitWorld from "Init/LoadWorld";
import StartGame from "Init/StartGame";

await LoadingScreen.show({
  progressBar: true,
});
const renderCanvas = document.getElementById(
  "render-canvas",
)! as HTMLCanvasElement;
await InitDVE(renderCanvas);

await GameManager.init();

LoadingScreen.progress.value = 0;
LoadingScreen.progress.text("Load UI");
const uiRoot = document.getElementById("ui")! as HTMLDivElement;
await InitUI(uiRoot);
await LoadingScreen.progress.updateProgressPercent(100);

await InitWorld();

await StartGame();

await LoadingScreen.hide();
