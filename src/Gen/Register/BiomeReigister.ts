import { CaveCarverConstructor } from "../Classes/CaveCarver";
import { BiomeConstructor } from "../Classes/Biome";
import { BiomeTypeConstructor } from "../Classes/BiomeType";

export class BiomeRegister {
  static _biomeTypes = new Map<string, BiomeTypeConstructor>();
  static _biomes = new Map<string, BiomeConstructor>();
  static _caveCarver = new Map<string, CaveCarverConstructor>();

  static registerBiomes(...biomes: BiomeConstructor[]) {
    biomes.forEach((_) => this._biomes.set(_.data.id, _));
  }

  static getBiome(id: string) {
    const biome = this._biomes.get(id);
    if (!biome) throw new Error(`The biome with id ${id} does not exist.`);
    return biome;
  }

  static registerBiomeTypes(...biomes: BiomeTypeConstructor[]) {
    biomes.forEach((_) => this._biomeTypes.set(_.data.id, _));
  }

  static getBiomeType(id: string) {
    const biomeType = this._biomeTypes.get(id);
    if (!biomeType)
      throw new Error(`The biome type with id ${id} does not exist.`);
    return biomeType;
  }

  static registerCaveCarver(...biomes: CaveCarverConstructor[]) {
    biomes.forEach((_) => this._caveCarver.set(_.data.id, _));
  }

  static getCaveCarver(id: string) {
    const biomeType = this._caveCarver.get(id);
    if (!biomeType)
      throw new Error(`The cave carver with id ${id} does not exist.`);
    return biomeType;
  }
}
