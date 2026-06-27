import { GameContext } from "Game/Game.context";
import { GameManager } from "Game/GameManager";

export function useGame() {
  return GameContext.getRequired(GameManager.currentGameNode);
}
