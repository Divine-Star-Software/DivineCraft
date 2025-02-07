import { LocationData } from "@divinevoxel/vlox/Math";
import { BiomeMap } from "./BiomeMap";

import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { Engine, Mesh, RawTexture, StandardMaterial } from "@babylonjs/core";
import { GetBiomeImageTasks } from "Gen/WorldGen";
export class BiomeMapTile {
  static Tiles: BiomeMapTile[] = [];

  _instance: Mesh;

  material: StandardMaterial;
  constructor(
    public worldMap: BiomeMap,
    public location: LocationData
  ) {
    this._instance = this.worldMap._instanceMesh.clone();
    this.material = new StandardMaterial("", this.worldMap.scene);
    this._instance.material = this.material;
    BiomeMapTile.Tiles.push(this);
    this._instance.position.set(location[1], location[2], location[3]);

    this.update();
  }

  texture: RawTexture;
  async update() {
    const image =
      await DivineVoxelEngineRender.instance.threads.constructors.runTaskAsync<
        GetBiomeImageTasks,
        Uint8ClampedArray
      >("get-biome-image", [
        [this.location[1], 0, this.location[3]],
        [this.location[1] + 1024, 0, this.location[3] + 1024],
      ]);

    if (image instanceof Uint8ClampedArray) {
      this.texture = new RawTexture(
        image,
        1024,
        1024,
        Engine.TEXTUREFORMAT_RGBA,
        this.worldMap.scene
      );
      this.texture.updateSamplingMode(Engine.TEXTURE_NEAREST_NEAREST);
      this.material.diffuseTexture = this.texture;
    }
  }
  dispose() {
    BiomeMapTile.Tiles = BiomeMapTile.Tiles.filter((_) => _ != this);
    this._instance.dispose();
  }
}
