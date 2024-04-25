import { voxelData } from "../../Data/VoxelData";
import "./VoxelSelect.css";
import { VoxelData } from "@divinevoxel/core";
import { useState } from "react";
import { PlayerState } from "../../Player/PlayerState";

function Voxel({ data, active }: { data: VoxelData; active: boolean }) {
  return (
    <div className={`voxel ${active ? "active" : ""}`}>
      <div className="voxel-image-container">
        <img
          className="voxel-image"
          src={`/assets/textures/${data.id}/default.png`}
        />
      </div>
    </div>
  );
}
export function VoxelSelect() {
  const [activeVoxel, setActiveVoxel] = useState(PlayerState.selectedVoxel);
  PlayerState.observers.voxelSelectUpdated.subscribe(VoxelSelect, () =>
    setActiveVoxel(PlayerState.selectedVoxel)
  );
  return (
    <div className="voxel-select">
      <div className="voxel-select-row">
        {voxelData.map((_) => (
          <Voxel active={activeVoxel.id == _.id} data={_} />
        ))}
      </div>
    </div>
  );
}
