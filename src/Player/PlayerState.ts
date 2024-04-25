import { Observable } from "@divinestar/utils/Observers/Observable";
import { AddVoxelData } from "@divinevoxel/foundation/Data/Types/WorldData.types";
import { voxelData } from "Data/VoxelData";

export class PlayerState {
  static selectedVoxel: Partial<AddVoxelData> = {
    id: "dc_cobble_stone",
  };

  static voxelIndex = 0;

  static observers = {
    voxelSelectUpdated: new Observable<void>(),
  };

  static getNextVoxel(mode: "left" | "right") {
    if (mode == "left") {
      if (this.voxelIndex == 0) {
        this.voxelIndex = voxelData.length - 1;
      } else {
        this.voxelIndex--;
      }
    }
    if (mode == "right") {
      if (this.voxelIndex == voxelData.length - 1) {
        this.voxelIndex = 0;
      } else {
        this.voxelIndex++;
      }
    }
    this.selectedVoxel = voxelData[this.voxelIndex];
    this.observers.voxelSelectUpdated.notify()
  }
}
