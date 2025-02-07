import { WorldGenBrush } from "@divinevoxel/vlox/Tasks/WorldGeneration/WorldGenBrush";
import { NooiseLayers } from "./NoiseLayers";

export class GenNodes {
  chunkDepth = 16;
  chunkWidth = 16;
  minHeight = 60;
  worldHeight = 256;
  noiseHeight = 120;
  waterHeight = 60;
  noise: NooiseLayers;
  brush: WorldGenBrush;

  init(data: { noise: NooiseLayers; brush: WorldGenBrush }) {
    this.noise = data.noise;
    this.brush = data.brush;
  }
}
