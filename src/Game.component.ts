import { NCS } from "@amodx/ncs/";
import { PlayerComponent } from "./Player/Components/Player.component";
import { GameScreensComponent } from "Screens/GameScreens.component";
import { ItemRegisterComponent } from "Items/Components";

class Data {
  activePlayer: (typeof PlayerComponent)["default"];
  screens: (typeof GameScreensComponent)["default"];
  items: (typeof ItemRegisterComponent)["default"];
  constructor(public component: (typeof GameComponent)["default"]) {}
}

export const GameComponent = NCS.registerComponent<Data>({
  type: "game",
  init: (component) => (component.data = new Data(component.cloneCursor())),
});
