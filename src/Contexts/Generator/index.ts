import { StartGenerator } from "@divinevoxel/vlox/Init/StartGenerator";
import { WorldGen } from "Gen/WorldGen";
const gen = new WorldGen();
gen.init();
await StartGenerator();
