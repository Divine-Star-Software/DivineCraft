import { NodeCursor } from "@amodx/ncs/";
import React, { createContext, useContext, ReactNode } from "react";
import { GameContext as NCSGameContext } from "Game.context";

interface GameContextType {
  gameRoot: NodeCursor;
}

const GameContext = createContext<GameContextType | undefined>(undefined);
export const GameProvider: React.FC<{
  children: ReactNode;
  gameRoot: NodeCursor;
}> = ({ children, gameRoot }) => {
  return (
    <GameContext.Provider value={{ gameRoot }}>{children}</GameContext.Provider>
  );
};

export const useGame = (): (typeof NCSGameContext)["default"] => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerContext");
  }

  return NCSGameContext.getRequired(context.gameRoot);
};
