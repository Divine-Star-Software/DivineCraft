import { useRef } from "react";
import "./Items.css";
import { VoxelIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import ItemGroup from "./ItemGroup";
import ItemNode from "./ItemNode";
import { ItemSearchManager } from "../ItemSearchManager";
export function Items() {
  const searchRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="items">
      <div className="search">
        <input
          className="input"
          type="text"
          placeholder="Type here to search"
          ref={searchRef}
          onChange={(evt) => {
            ItemSearchManager.updateSearch(evt.target.value);
          }}
        />
        <div className="search-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5 21.75C5.85 21.75 1.25 17.15 1.25 11.5C1.25 5.85 5.85 1.25 11.5 1.25C17.15 1.25 21.75 5.85 21.75 11.5C21.75 17.15 17.15 21.75 11.5 21.75ZM11.5 2.75C6.67 2.75 2.75 6.68 2.75 11.5C2.75 16.32 6.67 20.25 11.5 20.25C16.33 20.25 20.25 16.32 20.25 11.5C20.25 6.68 16.33 2.75 11.5 2.75Z"
              fill="#292D32"
            />
            <path
              d="M21.9999 22.7495C21.8099 22.7495 21.6199 22.6795 21.4699 22.5295L19.4699 20.5295C19.1799 20.2395 19.1799 19.7595 19.4699 19.4695C19.7599 19.1795 20.2399 19.1795 20.5299 19.4695L22.5299 21.4695C22.8199 21.7595 22.8199 22.2395 22.5299 22.5295C22.3799 22.6795 22.1899 22.7495 21.9999 22.7495Z"
              fill="#292D32"
            />
          </svg>
        </div>
      </div>
      <div
        className="nodes"
        onWheel={(event) => {
          event.stopPropagation();
          event.bubbles = false;
        }}
      >
        {VoxelIndex.instance.stateArray.map((state) => {
          if (state.stateArray.length > 1) {
            return <ItemGroup state={state} key={state.voxelId} />;
          }
          return <ItemNode state={state.stateArray[0]} key={state.voxelId} />;
        })}
      </div>
    </div>
  );
}
