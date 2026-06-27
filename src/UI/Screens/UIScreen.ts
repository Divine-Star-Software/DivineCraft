import { ScreenComponent } from "Game/Components/Screens/Screen.component";
import { ElementChildren, elm } from "@amodx/elm";
import { GameManager } from "Game/GameManager";
export type UIScreenComponent = (props: { id: string }) => ElementChildren;

export function UIScreen({
  id,
  screen: screenComp,
}: {
  id: string;
  screen: UIScreenComponent;
}) {
  const screens = GameManager.screens;
  const screenNode = screens.data.screens.get(id);
  if (!screenNode) throw new Error(`Screen node with id ${id} not registered`);
  const screen = ScreenComponent.getRequired(screenNode);
  return elm("div", {
    className: "ui-screen",
    hooks: {
      afterRender(div) {
        if (!screen.schema.active) div.classList.add("hidden");

        const activeListener = async (active: boolean) => {
          console.log("set active", id, active);
          if (active) {
            elm.appendChildren(div, screenComp({ id }));
            div.style.opacity = "0";
            div.classList.remove("hidden");

            const anim = elm.animate(
              div,
              [
                {
                  opacity: 0,
                },
                {
                  opacity: 1,
                },
              ],
              { duration: 300, delay: 40 },
            );

            await anim.playAndWait();
            div.classList.remove("hidden");
            div.style.opacity = "1";
          } else {
            div.replaceChildren();
            div.style.opacity = "1";
            const anim = elm.animate(
              div,
              [
                {
                  opacity: 1,
                },
                {
                  opacity: 0,
                },
              ],
              { duration: 300 },
            );
            await anim.playAndWait();
            div.classList.add("hidden");
            div.style.opacity = "0";
          }
        };
        activeListener(screen.schema.active);
        const observer = screen.schema
          .getCursor()
          .getOrCreateObserver(screen.schema.getSchemaIndex().active);
        observer.subscribe(activeListener);
      },
    },
  });
}
