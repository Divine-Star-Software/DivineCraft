import { Threads } from "@amodx/threads";
import { StartGenerator } from "@divinevoxel/vlox/Init/StartGenerator";
import { LocationData } from "@divinevoxel/vlox/Math";
import { CachedBiomeRegister } from "Gen/Register/Cached/CachedBiomeRegister";
import { CachedBiomeSectorData } from "Gen/Register/Cached/CachedBiomeSector";
import { WorldGen } from "Gen/WorldGen";
const gen = new WorldGen();
gen.init();
await StartGenerator();

Threads.registerTask<CachedBiomeSectorData>("sync-biome-cache", (data) => {
  CachedBiomeRegister.set(
    data.dimension,
    data.sectorPosition.x,
    data.sectorPosition.y,
    data.sectorPosition.z,
    data,
  );
});

Threads.registerTask<LocationData>("desync-biome-cache", (data) => {
  CachedBiomeRegister.delete(...data);
});
