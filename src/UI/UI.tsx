import BuildingScreen from "./Screens/Building/Building.screen";
import SettingsScreen from "./Screens/Settings/Settings.screen";

import "./UI.css";
import { NodeCursor } from "@amodx/ncs/";
import { GameProvider } from "./Hooks/useGame";

export default function (props: { gameRoot: NodeCursor }) {
  return (
    <GameProvider gameRoot={props.gameRoot}>
      <div className="ui-screens">
        <BuildingScreen />
        <SettingsScreen />
      </div>
    </GameProvider>
  );
}
