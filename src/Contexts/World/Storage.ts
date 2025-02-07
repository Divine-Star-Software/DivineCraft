import { LocationData } from "@divinevoxel/vlox/Math";
import { WorldStorageInterface } from "@divinevoxel/vlox/World/Types/WorldStorage.interface";
import { IndexDB, DataBase, ObjectStore } from "@amodx/indexdb";
import { ThreadPool } from "@amodx/threads";
import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
import { WorldRegister } from "@divinevoxel/vlox/World/WorldRegister";

const getKey = (location: LocationData) => {
  const pos = WorldSpaces.sector.getPosition(
    location[1],
    location[2],
    location[3]
  );
  return `${location[0]}-${pos.x}-${pos.y}-${pos.z}`;
};
export class WorldStorage implements WorldStorageInterface {
  _dataBase: DataBase;
  _sectors: ObjectStore<any>;
  _threads: ThreadPool;

  async init(databaseName: string, threads: ThreadPool) {
    console.log("init index db");
    await IndexDB.init();
    const dataBase = await IndexDB.createOrGetDataBase({
      databaseName,
      objectStores: [
        {
          name: "sectors",
          schema: [],
        },
      ],
    });
    this._threads = threads;
    this._dataBase = dataBase;
    console.log("done with init index db");
    this._sectors = await this._dataBase.getObjectStore("sectors");
    console.log("got columns", this._sectors);
  }

  async saveSector(location: LocationData): Promise<void> {
    const sector = WorldRegister.sectors.get(
      location[0],
      location[1],
      location[2],
      location[3]
    );
    if (!sector)
      throw new Error(
        `Could not save sector that does not exist at ${location.toString()}`
      );
    const sectorData = await this._threads.runTaskAsync(
      "archive-sector-binary",
      location
    );
    this._sectors.set(getKey(location), sectorData);
    sector.setStored(true);
  }
  async loadSector(location: LocationData): Promise<boolean> {
    const columnKey = getKey(location);
    const columnData = await this._sectors.get(columnKey);
    if (!columnData) return false;
    await this._threads.runTaskAsync("import-sector-binary", [
      location,
      columnData,
    ]);
    return true;
  }
  async unloadSector(location: LocationData): Promise<void> {
    await this.saveSector(location);
    WorldRegister.sectors.remove(
      location[0],
      location[1],
      location[2],
      location[3]
    );
  }
}
