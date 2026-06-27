import { frag } from "@amodx/elm";
import BuildingScreen from "./Screens/Building/Building.screen";
import "./UI.css";
import { UIScreensIds } from "./ScreenIds";
import { UIScreen } from "./Screens/UIScreen";
export default function (uiRoot: HTMLDivElement) {
  uiRoot.append(
    frag(
      UIScreen({
        id: UIScreensIds.Blank,
        screen() {
          return frag();
        },
      }),
      BuildingScreen(),
    ),
  );
}
