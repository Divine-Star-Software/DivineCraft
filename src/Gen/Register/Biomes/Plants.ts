import { GenNodes } from "../../Classes/GenNodes";
import { Voxels } from "./Voxels";
import {
  RandomWeights,
  WeightedRandom,
} from "@amodx/rng/weightedRandom/WeightedRandom";

const randomFlower: RandomWeights<Voxels> = [
  [Voxels.TulipFlower, 10],
  [Voxels.PaeoniaFlower, 10],
  [Voxels.SyringaFlower, 10],
  [Voxels.DandelionFlower, 10],
  [Voxels.BlueOrchidFlower, 10],
  [Voxels.OxeyeDaisyFlower, 10],
  [Voxels.WaterlilyFlower, 10],
];

const randomPlant: RandomWeights<Voxels> = [
  [Voxels.Fern, 10],
  [Voxels.Grass, 10],
  [Voxels.TallGrass, 10],
  [Voxels.TallFern, 10],
];
const randomDeadCoral: RandomWeights<Voxels> = [
  [Voxels.DeadFireCoral, 10],
  [Voxels.DeadHornCoral, 10],
  [Voxels.DeadTubeCoral, 10],
  [Voxels.DeadBrainCoral, 10],
  [Voxels.DeadBubbleCoral, 10],
];
const randomCoral: RandomWeights<Voxels> = [
  [Voxels.FireCoral, 10],
  [Voxels.HornCoral, 10],
  [Voxels.TubeCoral, 10],
  [Voxels.BrainCoral, 10],
  [Voxels.BubbleCoral, 10],
];

const waterPlant: RandomWeights<Voxels> = [[Voxels.SeaGrass, 10]];
export class Plants {
  static generateCactus(nodes: GenNodes, x: number, y: number, z: number) {
    const { brush } = nodes;
    let height = Math.floor(Math.random() * 5 + 2);
    for (let dy = y; dy <= y + height; dy++) {
      brush.setName(Voxels.Cactus).setXYZ(x, dy, z).paint();
    }
  }
  static generateReed(nodes: GenNodes, x: number, y: number, z: number) {
    const { brush } = nodes;
    let height = Math.floor(Math.random() * 5 + 2);
    for (let dy = y; dy <= y + height; dy++) {
      brush.setName(Voxels.Reeds).setXYZ(x, dy, z).paint();
    }
  }
  static generateKelp(nodes: GenNodes, x: number, y: number, z: number) {
    const { brush } = nodes;
    let height = Math.floor(Math.random() * 15 + 5);
    let heightDown = Math.floor(Math.random() * 5);

    for (
      let dy = y;
      dy <= y + height && dy < nodes.waterHeight - heightDown;
      dy++
    ) {
      brush
        .setName(Voxels.Water)
        .setLevel(7)
        .setSecondaryName(Voxels.Kelp)
        .setXYZ(x, dy, z)
        .paint();
    }
    brush.setLevel(0);
    brush.setSecondaryName("");
  }
  static generateWaterPlant(nodes: GenNodes, x: number, y: number, z: number) {
    const { brush } = nodes;
    const voxel = WeightedRandom.getValue(waterPlant);
    brush
      .setName(Voxels.Water)
      .setLevel(7)
      .setSecondaryName(voxel)
      .setXYZ(x, y, z)
      .paint();
    brush.setLevel(0);

    brush.setSecondaryName("");
  }
  static generateRandomFlower(
    nodes: GenNodes,
    x: number,
    y: number,
    z: number
  ) {
    const { brush } = nodes;
    const voxel = WeightedRandom.getValue(randomFlower);
    brush.setName(voxel).setXYZ(x, y, z).paint();
  }

  static generateRandomPlant(nodes: GenNodes, x: number, y: number, z: number) {
    const { brush } = nodes;
    const voxel = WeightedRandom.getValue(randomPlant);
    brush.setName(voxel).setXYZ(x, y, z).paint();
  }

  static generateRandomDeadCoral(
    nodes: GenNodes,
    x: number,
    y: number,
    z: number
  ) {
    const { brush } = nodes;
    const voxel = WeightedRandom.getValue(randomDeadCoral);
    brush.setName(voxel).setXYZ(x, y, z).paint();
  }
  static generateRandomCoral(nodes: GenNodes, x: number, y: number, z: number) {
    const { brush } = nodes;
    const voxel = WeightedRandom.getValue(randomCoral);
    brush
      .setName(Voxels.Water)
      .setLevel(7)
      .setSecondaryName(voxel)
      .setXYZ(x, y, z)
      .paint();
    brush.setLevel(0);
    brush.setSecondaryName("");
  }
}
