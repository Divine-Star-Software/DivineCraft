import {
  VoxelIndex,
  VoxelNamedStateContainer,
} from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import { VoxelTextureIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelTextureIndex";
import { useEffect, useMemo, useRef, useState } from "react";
import ItemNode from "./ItemNode";
import { ItemSearchManager } from "../ItemSearchManager";
import { Observable } from "@amodx/core/Observers";
export default function ItemGroup({
  state,
}: {
  state: VoxelNamedStateContainer;
}) {
  const image = useMemo(() => {
    return VoxelTextureIndex.getImage(
      state.voxelId,
      state.stateArray[0].data.id
    );
  }, [state]);

  const [exapnded, setExapnded] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const observer = useRef(new Observable<boolean>());

  const name = useMemo(() => {
    const data = VoxelIndex.instance.dataMap.get(state.voxelId);
    if (data?.title) return data.title;
    if (data?.name) return data.name;

    if (state.stateArray[0].data.name) return state.stateArray[0].data.name;
    if (state.stateArray[0].data.id) return state.stateArray[0].data.id;
    return state.voxelId;
  }, []);

  useEffect(() => {
    observer.current.notify(exapnded);
    ItemSearchManager.searchUpdated.subscribe(() => {
      setEnabled(() => {
        return (
          ItemSearchManager.search == "" &&
          ItemSearchManager.filters.length == 0
        );
      });
      observer.current.notify(
        (ItemSearchManager.search != "" &&
          ItemSearchManager.filters.length != 0) ||
          exapnded
      );
    });

    ItemSearchManager.filtersUpdated.subscribe(() => {
      setEnabled(() => {
        return (
          ItemSearchManager.search == "" &&
          ItemSearchManager.filters.length == 0
        );
      });

      observer.current.notify(
        (ItemSearchManager.search != "" &&
          ItemSearchManager.filters.length != 0) ||
          exapnded
      );
    });
  }, []);

  return (
    <>
      <div
        title={name}
        className={`item-group   ${enabled ? "closed" : ""}`}
        onClick={() => {
          setExapnded(!exapnded);
          observer.current.notify(
            (ItemSearchManager.search != "" &&
              ItemSearchManager.filters.length != 0) ||
              !exapnded
          );
        }}
        style={{
          display: enabled ? "block" : "none",
        }}
      >
        {image && <img className="item-image" src={image.src} />}
      </div>

      <>
        {state.stateArray.map((_) => (
          <ItemNode
            state={_}
            key={_.data.id}
            enabledObserver={observer.current}
          />
        ))}
      </>
    </>
  );
}
