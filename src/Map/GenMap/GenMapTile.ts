import { LocationData } from "@divinevoxel/vlox/Math";
import { GenMap } from "./GenMap";
import { EntityInstance } from "@divinevoxel/vlox-babylon/Tools/EntityInstance";
import { SafeInterval } from "@amodx/core/Intervals/SafeInterval";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { WorldRegister } from "@divinevoxel/vlox/World/WorldRegister";
import { Sector } from "@divinevoxel/vlox/World";
export class GenMapTile {
  static Tiles: GenMapTile[] = [];

  _instance: EntityInstance;
  _dispoed = false;

  constructor(
    public worldMap: GenMap,
    public sector: Sector,
    public location: LocationData
  ) {
    const instance = this.worldMap._instanceTool.getInstance();
    if (!instance) {
      console.warn(`Could not load tile instance for ${location}`);
    } else {
      this._instance = instance;
    }
    GenMapTile.Tiles.push(this);
    this._instance.position.set(location[1], location[2], location[3]);
    this._instance.scale.set(1, 1, 1);
    this.update();
  }

  update() {
    if (this._dispoed) return;
    const sector = this.sector;
    if (
      sector.getBitFlag(Sector.FlagIds.isWorldGenDone) &&
      sector.getBitFlag(Sector.FlagIds.isWorldDecorDone) &&
      sector.getBitFlag(Sector.FlagIds.isWorldSunDone) &&
      sector.getBitFlag(Sector.FlagIds.isWorldPropagationDone) &&
      DivineVoxelEngineRender.instance.meshRegister.sectors.get(this.location)
    ) {
      this.setColor(0.0, 1.0, 0.0, 1.0); // Green
      return;
    }
    if (sector.getBitFlag(Sector.FlagIds.isWorldSunDone)) {
      this.setColor(1.0, 1.0, 0.0, 1.0); // Yellow
      return;
    }
    if (sector.getBitFlag(Sector.FlagIds.isWorldPropagationDone)) {
      this.setColor(0.5, 0.0, 0.5, 1.0); // Purple
      return;
    }

    if (sector.getBitFlag(Sector.FlagIds.isWorldDecorDone)) {
      this.setColor(0.0, 0.0, 1.0, 1.0); // Blue
      return;
    }
    if (sector.getBitFlag(Sector.FlagIds.isWorldGenDone)) {
      this.setColor(0.0, 1.0, 1.0, 1.0); // Cyan
      return;
    }

    if (sector.getBitFlag(Sector.FlagIds.isDirty)) {
      this.setColor(0.0, 0.0, 1.0, 1.0); // Blue
      return;
    }
  }

  setColor(r: number, g: number, b: number, a = 1) {
    let index = this._instance.index * 4;
    this.worldMap._colorBuffer[index] = r;
    this.worldMap._colorBuffer[index + 1] = g;
    this.worldMap._colorBuffer[index + 2] = b;
    this.worldMap._colorBuffer[index + 3] = a;
  }
  dispose() {
    this._dispoed = true;
    GenMapTile.Tiles = GenMapTile.Tiles.filter((_) => _ != this);
    this._instance.destroy();
  }
}

new SafeInterval(() => {
  for (let i = 0; i < GenMapTile.Tiles.length; i++) {
    GenMapTile.Tiles[i].update();
  }
}, 10).start();
