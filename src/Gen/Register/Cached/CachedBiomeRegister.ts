import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
import { CachedBiomeSector, CachedBiomeSectorData } from "./CachedBiomeSector";
import { Vector3Like } from "@amodx/math";

const temp = Vector3Like.Create();
export class CachedBiomeRegister {
  static _secotrs = [new Map<string, CachedBiomeSector>()];

  static get(dimension: number, x: number, y: number, z: number) {
    const key = WorldSpaces.hash.hashVec3(
      WorldSpaces.sector.getPosition(x, y, z, temp),
    );
    const sector = this._secotrs[dimension].get(key);
    if (!sector) return null;
    return sector;
  }

  static delete(dimension: number, x: number, y: number, z: number) {
    const key = WorldSpaces.hash.hashVec3(
      WorldSpaces.sector.getPosition(x, y, z, temp),
    );
    const sector = this._secotrs[dimension].has(key);
    if (!sector) return null;
    this._secotrs[dimension].delete(key);
    return sector;
  }

  static set(
    dimension: number,
    x: number,
    y: number,
    z: number,
    sector: CachedBiomeSectorData,
  ) {
    const key = WorldSpaces.hash.hashVec3(
      WorldSpaces.sector.getPosition(x, y, z, temp),
    );

    const newSector = new CachedBiomeSector(sector);
    this._secotrs[dimension].set(key, newSector);
    return newSector;
  }

  static new(dimension: number, x: number, y: number, z: number) {
    const key = WorldSpaces.hash.hashVec3(
      WorldSpaces.sector.getPosition(x, y, z, temp),
    );

    const newSector = new CachedBiomeSector(
      CachedBiomeSector.CreateData(dimension, temp.x, temp.y, temp.z),
    );
    this._secotrs[dimension].set(key, newSector);
    return newSector;
  }
}
