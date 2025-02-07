import { GenMapTile } from "./GenMapTile";
import { GenMapTilesRegister } from "./GenMapTilesRegister";
import { EntityTool } from "@divinevoxel/vlox-babylon/Tools/EntityTool";
import {
  Scene,
  Mesh,
  VertexBuffer,
  StandardMaterial,
  ShaderMaterial,
} from "@babylonjs/core";
import { LocationData } from "@divinevoxel/vlox/Math";
import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
import { $2dMooreNeighborhood } from "@divinevoxel/vlox/Math/CardinalNeighbors.js";
import { Distance3D, Vec3Array, Vector3Like } from "@amodx/math";
import { GenMapTileMaterial } from "./GenMapTileMaterial";
import { WorldRegister } from "@divinevoxel/vlox/World/WorldRegister";
import { Quad } from "../Quad";
export class GenMap {
  static Constants = {
    MAX_TILES: 2_000,
  };

  tilesRegister = new GenMapTilesRegister(this);

  tilesMaterial: ShaderMaterial;

  _colorBuffer: Float32Array;
  _instanceTool: EntityTool;
  _instanceMesh: Mesh;
  _previousLocation: LocationData;
  _searchQueue: number[] = [];
  _visitedMap: Map<string, boolean> = new Map();
  constructor() {}

  init(scene: Scene) {
    const quadData = Quad.GetQuad();
    this._instanceMesh = new Mesh("world-map-tile-base", scene);
    this._instanceMesh.setVerticesData(
      VertexBuffer.PositionKind,
      quadData.positions
    );
    this._instanceMesh.setVerticesData(
      VertexBuffer.NormalKind,
      quadData.normals
    );
    this._instanceMesh.setVerticesData(VertexBuffer.UVKind, quadData.uvs);
    this._instanceMesh.setVerticesData(VertexBuffer.UVKind, quadData.uvs);
    this._instanceMesh.setIndices(quadData.indicies);
    this._instanceTool = new EntityTool(this._instanceMesh);
    this._instanceMesh.alwaysSelectAsActiveMesh = true;
    this.tilesMaterial = GenMapTileMaterial.create(scene);
    this._instanceMesh.material = this.tilesMaterial;
    this._instanceTool.setInstanceAmount(GenMap.Constants.MAX_TILES);

    const colorBuffer = new Float32Array(GenMap.Constants.MAX_TILES * 4);

    this._instanceTool.mesh.thinInstanceSetBuffer(
      "tileColor",
      colorBuffer,
      4,
      false
    );
    this._colorBuffer = colorBuffer;
  }

  updateTiles(location: LocationData) {
    if (!this._previousLocation) {
      this._previousLocation = [...location];
    }

    const worldColumnPOS = WorldSpaces.sector.getPosition(
      location[1],
      0,
      location[3]
    );

    this._searchQueue.push(
      worldColumnPOS.x,
      worldColumnPOS.y,
      worldColumnPOS.z
    );

    while (this._searchQueue.length) {
      const cx = this._searchQueue.shift()!;
      const cy = this._searchQueue.shift()!;
      const cz = this._searchQueue.shift()!;

      const sectorKey = WorldSpaces.hash.hashXYZ(cx, 0, cz);

      if (this._visitedMap.has(sectorKey)) continue;
      this._visitedMap.set(sectorKey, true);

      const distance = Distance3D(
        worldColumnPOS.x,
        0,
        worldColumnPOS.z,
        cx,
        0,
        cz
      );
      if (distance > 600) continue;

      for (const n of $2dMooreNeighborhood) {
        const nx = cx + n[0] * WorldSpaces.sector.bounds.x;
        const nz = cz + n[1] * WorldSpaces.sector.bounds.z;
        const columnPOS = WorldSpaces.sector.getPosition(nx, cy, nz);
        const key = WorldSpaces.hash.hashXYZ(
          columnPOS.x,
          columnPOS.y,
          columnPOS.z
        );
        if (!this._visitedMap.has(key)) {
          this._searchQueue.push(columnPOS.x, cy, columnPOS.z);
        }
      }

      const sectorLocation: LocationData = [location[0], cx, 0, cz];
      const sector = WorldRegister.sectors.get(
        sectorLocation[0],
        sectorLocation[1],
        sectorLocation[2],
        sectorLocation[3]
      );
      if (!sector) {
        this.tilesRegister.sectors.remove(sectorLocation);
      } else {
        if (!this.tilesRegister.sectors.get(sectorLocation)) {
          this.tilesRegister.sectors.add(sectorLocation, sector);
        }
      }
    }

    this._instanceTool.update();
    this._visitedMap.clear();
    for (let i = 0; i < GenMapTile.Tiles.length; i++) {
      GenMapTile.Tiles[i].update();
    }
    this._instanceTool.mesh.thinInstanceBufferUpdated("tileColor");
  }
  dispose() {
    this._instanceMesh.dispose();
  }
}
