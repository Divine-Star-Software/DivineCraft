import { BiomeMapTilesRegister } from "./BiomeMapTilesRegister";
import { Scene, Mesh, VertexBuffer, ShaderMaterial } from "@babylonjs/core";
import { LocationData } from "@divinevoxel/vlox/Math";
import { MooreNeighborhood2D } from "@divinevoxel/vlox/Math/CardinalNeighbors.js";
import { Distance3D, Vec3Array } from "@amodx/math";
import { Quad } from "../Quad";
const alignToPowerOf2 = (value: number, powerOf2: number) => {
  const mask = (1 << powerOf2) - 1;
  return value & ~mask;
};
const simpleCubeHash = (x: number, y: number, z: number): Vec3Array => {
  return [
    alignToPowerOf2(x, 10),
    alignToPowerOf2(y, 10),
    alignToPowerOf2(z, 10),
  ];
};

export class BiomeMap {
  static Constants = {
    MAX_TILES: 200,
    TILE_SIZE: 1024,
  };

  tilesRegister = new BiomeMapTilesRegister(this);

  tilesMaterial: ShaderMaterial;

  _colorBuffer: Float32Array;

  _instanceMesh: Mesh;
  _previousLocation: LocationData;
  _searchQueue: Vec3Array[] = [];
  _visitedMap: Map<string, boolean> = new Map();
  scene: Scene;
  constructor() {}

  init(scene: Scene) {
    this.scene = scene;
    const quadData = Quad.GetQuad([
      BiomeMap.Constants.TILE_SIZE,
      BiomeMap.Constants.TILE_SIZE,
    ]);
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
    this._instanceMesh.alwaysSelectAsActiveMesh = true;

    this._instanceMesh.material = this.tilesMaterial;
  }

  updateTiles(location: LocationData) {
    if (!this._previousLocation) {
      this._previousLocation = [...location];
    }

    const tilePositon: Vec3Array = [
      ...simpleCubeHash(location[1], 0, location[3]),
    ];

    this._searchQueue.push([...tilePositon]);

    while (this._searchQueue.length) {
      const node = this._searchQueue.shift();

      if (!node) break;
      const tx = node[0];
      const ty = 0;
      const tz = node[2];
      const tileKey = `${tx}-0-${tz}`;

      if (this._visitedMap.has(tileKey)) continue;
      this._visitedMap.set(tileKey, true);

      const distance = Distance3D(tilePositon[0], 0, tilePositon[1], tx, 0, tz);
      if (distance > BiomeMap.Constants.TILE_SIZE * 2) continue;

      for (const n of MooreNeighborhood2D) {
        const nx = tx + n[0] * BiomeMap.Constants.TILE_SIZE;
        const nz = tz + n[1] * BiomeMap.Constants.TILE_SIZE;
        const tilePOS = simpleCubeHash(nx, 0, nz),
          key = `${tilePOS[0]}-0-${tilePOS[2]}`;
        if (!this._visitedMap.has(key)) {
          this._searchQueue.push([tilePOS[0], 0, tilePOS[2]]);
        }
      }

      const tileLocaton: LocationData = [location[0], tx, 0, tz];

      let tile = this.tilesRegister.tile.get(tileLocaton);

      if (!tile) {
        tile = this.tilesRegister.tile.add(tileLocaton);
      }
    }

    this._visitedMap.clear();
  }

  dispose() {
    this._instanceMesh.dispose();
  }
}
