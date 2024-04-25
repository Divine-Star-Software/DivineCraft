import { DivineVoxelEngineNexus } from "@divinevoxel/foundation/Contexts/Nexus/DivineVoxelEngineNexus";
import { DVEFDataCore } from "@divinevoxel/foundation/Data/DVEFDataCore";
import { InitNexusPlayer } from "Player/NexusPlayer";

const data = new DVEFDataCore();

const DVEN = new DivineVoxelEngineNexus({
  data,
});
await DVEN.init();
InitNexusPlayer(DVEN);
