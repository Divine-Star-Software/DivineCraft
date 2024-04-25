import { PlayerPhysicsData } from "./PlayerPhysicsData"
import { PlayerStatsData } from "./PlayerStatsData";


export const PlayerManager = {
  currentDimension: "main",
  physics: <PlayerPhysicsData>{},
  stats: <PlayerStatsData>{},
  $INIt(data: any[]) {},
};
