import { DivineVoxelEngineNexus } from "@divinevoxel/foundation/Contexts/Nexus/DivineVoxelEngineNexus";
import { PlayerManager } from "./Core/Data/PlayerManager";
import { PlayerPhysicsData } from "./Core/Data/PlayerPhysicsData";
import { PlayerStatsData } from "./Core/Data/PlayerStatsData";
import { RegisterPlayerData } from "./Core/Data/RegisterPlayerData";
import { NexusPlayer } from "./Core/Nexus/NexusPlayer";

export async function InitNexusPlayer(DVEN: DivineVoxelEngineNexus) {
  const { playerPhysicsTagManager, playerStatesTagManger } =
    RegisterPlayerData();
  const physicsRemoteData = playerPhysicsTagManager.initData;
  const playePhysicsrDataSAB = new SharedArrayBuffer(
    physicsRemoteData.bufferSize
  );
  playerPhysicsTagManager.setBuffer(playePhysicsrDataSAB);
  PlayerManager.physics = new PlayerPhysicsData(
    playePhysicsrDataSAB,
    physicsRemoteData
  );

  const statsRemoteData = playerStatesTagManger.initData;
  const playeStatsDataSAB = new SharedArrayBuffer(physicsRemoteData.bufferSize);
  playerPhysicsTagManager.setBuffer(playePhysicsrDataSAB);
  PlayerManager.stats = new PlayerStatsData(playeStatsDataSAB, statsRemoteData);

  await DVEN.threads.parent.waitTillTasksExist("connect-player-tags");
  DVEN.threads.parent.runTasks("connect-player-tags", [
    playePhysicsrDataSAB,
    physicsRemoteData,
    playeStatsDataSAB,
    statsRemoteData,
  ]);
  await DVEN.threads.world.waitTillTasksExist("connect-player-tags");
  DVEN.threads.world.runTasks("connect-player-tags", [
    playePhysicsrDataSAB,
    physicsRemoteData,
    playeStatsDataSAB,
    statsRemoteData,
  ]);
  const nexusPlayer = new NexusPlayer(
    PlayerManager.physics,
    PlayerManager.stats
  );



  setTimeout(() => {
    nexusPlayer.node.setPosition(0,100,0)
    setInterval(() => {
      nexusPlayer.update();
    }, 10);
  }, 1_000);
}
