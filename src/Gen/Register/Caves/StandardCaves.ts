import { CaveCarver, CaveCarverData } from "Gen/Classes/CaveCarver";

const max = 2 ** 32;
export class StandardCaves extends CaveCarver {
  static data: CaveCarverData = {
    id: "standard",
  };
  getCarved(x: number, y: number, z: number): boolean {
    const terrainScale = 50;
    const caveScale = 100;

    const terrainNoise = this.nodes.noise.worldGenNoise(
      x / terrainScale,
      y / terrainScale,
      z / terrainScale
    );
    const caveNoise =
      (1 +
        this.nodes.noise.detailNoise(
          (x - max) / caveScale,
          y / caveScale,
          (z - max) / caveScale
        )) /
      2;

    const minCaveThreshold = 0.4;
    const maxCaveThreshold = 0.6;
    const minGradient = 0.2;
    const maxGradient = 0.8;

    const caveThreshold =
      minCaveThreshold + (maxCaveThreshold - minCaveThreshold) * terrainNoise;

    const gradient = minGradient + (maxGradient - minGradient) * terrainNoise;

    const scale = 0.9;
    const modifiedCaveThreshold = caveThreshold - scale * caveNoise;
    const modifiedGradient = gradient + scale * caveNoise;

    const shouldCarveCave =
      caveNoise < modifiedCaveThreshold &&
      y < modifiedGradient * this.nodes.worldHeight;
    return shouldCarveCave;
  }

  getData() {
    return StandardCaves.data;
  }
  getClass() {
    return StandardCaves;
  }
}
