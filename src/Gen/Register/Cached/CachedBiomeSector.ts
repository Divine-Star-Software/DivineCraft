import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
import { Flat3DIndex, Vector3Like } from "@amodx/math";

const NOT_FOUND_HEIGHT = 10_000;

export type CachedBiomeSectorData = {
  dimension: number;
  sectorPosition: Vector3Like;
  sectorSize: Vector3Like;
  biomeCache: Uint16Array;
  biomeBlendHeightCache: Uint16Array;
  biomeHeightCache: Uint16Array;
  biomeTypeCache: Uint16Array;
};
export class CachedBiomeSector {
  static NOT_FOUND_HEIGHT = NOT_FOUND_HEIGHT;
  index: Flat3DIndex;

  biomeCache: Uint16Array;
  biomeBlendHeightCache: Uint16Array;
  biomeHeightCache: Uint16Array;
  biomeTypeCache: Uint16Array;

  static CreateData(
    dimension: number,
    sectorPositionX: number,
    sectorPositionY: number,
    sectorPositionZ: number,
  ): CachedBiomeSectorData {
    const sectorSizeX = WorldSpaces.sector.bounds.x;
    const sectorSizeY = WorldSpaces.sector.bounds.y;
    const sectorSizeZ = WorldSpaces.sector.bounds.z;
    const sectorVolume = sectorSizeX * sectorSizeY * sectorSizeZ;
    const biomeHeightCache = new Uint16Array(
      new SharedArrayBuffer(sectorVolume * 2),
    );
    const biomeBlendHeightCache = new Uint16Array(
      new SharedArrayBuffer(sectorVolume * 2),
    );
    biomeHeightCache.fill(NOT_FOUND_HEIGHT);
    biomeBlendHeightCache.fill(NOT_FOUND_HEIGHT);
    return {
      dimension,
      sectorPosition: Vector3Like.Create(
        sectorPositionX,
        sectorPositionY,
        sectorPositionZ,
      ),
      sectorSize: Vector3Like.Create(sectorSizeX, sectorSizeY, sectorSizeZ),
      biomeCache: new Uint16Array(new SharedArrayBuffer(sectorVolume * 2)),
      biomeBlendHeightCache,
      biomeHeightCache,
      biomeTypeCache: new Uint16Array(new SharedArrayBuffer(sectorVolume * 2)),
    };
  }
  constructor(public data: CachedBiomeSectorData) {
    this.biomeCache = data.biomeCache;
    this.biomeBlendHeightCache = data.biomeBlendHeightCache;
    this.biomeHeightCache = data.biomeHeightCache;
    this.biomeTypeCache = data.biomeTypeCache;
    this.index = Flat3DIndex.GetXZYOrder();
    this.index.setBounds(
      data.sectorSize.x,
      data.sectorSize.y,
      data.sectorSize.z,
    );
  }

  getIndex(x: number, y: number, z: number) {
    return this.index.getIndexXYZ(
      x - this.data.sectorPosition.x,
      0,
      z - this.data.sectorPosition.z,
    );
  }

  toJSON(): CachedBiomeSectorData {
    return {
      dimension: this.data.dimension,
      sectorSize: this.data.sectorSize,
      sectorPosition: this.data.sectorPosition,
      biomeCache: this.data.biomeCache,
      biomeHeightCache: this.data.biomeHeightCache,
      biomeBlendHeightCache: this.data.biomeBlendHeightCache,
      biomeTypeCache: this.data.biomeTypeCache,
    };
  }
}
