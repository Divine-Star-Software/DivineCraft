import { Vec3Array } from "@divinevoxel/core/Math";
import { AddVoxelData } from "@divinevoxel/foundation/Data/Types/WorldData.types";

export enum PlayerTasks {
  Place,
  Remove,
}

export type PlaceVoxelTask = [position: Vec3Array, data: Partial<AddVoxelData>];
export type RemoveVoxelTask = [position: Vec3Array];
