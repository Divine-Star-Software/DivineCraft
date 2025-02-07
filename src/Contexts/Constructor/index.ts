import { StartContrusctor } from "@divinevoxel/vlox/Init/StartConstructor";
import RegisterCoreTasksConstructor from "@dvegames/vlox/Core/Tasks/Constructor/RegisterTasksConstructor";
import RegisterArchiverTasks from "@dvegames/vlox/Archive/Tasks/Constructor/RegisterTasksConstructor";
import { WorldGen } from "Gen/WorldGen";
const gen = new WorldGen();
gen.init();
await StartContrusctor();
RegisterArchiverTasks();
RegisterCoreTasksConstructor();
