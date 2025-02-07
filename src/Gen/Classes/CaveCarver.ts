import { GenNodes } from "./GenNodes";
export type CaveCarverData = {
  id: string;
};

export interface CaveCarverConstructor {
  data: CaveCarverData;
  new (nodes: GenNodes): CaveCarver;
}

export abstract class CaveCarver {
  constructor(public nodes: GenNodes) {}

  abstract getCarved(x: number, y: number, z: number): boolean;

  abstract getData(): CaveCarverData;
  abstract getClass(): CaveCarverConstructor;
}
