import { NodeCursor } from "@amodx/ncs/";
import { ItemComponent } from "Items/Components/index";
import { useMemo } from "react";

export default function useItem(node: NodeCursor) {
  const item = useMemo(() => {
    return ItemComponent.getRequired(node);
  }, [node.index]);

  return {
    item,
  };
}
