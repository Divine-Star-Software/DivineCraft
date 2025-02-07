import { BiomeRegister } from "./BiomeReigister";
import { ArticBiomeType } from "./BiomeTypes/ArticBiomeType";
import { DesertBiomeType } from "./BiomeTypes/DesertBiomeType";
import { ForestBiomeType } from "./BiomeTypes/ForestBiomeType";
import { GrassLandBiomeType } from "./BiomeTypes/GrassLandBiomeType";
import { MountainBiomeType } from "./BiomeTypes/MountainBiomeTypes";
import { OceanBiomeType } from "./BiomeTypes/OceanBiomeTypes";
import { RiverBiomeType } from "./BiomeTypes/RiverBiomeType";
import { FrozenWaste } from "./Biomes/Artic/FrozenWaste";
import { TundraBiome } from "./Biomes/Artic/TundaBiome";
import { DeaSeaBiome } from "./Biomes/Desert/DeaSeaBiome";
import { DesertBiome } from "./Biomes/Desert/DesertBiome";
import { BirchForestBiome } from "./Biomes/Forest/BirchForestBiome";
import { DarkOakForestBiome } from "./Biomes/Forest/DarkOakForestBiome";
import { OakForestBiome } from "./Biomes/Forest/OakForestBiome";
import { SpruceForestBiome } from "./Biomes/Forest/SpruceForestBiome";
import { PrairieBiome } from "./Biomes/GrassLand/PrairieBiome";
import { SavannahBiome } from "./Biomes/GrassLand/SavannahBiome";
import { HighGravelHillsBiome } from "./Biomes/Mountian/HighGravelHillsBiome";
import { RockyMountianBiome } from "./Biomes/Mountian/RockyMountianBiome";
import { BeacheBiome } from "./Biomes/Ocean/BeacheBiome";
import { DeepOceanBiome } from "./Biomes/Ocean/DeepOceanBiome";
import { FrozenOceanBiome } from "./Biomes/Ocean/FrozenOceanBiome";
import { IcyBeacheBiome } from "./Biomes/Ocean/IcyBeacheBiome";
import { RockyBeacheBiome } from "./Biomes/Ocean/RockyBeacheBiome";
import { ShallowOceanBiome } from "./Biomes/Ocean/ShallowOceanBiome";
import { TropicalOceanBiome } from "./Biomes/Ocean/TropicalOceanBiome";
import { RiverBankBiome } from "./Biomes/River/RiverBankBiome";
import { RiverBiome } from "./Biomes/River/RiverBiome";
import { StandardCaves } from "./Caves/StandardCaves";
import { ValleysCarver } from "./Caves/ValleysCarver";
import { WormCaves } from "./Caves/WormCaves";

export default function () {
  BiomeRegister.registerBiomeTypes(
    OceanBiomeType,
    ArticBiomeType,
    ForestBiomeType,
    MountainBiomeType,
    DesertBiomeType,
    GrassLandBiomeType,
    RiverBiomeType
  );
  BiomeRegister.registerBiomes(
    TundraBiome,
    DesertBiome,
    DeaSeaBiome,
    DarkOakForestBiome,
    BirchForestBiome,
    FrozenWaste,
    HighGravelHillsBiome,
    SavannahBiome,
    OakForestBiome,
    IcyBeacheBiome,
    RockyBeacheBiome,
    RockyMountianBiome,
    SpruceForestBiome,
    PrairieBiome,
    RockyMountianBiome,
    ShallowOceanBiome,
    BeacheBiome,
    DeepOceanBiome,
    FrozenOceanBiome,
    TropicalOceanBiome,
    RiverBiome,


    RiverBankBiome
  );
  BiomeRegister.registerCaveCarver(StandardCaves, WormCaves, ValleysCarver);
}
