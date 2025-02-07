import { VoxelNamedState } from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import { VoxelTextureIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelTextureIndex";
import { useEffect, useMemo, useState } from "react";
import { FuzzySearch } from "@amodx/core/Search/FuzzySearch";
import { ItemSearchManager } from "../ItemSearchManager";
import { Observable } from "@amodx/core/Observers";
import { useDragNDrop } from "UI/Hooks/useDragNDrop";
import { useGame } from "UI/Hooks/useGame";
import { NodeCursor } from "@amodx/ncs";
export default function ItemNode({
  state,
  enabledObserver,
}: {
  state: VoxelNamedState;
  enabledObserver?: Observable<boolean>;
}) {
  const image = useMemo(() => {
    return VoxelTextureIndex.getImage(state.voxelId, state.data.id);
  }, [state]);

  const [enabled, setEnabled] = useState(true);

  const [observers, ref, props] = useDragNDrop({ drag: true, drop: false });

  const { items } = useGame().data;

  observers.dragStart.subscribe(state.data.id, (transfer) => {
    const itemIndex = items.data.getItem(state.data.id);
    const item = NodeCursor.Get();
    item.setNode(items.node.graph, itemIndex);
    console.warn("start drag item", item.index, item.name);
    transfer.setData("text/plain", `${item.index}`);
  });

  useEffect(() => {
    const idNodes: string[] = state.data.id
      .split("_")
      .map((_) => _.trim().toLocaleLowerCase());
    idNodes.shift();
    const nameNodes: string[] = state.data.name
      ? state.data.name.split(" ").map((_) => _.trim().toLocaleLowerCase())
      : [];

    const keyWords: string[] = state.tags.has("pvg_keywords")
      ? state.tags.get("pvg_keywords").split(",")
      : [];

    const temp: string[] = [];
    const searchStrings: string[][] = [idNodes, nameNodes, keyWords];

    const included = () => {
      if (
        ItemSearchManager.search == "" &&
        ItemSearchManager.filters.length == 0
      )
        return true;
      let filtersPass = true;
      if (ItemSearchManager.filters.length != 0) {
        for (const filter of ItemSearchManager.filters) {
          if (
            !state.tags.has(filter[0]) ||
            state.tags.get(filter[0]) !== filter[1]
          ) {
            filtersPass = false;
            break;
          }
        }
        if (filtersPass) {
          return true;
        }
        if (!filtersPass) return false;
      }

      if (ItemSearchManager.search != "") {
        let found = false;
        for (const search of searchStrings) {
          for (const node of search) {
            temp[0] = node;
            found =
              FuzzySearch.fuzzyCloseMatch(
                temp,
                ItemSearchManager.searchNodes,
                0.6
              ) || ItemSearchManager.searchNodes.includes(node);
            if (found) break;
          }
          return found;
        }
      }
      return filtersPass;
    };
    if (enabledObserver) {
      enabledObserver.subscribe((ena) => {
        if (
          ItemSearchManager.search == "" &&
          ItemSearchManager.filters.length == 0
        ) {
          setEnabled(() => ena);
        }
      });
    }
    ItemSearchManager.searchUpdated.subscribe(() =>
      setEnabled(() => included())
    );

    ItemSearchManager.filtersUpdated.subscribe(() =>
      setEnabled(() => included())
    );
  }, []);

  return (
    <>
      <div
        {...props}
        className="item-node"
        style={{
          display: enabled ? "block" : "none",
        }}
        title={state.data.name || state.data.id}
      >
        {image && <img className="item-image" src={image.src} />}
      </div>
    </>
  );
}
