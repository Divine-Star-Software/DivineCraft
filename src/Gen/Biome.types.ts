import { Vec2Array } from "@amodx/math";

export type Range = [start: number, end: number];
export type BiomeRange = {
  moisture: Range;
  temperature: Range;
  elevation: Range;
  river: Range;
  mod: Range;
  hardLimitMoisture: boolean;
  hardLimitTemperature: boolean;
  hardLimitElevation: boolean;
  hardLimitMod: boolean;
  hardLimitRiver: boolean;
  excludeRiver: boolean;
};
export const getBiomeRange = (
  temperature: Range = [-1, 1],
  moisture: Range = [-1, 1],
  elevation: Range = [-1, 1],
  river: Range = [-10, -10],  // Placeholder range if no river values are intended
  mod: Range = [-1, 1],
  hardLimitMoisture: boolean = false,
  hardLimitTemperature: boolean = false,
  hardLimitElevation: boolean = false,
  hardLimitRiver: boolean = true,
  hardLimitMod: boolean = false,
  excludeRiver: boolean = false
): BiomeRange => {
  return {
    temperature,
    moisture,
    elevation,
    river,
    mod,
    hardLimitMoisture,
    hardLimitTemperature,
    hardLimitElevation,
    hardLimitRiver,
    hardLimitMod,
    excludeRiver,
  };
};


const isTempatureInRange = (values: BiomeValue, range: BiomeRange) => {
  if (range.temperature[0] <= values[0] && range.temperature[0] >= values[1]) {
    return true;
  }
  return false;
};
const isMostiureInRange = (values: BiomeValue, range: BiomeRange) => {
  if (range.moisture[0] <= values[1] && range.moisture[1] >= values[1]) {
    return true;
  }
  return false;
};

const isElavationInRange = (values: BiomeValue, range: BiomeRange) => {
  if (range.elevation[0] <= values[2] && range.elevation[1] >= values[2]) {
    return true;
  }
  return false;
};

const isRiverInRange = (values: BiomeValue, range: BiomeRange) => {
  if (range.river[0] <= values[3] && range.river[1] >= values[3]) {
    return true;
  }
  return false;
};
const isModInRange = (values: BiomeValue, range: BiomeRange) => {
  if (range.mod[0] <= values[4]! && range.mod[1] >= values[4]!) {
    return true;
  }
  return false;
};
export const getBiomeScore = (
  values: BiomeValue,
  range: BiomeRange
): number => {
  let score = 0;
  let scoreIsZero = false;
  // Temperature score
  let totalAdded = 0;
  if (
    !range.hardLimitTemperature ||
    (range.hardLimitTemperature && isTempatureInRange(values, range))
  ) {
    const tempRangeMid = (range.temperature[1] + range.temperature[0]) / 2;
    score +=
      1 -
      Math.abs(
        (values[0] - tempRangeMid) / (range.temperature[1] - range.temperature[0])
      );
    totalAdded++;
  } else if (range.hardLimitTemperature && !isTempatureInRange(values, range)) {
    scoreIsZero = true;
  }
  if (
    !range.hardLimitMoisture ||
    (range.hardLimitMoisture && isMostiureInRange(values, range))
  ) {
    // Moisture score
    const moistRangeMid = (range.moisture[1] + range.moisture[0]) / 2;
    score +=
      1 -
      Math.abs(
        (values[1] - moistRangeMid) / (range.moisture[1] - range.moisture[0])
      );
    totalAdded++;
  } else if (range.hardLimitMoisture && !isMostiureInRange(values, range)) {
    scoreIsZero = true;
  }
  if (
    !range.hardLimitElevation ||
    (range.hardLimitElevation && isElavationInRange(values, range))
  ) {
    // Elevation score
    const elevRangeMid = (range.elevation[1] + range.elevation[0]) / 2;
    score +=
      1 -
      Math.abs(
        (values[2] - elevRangeMid) / (range.elevation[1] - range.elevation[0])
      );
    totalAdded++;
  } else if (range.hardLimitElevation && isElavationInRange(values, range)) {
    scoreIsZero = true;
  }

  if (range.river[1] > 0) {
    if (
      !range.hardLimitRiver ||
      (range.hardLimitRiver && isRiverInRange(values, range))
    ) {
      // Elevation score
      const riverRangeMid = (range.river[1] + range.river[0]) / 2;
      score +=
        1 -
        Math.abs(
          (values[3] - riverRangeMid) / (range.river[1] - range.river[0])
        );
      totalAdded++;
    } else if (range.hardLimitRiver) {
      scoreIsZero = true;
    }
  }

  if (range.mod[1] > 0 && values[4] !== undefined) {
    if (
      !range.hardLimitMod ||
      (range.hardLimitMod && isModInRange(values, range))
    ) {
      // Elevation score
      const modRangeMid = (range.mod[1] + range.mod[0]) / 2;
      score +=
        1 - Math.abs((values[4] - modRangeMid) / (range.mod[1] - range.mod[0]));
      totalAdded++;
    } else if (range.hardLimitMod) {
      scoreIsZero = true;
    }
  }
  if (scoreIsZero) return 0;
  return score / (!totalAdded ? 1 : totalAdded); // Average the scores to normalize between 0 and 1
};
export type BiomeValue = [
  tempature: number,
  mostiure: number,
  elavation: number,
  river: number,
  mod?: number
];
export type BiomeEdgeFactor = [
  tempature: number|Vec2Array,
  mostiure: number|Vec2Array,
  elavation:number|Vec2Array,
  river:number|Vec2Array,
  mod?: number|Vec2Array,
];