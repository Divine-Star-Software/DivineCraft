import type { LocationData } from "@divinevoxel/vlox/Math";
import { BiomeMapTile } from "./BiomeMapTile";
import { BiomeMap } from "./BiomeMap";

export type BiomeMapTilesRegisterColumn = {
  location: LocationData;
  tile: BiomeMapTile;
};

export type BiomeMapTileRegisterDimensions = Map<
  number,
  Map<string, BiomeMapTile>
>;

export class BiomeMapTilesRegister {
  _dimensions: BiomeMapTileRegisterDimensions = new Map();

  constructor(public worldMap: BiomeMap) {
    this._dimensions.set(0, new Map());
  }

  clearAll() {
    for (const [dkey, dim] of this._dimensions) {
      this.dimensions.remove(dkey);
    }
    this._dimensions.set(0, new Map());
  }

  dimensions = {
    add: (id: number) => {
      const dimesnion = new Map();
      this._dimensions.set(id, dimesnion);
      return dimesnion;
    },
    get: (id: number) => {
      return this._dimensions.get(id);
    },
    remove: (id: number) => {
      const dimension = this._dimensions.get(id);
      if (!dimension) return false;
      dimension.forEach((region) => {
        region.dispose();
      });
      this._dimensions.delete(id);
      return true;
    },
  };

  tile = {
    add: (location: LocationData) => {
      let dimension = this.dimensions.get(location[0]);
      if (!dimension) {
        dimension = this.dimensions.add(location[0]);
      }
      const region = new BiomeMapTile(this.worldMap, location);
      dimension.set(`${location[1]}-${location[2]}-${location[3]}`, region);
      return region;
    },
    remove: (location: LocationData) => {
      const region = this.tile.get(location);
      if (!region) return false;
      const dimension = this.dimensions.get(location[0]);
      if (!dimension) return false;
      dimension.delete(`${location[1]}-${location[2]}-${location[3]}`);
      region.dispose();
      return true;
    },
    get: (location: LocationData) => {
      const dimension = this.dimensions.get(location[0]);
      if (!dimension) return false;
      const region = dimension.get(
        `${location[1]}-${location[2]}-${location[3]}`
      );
      if (!region) return false;
      return region;
    },
  };
}
