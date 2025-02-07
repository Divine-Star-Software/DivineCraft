import { CaveCarver, CaveCarverData } from "Gen/Classes/CaveCarver";
const max = 2 ** 32;
export class ValleysCarver extends CaveCarver {
  static data: CaveCarverData = {
    id: "valley",
  };
  getCarved(x: number, y: number, z: number): boolean {
    const elevationScale = 100;
    const warpScale = 500;
    const directionStretch = 1.9;
    y += 100000;
    let warpNoiseX = this.nodes.noise.detailNoise(
      (x - max + 100000) / warpScale,
      (y - max + 100000) / warpScale,
      (z - max + 100000) / warpScale
    );
    let warpNoiseY = this.nodes.noise.detailNoise(
      (x - max + 100000) / warpScale,
      (y - max - 100000) / warpScale,
      (z - max + 100000) / warpScale
    );
    let warpNoiseZ = this.nodes.noise.detailNoise(
      ((x - max - 100000) / warpScale) * directionStretch,
      (y - max + 100000) / warpScale,
      (z - max - 100000) / warpScale
    );

    let distortedX = x + warpNoiseX * 200;
    let distortedY = y + warpNoiseY * 200;
    let distortedZ = z + warpNoiseZ * 200 * directionStretch;

    let finalNoise = this.nodes.noise.detailNoise(
      (distortedX - max) / elevationScale,
      (distortedY - max) / elevationScale,
      (distortedZ - max) / elevationScale
    );
    const othernoise = this.nodes.noise.worldGenDetailNoise(
      (x + 1000) / warpScale,
      (y + 1000) / warpScale,
      (z + 1000) / warpScale
    );
    finalNoise = 1.0 - Math.abs(finalNoise - 0.5);
    finalNoise = Math.pow(finalNoise, 16);

    return finalNoise > 0.8 && othernoise > 0.6;
  }

  getData() {
    return ValleysCarver.data;
  }
  getClass() {
    return ValleysCarver;
  }
}
