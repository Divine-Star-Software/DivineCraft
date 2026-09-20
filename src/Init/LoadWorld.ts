import { Distance2D, Distance3D, Vec3Array, Vector3Like } from "@amodx/math";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import {
  CardinalNeighbors2D,
  CardinalNeighbors3D,
} from "@divinevoxel/vlox/Math/CardinalNeighbors";
import { SectorState } from "@divinevoxel/vlox/World/Sector/SectorState";
import { WorldRegister } from "@divinevoxel/vlox/World/WorldRegister";
import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
import { GameManager } from "Game/GameManager";
import { WorldMap } from "Map/WorldMap";
import LoadingScreen from "UI/Loading";

export default async function InitWorld() {
  await DivineVoxelEngineRender.instance.threads.world.waitTillTaskExist(
    "load-world",
  );
  LoadingScreen.progress.text("DVE Fully Initalized");
  await LoadingScreen.progress.updateProgressPercent(100);

  LoadingScreen.progress.value = 0;
  LoadingScreen.progress.text("Load Level");
  const urlObj = new URL(window.location.href);
  const params = new URLSearchParams(urlObj.search);
  if (params.has("world-gen-map")) {
    WorldMap();
  }
  const levelLoader = LoadingScreen.levelLoaderProgress;

  const start: Vec3Array = [0, 0, 0];
  levelLoader.setUp([...start], [600, 600]);
  const radius = 300;
 

  const inte = setInterval(() => {
    const search: Vec3Array[] = [[...start]];

    const added = new Set<string>();
    while (search.length) {
      const [x, y, z] = search.shift()!;

      const sector = WorldRegister.sectors.get(0, x, y, z);
      if (sector) {
        levelLoader.setState(sector.position, levelLoader.STATES.Loaded);
        if (sector.getBitFlag(SectorState.Flags.isWorldGenDone)) {
          levelLoader.setState(
            sector.position,
            levelLoader.STATES.WorldGenComplete,
          );
        }
        if (sector.getBitFlag(SectorState.Flags.isWorldDecorDone)) {
          levelLoader.setState(
            sector.position,
            levelLoader.STATES.WorldDecorationComplete,
          );
        }
        if (sector.getBitFlag(SectorState.Flags.isWorldPropagationDone)) {
          levelLoader.setState(
            sector.position,
            levelLoader.STATES.WorldPropagationComplete,
          );
        }
        if (sector.getBitFlag(SectorState.Flags.isWorldSunDone)) {
          levelLoader.setState(
            sector.position,
            levelLoader.STATES.WorldSunComplete,
          );
        }
      }

      for (const [nx, nz] of CardinalNeighbors2D) {
        const newX = x + WorldSpaces.sector.bounds.x * nx;
        const newZ = z + WorldSpaces.sector.bounds.z * nz;
        const distance = Distance3D(...start, newX, 0, newZ);
        const sector = WorldRegister.sectors.get(0, newX, y, newZ);
        const key = WorldSpaces.hash.hashXYZ(newX, y, newZ);
        if (distance < radius && sector && !added.has(key)) {
          search.push([newX, 0, newZ]);
          added.add(key);
        }
      }
    }

    levelLoader.drawAll();
  }, 50);
  await DivineVoxelEngineRender.instance.threads.world.runTaskAsync(
    "load-world",
    {
      position: Vector3Like.Create(),
    },
  );

  LoadingScreen.progress.text("Done");
  await LoadingScreen.progress.updateProgressPercent(100);

  clearInterval(inte);
}
