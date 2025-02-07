interface LSystemRule {
  symbol: string;
  replacements: string[];
}

interface Position {
  x: number;
  y: number;
  z: number;
}

interface StackElement {
  position: Position;
  direction: Position;
}
export class TreeLSystem {
  currentState: string;
  rules: LSystemRule[];
  angle: number = 25;

  constructor(
    public data: {
      placeVoxel: (x: number, y: number, z: number) => void;
      placeEnd: (x: number, y: number, z: number) => void;
    }
  ) {}

  setRules(axiom: string, rules: LSystemRule[], angle: number = this.angle) {
    this.currentState = axiom;
    this.rules = rules;
    this.angle = angle; // Angle in degrees for turns
  }

  setAngle(angle: number) {
    this.angle = angle;
  }

  generateRandomRules() {
    // Define basic movement and branching patterns
    const branchPatterns = [
      "F[+F]F[-F]FE", // Branch with rotations around Z-axis
      "F[&F]F[^F]FE", // Branch with rotations around X-axis
      "F[&+F]F[^-F]FE", // Branch combining rotations around X and Z axes
      "F[-F][+F]FE", // More complex branching
      "F[&-F][^+F]FE", // Branches in 3D space with complex rotations
    ];

    const growthPatterns = ["FF", "FFF", "F-F"];

    // Randomly decide the complexity of the tree by choosing how many rules to create
    const numRules = 2 + Math.floor(Math.random() * 2); // generates 2 or 3 rule types

    this.rules = [];

    for (let i = 0; i < numRules; i++) {
      const hasBranch = Math.random() < 0.5;

      // Integrate leaf placement by adding 'E' at the end of some branches
      const replacements = hasBranch
        ? branchPatterns.map((pattern) =>
            pattern.replace(
              /F/g,
              growthPatterns[
                Math.floor(Math.random() * growthPatterns.length)
              ] + (Math.random() > 0.9 ? "E" : "")
            )
          )
        : growthPatterns.map(
            (growth) => growth + (Math.random() > 0.9 ? "E" : "")
          );

      this.rules.push({
        symbol: "F",
        replacements,
      });
    }

    // Always include a rule for X to initiate the tree
    this.rules.push({
      symbol: "X",
      replacements: ["F[-F][+F]F[&F]^FE", "F&[X-FX]+FE", "F^F[X]+F-FE"].slice(
        0,
        1 + Math.floor(Math.random() * 2)
      ),
    });

    this.currentState = "X"; // Start with X to trigger complex initial branching
    this.setRules("X", this.rules, this.angle);

    return this;
  }

  public generateState(generations: number): string {
    if (!this.rules.length) {
      throw new Error(
        "Rules not set. Please set rules before generating L-system."
      );
    }

    for (let i = 0; i < generations; i++) {
      let nextState = "";

      for (const char of this.currentState) {
        let replaced = false;

        for (const rule of this.rules) {
          if (char === rule.symbol) {
            const replacement =
              rule.replacements[
                Math.floor(Math.random() * rule.replacements.length)
              ];
            nextState += replacement;
            replaced = true;
            break;
          }
        }

        if (!replaced) {
          nextState += char;
        }
      }

      this.currentState = nextState;
    }
    return this.currentState;
  }

  public interpret(
    commands: string,
    startingPosition: Position = { x: 0, y: 0, z: 0 },
    startingDirection: Position = { x: 0, y: 1, z: 0 }
  ): void {
    let stack: StackElement[] = [];
    let position: Position = startingPosition;
    let direction: Position = startingDirection;

    for (const command of commands) {
      switch (command) {
        case "F":
          position.x += direction.x;
          position.y += direction.y;
          position.z += direction.z;
          this.placeVoxel(position.x, position.y, position.z);
          break;
        case "E":
          this.placeEnd(position.x, position.y, position.z);
        case "+": // Rotate about Z-axis
          direction = this.rotate(direction, this.angle, "z");
          break;
        case "-": // Rotate about Z-axis
          direction = this.rotate(direction, -this.angle, "z");
          break;
        case "&": // Rotate about X-axis
          direction = this.rotate(direction, this.angle, "x");
          break;
        case "^": // Rotate about X-axis
          direction = this.rotate(direction, -this.angle, "x");
          break;
        case "[":
          stack.push({
            position: { ...position },
            direction: { ...direction },
          });
          break;
        case "]":
          const state = stack.pop()!;
          position = state.position;
          direction = state.direction;
          break;
      }
    }
  }

  private rotate(
    direction: Position,
    angleDegrees: number,
    axis: string
  ): Position {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    let newX = direction.x;
    let newY = direction.y;
    let newZ = direction.z;

    switch (axis) {
      case "x":
        newY =
          direction.y * Math.cos(angleRadians) -
          direction.z * Math.sin(angleRadians);
        newZ =
          direction.y * Math.sin(angleRadians) +
          direction.z * Math.cos(angleRadians);
        break;
      case "y":
        newX =
          direction.x * Math.cos(angleRadians) -
          direction.z * Math.sin(angleRadians);
        newZ =
          direction.x * Math.sin(angleRadians) +
          direction.z * Math.cos(angleRadians);
        break;
      case "z":
        newX =
          direction.x * Math.cos(angleRadians) -
          direction.y * Math.sin(angleRadians);
        newY =
          direction.x * Math.sin(angleRadians) +
          direction.y * Math.cos(angleRadians);
        break;
    }

    return { x: newX, y: newY, z: newZ };
  }

  private placeEnd(x: number, y: number, z: number): void {
    this.data.placeEnd(Math.round(x), Math.round(y), Math.round(z));
  }

  private placeVoxel(x: number, y: number, z: number): void {
    this.data.placeVoxel(Math.round(x), Math.round(y), Math.round(z));
  }
}
