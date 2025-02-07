import { UIScreen } from "../UIScreen";
import { PlayerInventory } from "./PlayerInventory";
import "./Building.css";
import { UIScreensIds } from "Game.types";
function BuildScreen() {
  return (
    <>
      <PlayerInventory />
    </>
  );
}

export default function () {
  return (
    <>
      <UIScreen id={UIScreensIds.InGame} screen={BuildScreen} />
    </>
  );
}
