// AuthContext.tsx
import { PlayerComponent } from "Game/Components/Player";
import { useGame } from "./useGame";

export const usePlayer = (): (typeof PlayerComponent)["default"]["data"] => {
  const context = useGame();
  return PlayerComponent.getRequired(context.data.activePlayer.node).data;
};
