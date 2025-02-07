import { GenNodes } from "Gen/Classes/GenNodes";
import { StandardCaves } from "../Caves/StandardCaves";
import { ValleysCarver } from "../Caves/ValleysCarver";
import { WormCaves } from "../Caves/WormCaves";

export class Caves {
  static standard: StandardCaves;
  static worm: WormCaves;
  static valley: ValleysCarver;
  static init(nodes: GenNodes) {
    this.standard = new StandardCaves(nodes);
    this.worm = new WormCaves(nodes);
    this.valley = new ValleysCarver(nodes);
  }
  static getCarved(x: number, y: number, z: number) {
    const standard = this.standard.getCarved(x, y, z);
    const worm = this.worm.getCarved(x, y, z);
  //  const valley = this.valley.getCarved(x, y, z);

    return standard || worm ;
    //  return standard || worm || valley;
  }
}
