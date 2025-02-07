import { CaveCarver, CaveCarverData } from "Gen/Classes/CaveCarver";
const max = 2 ** 32;
export class WormCaves extends CaveCarver {
  static data: CaveCarverData = {
    id: "worm",
  };
  getCarved(x: number, y: number, z: number): boolean {
    const startWarp = 150;


    const maxLayers = 4;
    for (let layer = 0; layer < maxLayers; layer++) {
      let warpScale = (startWarp * 1) / (layer % 3);

      x += 20_000 * layer;
      z -= 20_000 * layer;

      let noise = this.nodes.noise.detailNoise(
        x / 200,
        250_000 * layer,
        z / 200
      );
      let exist = this.nodes.noise.worldDetailNoise(
        x / 600,
        250_000 * layer,
        z / 600
      );
      if(exist < .5) continue;
   
      let baseHeight =
        ((1 +
          this.nodes.noise.worldDetailNoise(
            (x - max) / warpScale,
            50_000,
            (z - max) / warpScale
          )) /
          2) *
          60 +
        5;
      let detalHeight =
        ((1 +
          this.nodes.noise.worldDetailNoise(
            (x - max) / 150,
            250_000,
            (z - max) / 150
          )) /
          2) *
          10 +
        5;
      let fluffNoise =
        (1 +
          this.nodes.noise.worldDetailNoise(
            (x - max) / 30,
            (y + 200) / 30,
            (z - max) / 30
          )) /
        2;


      let carve = noise > -0.03 - (fluffNoise * .02) && noise < 0.03 + (fluffNoise * .02);

      let inRage =
        y <= baseHeight + (detalHeight + fluffNoise * 20) / 2 &&
        y >= baseHeight - (detalHeight + fluffNoise * 20) / 2;

      if (carve && inRage) return true;
    }
    return false;
  }

  getData() {
    return WormCaves.data;
  }
  getClass() {
    return WormCaves;
  }
}
