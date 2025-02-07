import { ReactNode, useEffect, useState } from "react";
import { useGame } from "../Hooks/useGame";
import { ScreenComponent } from "Screens/Screen.component";
export type UIScreenComponent = (props: { id: string }) => ReactNode;

export function UIScreen(props: { id: string; screen: UIScreenComponent }) {
  const screens = useGame().data.screens;

  const screenNode = screens.data.screens.get(props.id);
  if (!screenNode)
    throw new Error(`Screen node with id ${props.id} not registered`);

  const screen = ScreenComponent.getRequired(screenNode);
  const [active, setActive] = useState(screen.schema.active);
  useEffect(() => {
    const activeListener = (active: boolean) => setActive(active);
    const observer = screen.schema
      .getCursor()
      .getOrCreateObserver(screen.schema.getSchemaIndex().active);
    observer.subscribe(activeListener);
    return () => {
      observer.unsubscribe(activeListener);
    };
  }, []);

  const Comp = props.screen;

  return (
    <div className={`ui-screen ${!active ? "hidden" : ""}`}>
      <Comp id={props.id} />
    </div>
  );
}
