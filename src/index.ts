import "./core.css";
import InitDVE from "InitDVE";
import InitUI from "UI/InitUI";
import { GameManager } from "Game/GameManager";

const renderCanvas = document.getElementById(
  "render-canvas",
)! as HTMLCanvasElement;
await InitDVE(renderCanvas);
await GameManager.init();
const uiRoot = document.getElementById("ui")! as HTMLDivElement;
await InitUI(uiRoot);
await GameManager.startGame();

