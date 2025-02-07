import { TreeLSystem } from "../../Classes/Gen/TreeLSystem";
import { GenNodes } from "../../Classes/GenNodes";
import { GenerateCircle } from "./Circle";
import { Voxels } from "./Voxels";
import { GenerateSphere } from "./Sphere";

export class Trees {



  static oakLSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      Trees.nodes.brush.setXYZ(x, y, z).setName(Voxels.OakLog).paint();
    },
    placeEnd(x, y, z) {
      GenerateSphere(
        Trees.nodes.brush,
        Voxels.OakLeaves,
        x,
        y,
        z,
        Math.max(5 * Math.random(), 4),
        0.01
      );
    },
  });
  static birchSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      Trees.nodes.brush.setXYZ(x, y, z).setName(Voxels.BirchLog).paint();
    },
    placeEnd(x, y, z) {
      GenerateSphere(
        Trees.nodes.brush,
        Voxels.BirchLeaves,
        x,
        y,
        z,
        Math.max(5 * Math.random(), 4),
        0.01
      );
    },
  });
  static acaciSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      Trees.nodes.brush.setXYZ(x, y, z).setName(Voxels.AcaciaLog).paint();
    },
    placeEnd(x, y, z) {
      GenerateSphere(
        Trees.nodes.brush,
        Voxels.AcaciaLeaves,
        x,
        y,
        z,
        Math.max(5 * Math.random(), 4),
        0.01
      );
    },
  });
  static darkOakSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      Trees.nodes.brush.setXYZ(x, y, z).setName(Voxels.DarkOakLog).paint();
    },
    placeEnd(x, y, z) {
      GenerateSphere(
        Trees.nodes.brush,
        Voxels.DarkOakLeaves,
        x,
        y,
        z,
        Math.max(5 * Math.random(), 4),
        0.01
      );
    },
  });
  static nodes: GenNodes;
  static init(nodes: GenNodes) {
    this.nodes = nodes;
  }

  static generateOakTree(x: number, y: number, z: number) {
    this.oakLSystem.generateRandomRules();
    const treeState = this.oakLSystem.generateState(2);
    this.oakLSystem.interpret(treeState, { x, y: y - 1, z });
  }

  static generateDarkOakTree(x: number, y: number, z: number) {
    this.darkOakSystem.generateRandomRules();
    const treeState = this.darkOakSystem.generateState(2);
    this.darkOakSystem.interpret(treeState, { x, y: y - 1, z });
  }

  static generateAcaciaTree(x: number, y: number, z: number) {
    this.acaciSystem.generateRandomRules();
    const treeState = this.acaciSystem.generateState(2);
    this.acaciSystem.interpret(treeState, { x, y: y - 1, z });
  }
  static generateBirchTree(x: number, y: number, z: number) {
    this.birchSystem.generateRandomRules();
    const treeState = this.birchSystem.generateState(2);
    this.birchSystem.interpret(treeState, { x, y: y - 1, z });
  }
  static generateSpruceTree(x: number, y: number, z: number) {
    const { brush } = this.nodes;
    brush.setName(Voxels.SpruceLog).setXYZ(x, y, z).paint();
    let height = Math.floor(Math.random() * 30 + 10);

    brush
      .setName(Voxels.SpruceLeaves)
      .setXYZ(x, height + y + 1, z)
      .paint();
    brush.setXYZ(x + 1, height + y + 1, z).paint();
    brush.setXYZ(x, height + y + 1, z + 1).paint();
    brush.setXYZ(x + 1, height + y + 1, z + 1).paint();

    let radius = 4;
    let h = height;
    let maxH = h / 4;
    while (h > maxH && radius < 10) {
      GenerateCircle(brush, Voxels.SpruceLeaves, x, y + h, z, radius);
      h -= 3;
      radius++;
    }

    for (let dy = y; dy <= y + height; dy++) {
      brush.setName(Voxels.SpruceLog).setXYZ(x, dy, z).paint();
      brush.setXYZ(x + 1, dy, z).paint();
      brush.setXYZ(x, dy, z + 1).paint();
      brush.setXYZ(x + 1, dy, z + 1).paint();
    }
  }
}
