import { TreeLSystem } from "../../Classes/Gen/TreeLSystem";
import { GenNodes } from "../../Classes/GenNodes";
import { GenerateCircle } from "./Circle";
import { Voxels } from "./Voxels";
import { GenerateSphere } from "./Sphere";

export class Coral {
  static brainCoralSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      if (y > Coral.nodes.waterHeight - 1) return;
      Coral.nodes.brush.setXYZ(x, y, z).setName(Voxels.BrainCoralBlock).paint();
    },
    placeEnd(x, y, z) {},
  });
  static fireCoralSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      if (y > Coral.nodes.waterHeight - 1) return;

      Coral.nodes.brush.setXYZ(x, y, z).setName(Voxels.FireCoralBlock).paint();
    },
    placeEnd(x, y, z) {},
  });
  static bubbleCoralSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      if (y > Coral.nodes.waterHeight - 1) return;

      Coral.nodes.brush
        .setXYZ(x, y, z)
        .setName(Voxels.BubbleCoralBlock)
        .paint();
    },
    placeEnd(x, y, z) {},
  });
  static hornCoralSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      if (y > Coral.nodes.waterHeight - 1) return;

      Coral.nodes.brush.setXYZ(x, y, z).setName(Voxels.HornCoralBlock).paint();
    },
    placeEnd(x, y, z) {},
  });
  static tubeCoralSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      if (y > Coral.nodes.waterHeight - 1) return;

      Coral.nodes.brush.setXYZ(x, y, z).setName(Voxels.TubeCoralBlock).paint();
    },
    placeEnd(x, y, z) {},
  });

  static nodes: GenNodes;
  static init(nodes: GenNodes) {
    this.nodes = nodes;
  }

  static generateBrainCoral(x: number, y: number, z: number) {
    this.brainCoralSystem.generateRandomRules();
    const treeState = this.brainCoralSystem.generateState(2);
    this.brainCoralSystem.interpret(treeState, { x, y: y - 1, z });
  }

  static generateFireCoral(x: number, y: number, z: number) {
    this.fireCoralSystem.generateRandomRules();
    const treeState = this.fireCoralSystem.generateState(2);
    this.fireCoralSystem.interpret(treeState, { x, y: y - 1, z });
  }

  static generateBubbleCoral(x: number, y: number, z: number) {
    this.bubbleCoralSystem.generateRandomRules();
    const treeState = this.bubbleCoralSystem.generateState(2);
    this.bubbleCoralSystem.interpret(treeState, { x, y: y - 1, z });
  }

  static generateHornCoral(x: number, y: number, z: number) {
    this.hornCoralSystem.generateRandomRules();
    const treeState = this.hornCoralSystem.generateState(2);
    this.hornCoralSystem.interpret(treeState, { x, y: y - 1, z });
  }

  static generateTubeCoral(x: number, y: number, z: number) {
    this.tubeCoralSystem.generateRandomRules();
    const treeState = this.tubeCoralSystem.generateState(2);
    this.tubeCoralSystem.interpret(treeState, { x, y: y - 1, z });
  }

  // Define systems for dead coral blocks
  static deadBrainCoralSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      Coral.nodes.brush
        .setXYZ(x, y, z)
        .setName(Voxels.DeadBrainCoralBlock)
        .paint();
    },
    placeEnd(x, y, z) {},
  });

  static deadBubbleCoralSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      Coral.nodes.brush
        .setXYZ(x, y, z)
        .setName(Voxels.DeadBubbleCoralBlock)
        .paint();
    },
    placeEnd(x, y, z) {},
  });

  static deadFireCoralSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      Coral.nodes.brush
        .setXYZ(x, y, z)
        .setName(Voxels.DeadFireCoralBlock)
        .paint();
    },
    placeEnd(x, y, z) {},
  });

  static deadHornCoralSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      Coral.nodes.brush
        .setXYZ(x, y, z)
        .setName(Voxels.DeadHornCoralBlock)
        .paint();
    },
    placeEnd(x, y, z) {},
  });

  static deadTubeCoralSystem = new TreeLSystem({
    placeVoxel(x, y, z) {
      Coral.nodes.brush
        .setXYZ(x, y, z)
        .setName(Voxels.DeadTubeCoralBlock)
        .paint();
    },
    placeEnd(x, y, z) {},
  });

  // Define generation methods for dead coral blocks
  static generateDeadBrainCoral(x: number, y: number, z: number) {
    this.deadBrainCoralSystem.generateRandomRules();
    const treeState = this.deadBrainCoralSystem.generateState(2);
    this.deadBrainCoralSystem.interpret(treeState, { x, y: y - 1, z });
  }

  static generateDeadBubbleCoral(x: number, y: number, z: number) {
    this.deadBubbleCoralSystem.generateRandomRules();
    const treeState = this.deadBubbleCoralSystem.generateState(2);
    this.deadBubbleCoralSystem.interpret(treeState, { x, y: y - 1, z });
  }

  static generateDeadFireCoral(x: number, y: number, z: number) {
    this.deadFireCoralSystem.generateRandomRules();
    const treeState = this.deadFireCoralSystem.generateState(2);
    this.deadFireCoralSystem.interpret(treeState, { x, y: y - 1, z });
  }

  static generateDeadHornCoral(x: number, y: number, z: number) {
    this.deadHornCoralSystem.generateRandomRules();
    const treeState = this.deadHornCoralSystem.generateState(2);
    this.deadHornCoralSystem.interpret(treeState, { x, y: y - 1, z });
  }

  static generateDeadTubeCoral(x: number, y: number, z: number) {
    this.deadTubeCoralSystem.generateRandomRules();
    const treeState = this.deadTubeCoralSystem.generateState(2);
    this.deadTubeCoralSystem.interpret(treeState, { x, y: y - 1, z });
  }

  // Utility method to choose a random generator from an array and execute it
  static runRandomGenerator(
    generators: ((x: number, y: number, z: number) => void)[]
  ) {
    const randomIndex = Math.floor(Math.random() * generators.length);
    return generators[randomIndex];
  }
  static liveGens = [
    this.generateBrainCoral,
    this.generateBubbleCoral,
    this.generateFireCoral,
    this.generateHornCoral,
    this.generateTubeCoral,
  ];
  // Function to generate a random living coral
  static generateRandomCoral(x: number, y: number, z: number) {
    const selectedGenerator = this.runRandomGenerator(this.liveGens);
    selectedGenerator.call(this, x, y, z);
  }
  static deadGens = [
    this.generateDeadBrainCoral,
    this.generateDeadBubbleCoral,
    this.generateDeadFireCoral,
    this.generateDeadHornCoral,
    this.generateDeadTubeCoral,
  ];
  // Function to generate a random dead coral
  static generateRandomDeadCoral(x: number, y: number, z: number) {
    const selectedGenerator = this.runRandomGenerator(this.deadGens);
    selectedGenerator.call(this, x, y, z);
  }
}
