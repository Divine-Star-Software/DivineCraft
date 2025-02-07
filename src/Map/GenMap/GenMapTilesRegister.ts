import { Vector3Like } from "@amodx/math";
import { LocationData } from "@divinevoxel/vlox/Math";
import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
import { GenMapTile } from "./GenMapTile";
import { GenMap } from "./GenMap";
import { Sector } from "@divinevoxel/vlox/World/Sector";

export type WorldMapTilesRegisterColumn = {
  location: LocationData;
  tile: GenMapTile;
};

export type WorldMapTileRegisterDimensions = {
  sectors: Map<string, GenMapTile>;
};

export class GenMapTilesRegister {
  _dimensions = new Map<string, WorldMapTileRegisterDimensions>();

  constructor(public worldMap: GenMap) {
    this._dimensions.set("main", {
      sectors: new Map(),
    });
  }

  clearAll() {
    for (const [dkey, dim] of this._dimensions) {
      this.dimensions.remove(dkey);
    }
    this._dimensions.set("main", {
      sectors: new Map(),
    });
  }

  dimensions = {
    add: (id: string) => {
      const dimesnion = new Map();
      this._dimensions.set(id, {
        sectors: new Map(),
      });
      return dimesnion;
    },
    get: (id: string) => {
      return this._dimensions.get(id);
    },
    remove: (id: string) => {
      const dimension = this._dimensions.get(id);
      if (!dimension) return false;
      dimension.sectors.forEach((column) => {
        column.dispose();
      });
      this._dimensions.delete(id);
      return true;
    },
  };

  sectors = {
    add: (location: LocationData, column: Sector) => {
      const dimension = this.dimensions.get(location[0])!;
      const columnLocation: LocationData = [
        location[0],
        ...WorldSpaces.sector.getPositionVec3Array(
          location[1],
          location[2],
          location[3]
        ),
      ] as LocationData;

      const tile = new GenMapTile(this.worldMap, column, columnLocation);
      dimension.sectors.set(
        WorldSpaces.hash.hashVec3(
          WorldSpaces.sector.getPosition(location[1], location[2], location[3])
        ),
        tile
      );
      return tile;
    },
    remove: (location: LocationData) => {
      const dimension = this.dimensions.get(location[0])!;

      const sectorKey = WorldSpaces.hash.hashVec3(
        WorldSpaces.sector.getPosition(location[1], location[2], location[3])
      );
      const sector = dimension.sectors.get(sectorKey);
      if (!sector) return false;
      sector.dispose();
      dimension.sectors.delete(sectorKey);
      if (dimension.sectors.size == 0) {
        //  dimension.remove(location);
      }
      return sector;
    },
    get: (location: LocationData) => {
      const dimension = this.dimensions.get(location[0])!;

      if (!dimension) return false;
      return dimension.sectors.get(
        WorldSpaces.hash.hashVec3(
          WorldSpaces.sector.getPosition(location[1], location[2], location[3])
        )
      );
    },
  };
}
