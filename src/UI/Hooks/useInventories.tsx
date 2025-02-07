// AuthContext.tsx
import { Node, NodeCursor } from "@amodx/ncs/";
import React, { createContext, useContext, ReactNode } from "react";

interface InventoriesContextType {
  inventories: NodeCursor[];
}

const InventoriesContext = createContext<InventoriesContextType | undefined>(
  undefined
);
export const InventoriesProvider: React.FC<{
  children: ReactNode;
  inventories: NodeCursor[];
}> = ({ children, inventories }) => {
  return (
    <InventoriesContext.Provider value={{ inventories }}>
      {children}
    </InventoriesContext.Provider>
  );
};

export const useInventories = (): InventoriesContextType => {
  const context = useContext(InventoriesContext);
  if (context === undefined) {
    throw new Error("useInventories must be used within an InventoriesContext");
  }
  return context;
};
