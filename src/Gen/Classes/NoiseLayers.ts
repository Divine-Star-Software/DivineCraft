import alea from "alea";
import {
  createNoise2D,
  createNoise3D,
  NoiseFunction2D,
  NoiseFunction3D,
} from "simplex-noise";

export class NooiseLayers {
  worldGenNoise: NoiseFunction3D;
  detailNoise: NoiseFunction3D;
  orePerlin: NoiseFunction3D;
  worldDetailNoise: NoiseFunction3D;
  worldGenDetailNoise: NoiseFunction3D;
  biomeNoise: NoiseFunction3D;
  biomeDetailNoise: NoiseFunction3D;
  biomeTypeMoistureNoise: NoiseFunction2D;
  biomeTypeTemperatureNoise: NoiseFunction2D;
  biomeTypeElevationNoise: NoiseFunction2D;
  biomeTypeRiverNoise: NoiseFunction2D;
  oreNoise: NoiseFunction3D;
  init(seeds: {
    worldNoise: number;
    detailNoise: number;
    biomeNoise: number;
    biomeTypeMoistureNoise: number;
    biomeTypeTemperatureNoise: number;
    biomeTypeElevationNoise: number;
    biomeDetailNoise: number;
    biomeTypeRiverNoise: number;
    oreNoise: number;
    worldDetailNoise: number;
    worldGenDetailNoise: number;
  }) {
    this.worldGenNoise = createNoise3D(alea(`${seeds.worldNoise}`));
    this.detailNoise = createNoise3D(alea(`${seeds.detailNoise}`));
    this.biomeNoise = createNoise2D(alea(`${seeds.biomeNoise}`));
    this.biomeTypeMoistureNoise = createNoise2D(
      alea(`${seeds.biomeTypeMoistureNoise}`)
    );
    this.biomeTypeTemperatureNoise = createNoise2D(
      alea(`${seeds.biomeTypeTemperatureNoise}`)
    );
    this.biomeTypeElevationNoise = createNoise2D(
      alea(`${seeds.biomeTypeElevationNoise}`)
    );
    this.biomeDetailNoise = createNoise3D(
      alea(`${seeds.biomeDetailNoise}`)
    );
    this.biomeTypeRiverNoise = createNoise2D(alea(seeds.biomeTypeRiverNoise));
    this.oreNoise = createNoise3D(alea(seeds.oreNoise));
    this.worldDetailNoise = createNoise3D(alea(seeds.worldDetailNoise));
    this.worldGenDetailNoise = createNoise3D(alea(seeds.worldGenDetailNoise));

    console.log(
      "noise",
      this.biomeTypeElevationNoise(123, 31290),
      this.biomeTypeElevationNoise(239048230, 42304),
      this.biomeTypeTemperatureNoise(209348, 238490)
    );
  }
}
