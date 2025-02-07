import { Node, NodeCursor } from "@amodx/ncs/";

import "./Inventory.css";
import useItem from "./useItem";
import { useDragNDrop } from "../../Hooks/useDragNDrop";

export const Item: React.FC<{ node: NodeCursor }> = ({ node }) => {
  const { item } = useItem(node);

  const [observers, ref, props] = useDragNDrop({ drag: true, drop: false });

  observers.dragStart.subscribe((transfer) => {
    transfer.setData("text/plain", `${item.node.index}`);
  });

  return (
    <div {...props} className="item">
      <img className="item-image" src={item!.schema.textureSrc} />
    </div>
  );
};
