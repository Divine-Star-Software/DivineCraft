import { NCS, NodeCursor } from "@amodx/ncs";
import { ScreenComponent } from "./Screen.component";
import { UIScreensIds } from "../Game.types";
export const GameScreensComponent = NCS.registerComponent({
  type: "game-screens",
  schema: NCS.schema({
    activeScreen: NCS.property(""),
  }),
  data: NCS.data<{
    screens: Map<string, NodeCursor>;
  }>(),
  init(component) {
    component.data = {
      screens: new Map(),
    };
    const screens = ScreenComponent.getComponents(component.node.graph);

    for (const screen of screens) {
      component.data.screens.set(screen.schema.id, screen.node.cloneCursor());
      if (screen.schema.id == component.schema.activeScreen) {
        screen.schema.active = true;
      }
    }

    let currentScreen = UIScreensIds.Settings;
    const cursor = component.schema.getCursor();
    const index = component.schema.getSchemaIndex();
    cursor.getOrCreateObserver(index.activeScreen).subscribe((value) => {
      if (currentScreen != value) {
        ScreenComponent.getRequired(
          component.data.screens!.get(currentScreen)!
        )!.schema.active = false;
        ScreenComponent.getRequired(
          component.data.screens!.get(value)!
        )!.schema.active = true;
        currentScreen = value;
      }
    });
  },
});
