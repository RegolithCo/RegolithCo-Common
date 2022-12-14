import {
  RefineryEnum,
  ShipOreEnum,
  VehicleOreEnum,
  RefineryMethodEnum,
  SalvageOreEnum,
  ShipManufacturerEnum,
  LocationEnum,
  ActivityEnum,
  ScoutingFindStateEnum,
  SessionUserStateEnum,
  ShareTypeEnum,
  MiningStoreEnum,
  SystemEnum,
  AsteroidTypeEnum,
  DepositTypeEnum,
} from './gen/schema.types'
import { AnyOreEnum, ObjectValues } from './types'

export const InvalidSCNames: string[] = ['admin', 'administrator', 'moderator', 'deleted', 'unknown']

const SystemNames: Record<SystemEnum, string> = {
  [SystemEnum.Pyro]: 'Pyro',
  [SystemEnum.Stanton]: 'Stanton',
}
export const getSystemName = (system: SystemEnum) => (SystemNames[system] ? SystemNames[system] : system)

const AsteroidTypeNames: Record<AsteroidTypeEnum, string> = {
  [AsteroidTypeEnum.Ctype]: 'C-Type',
  [AsteroidTypeEnum.Etype]: 'E-Type',
  [AsteroidTypeEnum.Itype]: 'I-Type',
  [AsteroidTypeEnum.Mtype]: 'M-Type',
  [AsteroidTypeEnum.Ptype]: 'P-Type',
  [AsteroidTypeEnum.Qtype]: 'Q-Type',
  [AsteroidTypeEnum.Stype]: 'S-Type',
}
export const getAsteroidTypeName = (aType: AsteroidTypeEnum) =>
  AsteroidTypeNames[aType] ? AsteroidTypeNames[aType] : aType

const DepositTypeNames: Record<DepositTypeEnum, string> = {
  [DepositTypeEnum.Atacamite]: 'Atacamite',
  [DepositTypeEnum.Felsic]: 'Felsic',
  [DepositTypeEnum.Gneiss]: 'Gneiss',
  [DepositTypeEnum.Granite]: 'Granite',
  [DepositTypeEnum.Igneous]: 'Igneous',
  [DepositTypeEnum.Obsidian]: 'Obsidian',
  [DepositTypeEnum.Quartzite]: 'Quartzite',
  [DepositTypeEnum.Shale]: 'Shale',
}
export const getDepositTypeName = (dType: DepositTypeEnum) =>
  DepositTypeNames[dType] ? DepositTypeNames[dType] : dType

export const getRockTypeName = (rockType: AsteroidTypeEnum | DepositTypeEnum) => {
  if (rockType in AsteroidTypeNames) {
    return getAsteroidTypeName(rockType as AsteroidTypeEnum)
  } else if (rockType in DepositTypeNames) {
    return getDepositTypeName(rockType as DepositTypeEnum)
  }
  return rockType
}

const ActivityNames: Record<ActivityEnum, string> = {
  [ActivityEnum.ShipMining]: 'Ship Mining',
  [ActivityEnum.VehicleMining]: 'ROC Mining',
  [ActivityEnum.Salvage]: 'Salvaging',
  [ActivityEnum.Other]: 'Share aUEC',
}
export const getActivityName = (activity: ActivityEnum) =>
  ActivityNames[activity] ? ActivityNames[activity] : activity

const SesssionUserStateNames: Record<SessionUserStateEnum, string> = {
  [SessionUserStateEnum.OnSite]: 'On-site',
  [SessionUserStateEnum.RefineryRun]: 'Refinery Run',
  [SessionUserStateEnum.Travelling]: 'En-route',
  [SessionUserStateEnum.Afk]: 'Away / AFK',
  [SessionUserStateEnum.Scouting]: 'Scouting',
  [SessionUserStateEnum.Unknown]: '',
}
export const getSessionUserStateName = (state: SessionUserStateEnum) =>
  SesssionUserStateNames[state] ? SesssionUserStateNames[state] : state

const ScoutingFindStateNames: Record<ScoutingFindStateEnum, string> = {
  [ScoutingFindStateEnum.ReadyForWorkers]: 'Need Workers',
  [ScoutingFindStateEnum.Abandonned]: 'Abandoned',
  [ScoutingFindStateEnum.Depleted]: 'Depleted',
  [ScoutingFindStateEnum.Working]: 'Working',
  [ScoutingFindStateEnum.Discovered]: 'Discovered',
}
export const getScoutingFindStateName = (state: ScoutingFindStateEnum) =>
  ScoutingFindStateNames[state] ? ScoutingFindStateNames[state] : state

const LocationNames: Record<LocationEnum, string> = {
  [LocationEnum.Cave]: 'Surface Cave',
  [LocationEnum.Ring]: 'Planetary Ring',
  [LocationEnum.Surface]: 'Surface',
  [LocationEnum.Space]: 'Outer Space',
}
export const getLocationName = (location: LocationEnum) =>
  LocationNames[location] ? LocationNames[location] : location

const ShipManufacturerNames: Record<ShipManufacturerEnum, string> = {
  [ShipManufacturerEnum.Aegs]: 'Aegis Dynamics',
  [ShipManufacturerEnum.Anvl]: 'Anvil Aerospace',
  [ShipManufacturerEnum.Argo]: 'Argo Astronautics',
  [ShipManufacturerEnum.Crus]: 'Crusader Industries',
  [ShipManufacturerEnum.Drak]: 'DRAKE Interplanetary',
  [ShipManufacturerEnum.Rsin]: 'RSI Corporation',
  [ShipManufacturerEnum.Misc]: 'MISC Star Systems',
  [ShipManufacturerEnum.Mira]: 'MIRAI',
  [ShipManufacturerEnum.Cnou]: 'Consolidated Outland',
  [ShipManufacturerEnum.Grin]: 'Greycat Industrial',
  [ShipManufacturerEnum.Tumbril]: 'Tumbril Land Systems',
}
export const getShipManufacturerName = (manufacturer: ShipManufacturerEnum) =>
  ShipManufacturerNames[manufacturer] ? ShipManufacturerNames[manufacturer] : manufacturer

// This is also the order they are displayed in the dropdown
const RefineryNames: Record<RefineryEnum, string> = {
  [RefineryEnum.Arcl1]: 'Arc-L1: Wide Forest Station',
  [RefineryEnum.Arcl2]: 'Arc-L2: Lively Pathway Station',
  [RefineryEnum.Arcl4]: 'Arc-L4: Faint Glen Station',
  [RefineryEnum.Crul1]: 'Cru-L1: Ambitious Dream Station',
  [RefineryEnum.Hurl1]: 'Hur-L1: Green Glade Station',
  [RefineryEnum.Hurl2]: 'Hur-L2: Faithful Dream Station',
  [RefineryEnum.Micl1]: 'Mic-L1: Shallow Frontier Station',
  [RefineryEnum.Micl2]: 'Mic-L2: Long Forest Station',
  [RefineryEnum.Micl5]: 'Mic-L5: Modern Icarus Station',
  [RefineryEnum.Magng]: 'ST-MAG: Magnus Gateway',
  [RefineryEnum.Pyrog]: 'ST-PYR: Pyro Gateway',
  [RefineryEnum.Terrg]: 'ST-TER: Terra Gateway',
  [RefineryEnum.PyroRuin]: 'Ruin Station',
  [RefineryEnum.PyroOrbituary]: 'Orbituary Station',
  [RefineryEnum.PyroCheckmate]: 'Checkmate Station',
  [RefineryEnum.PyroStantg]: 'PYR-ST: Stanton Gateway',
}
export const getRefineryName = (refinery: RefineryEnum) =>
  RefineryNames[refinery] ? RefineryNames[refinery] : refinery

const RefineryMethodNames: Record<RefineryMethodEnum, string> = {
  [RefineryMethodEnum.Cormack]: 'Cormack Method',
  [RefineryMethodEnum.Electrostarolysis]: 'Electrostarolysis',
  [RefineryMethodEnum.FerronExchange]: 'Ferron Exchange',
  [RefineryMethodEnum.DinyxSolventation]: 'Dinyx Solventation',
  [RefineryMethodEnum.GaskinProcess]: 'Gaskin Process',
  [RefineryMethodEnum.KazenWinnowing]: 'Kazen Winnowing',
  [RefineryMethodEnum.PyrometricChromalysis]: 'Pyrometric Chromalysis',
  [RefineryMethodEnum.ThermonaticDeposition]: 'Thermonatic Deposition',
  [RefineryMethodEnum.XcrReaction]: 'XCR Reaction',
}
export const getRefineryMethodName = (method: RefineryMethodEnum) =>
  RefineryMethodNames[method] ? RefineryMethodNames[method] : method

const ShipOreNames: Record<ShipOreEnum, string> = {
  [ShipOreEnum.Agricium]: 'Agricium',
  [ShipOreEnum.Aluminum]: 'Aluminum',
  [ShipOreEnum.Beryl]: 'Beryl',
  [ShipOreEnum.Bexalite]: 'Bexalite',
  [ShipOreEnum.Borase]: 'Borase',
  [ShipOreEnum.Copper]: 'Copper',
  [ShipOreEnum.Corundum]: 'Corundum',
  [ShipOreEnum.Diamond]: 'Diamond',
  [ShipOreEnum.Gold]: 'Gold',
  [ShipOreEnum.Iron]: 'Iron',
  [ShipOreEnum.Hephaestanite]: 'Hephaestanite',
  [ShipOreEnum.Inertmaterial]: 'InertMaterial',
  [ShipOreEnum.Laranite]: 'Laranite',
  [ShipOreEnum.Quantanium]: 'Quantanium',
  [ShipOreEnum.Quartz]: 'Quartz',
  [ShipOreEnum.Taranite]: 'Taranite',
  [ShipOreEnum.Titanium]: 'Titanium',
  [ShipOreEnum.Tungsten]: 'Tungsten',
  // Pyro Ores
  [ShipOreEnum.Silicon]: 'Silicon',
  [ShipOreEnum.Tin]: 'Tin',
  [ShipOreEnum.Stileron]: 'Stileron',
  [ShipOreEnum.Ice]: 'Ice',
  [ShipOreEnum.Riccite]: 'Riccite',
}
export const getShipOreName = (ore: ShipOreEnum) => (ShipOreNames[ore] ? ShipOreNames[ore] : ore)

const VehicleOreNames: Record<VehicleOreEnum, string> = {
  [VehicleOreEnum.Hadanite]: 'Hadanite',
  [VehicleOreEnum.Aphorite]: 'Aphorite',
  [VehicleOreEnum.Dolivine]: 'Dolivine',
  [VehicleOreEnum.Janalite]: 'Janalite',
}
export const getVehicleOreName = (ore: VehicleOreEnum) => (VehicleOreNames[ore] ? VehicleOreNames[ore] : ore)

const SalveageOreNames: Record<SalvageOreEnum, string> = {
  [SalvageOreEnum.Rmc]: 'Recy. Material Composite',
  [SalvageOreEnum.Cmat]: 'Const. Materials',
}
export const getSalvageOreName = (ore: SalvageOreEnum) => (SalveageOreNames[ore] ? SalveageOreNames[ore] : ore)

const OreNames = {
  ...ShipOreNames,
  ...VehicleOreNames,
  ...SalveageOreNames,
}
export const getOreName = (ore: AnyOreEnum) => (OreNames[ore] ? OreNames[ore] : ore)

export const failReasons: [string, string][] = [
  //
  ['Game Error / 30K', '30K'],
  ['Dirty, stinking pirates!', 'Pirates'],
  ['Pilot error', 'Pilot Error'],
  ['Gravity made me do it!', 'Gravity'],
]

export const ShareTypeToolTip: Record<ShareTypeEnum, string> = {
  [ShareTypeEnum.Amount]: 'Flat Rate Amount',
  [ShareTypeEnum.Percent]: 'Percentage of Total',
  [ShareTypeEnum.Share]: 'Shares of Total',
}

export const OreTierEnum = {
  STier: 'S',
  ATier: 'A',
  BTier: 'B',
  CTier: 'C',
} as const
export type OreTierEnum = ObjectValues<typeof OreTierEnum>

export const OreTierNames: Record<OreTierEnum, string> = {
  [OreTierEnum.STier]: 'S-Tier',
  [OreTierEnum.ATier]: 'A-Tier',
  [OreTierEnum.BTier]: 'B-Tier',
  [OreTierEnum.CTier]: 'C-Tier',
}

export const ShipOreTiers: Record<OreTierEnum, ShipOreEnum[]> = {
  [OreTierEnum.STier]: [ShipOreEnum.Quantanium, ShipOreEnum.Stileron, ShipOreEnum.Riccite],
  [OreTierEnum.ATier]: [ShipOreEnum.Taranite, ShipOreEnum.Bexalite, ShipOreEnum.Gold],
  [OreTierEnum.BTier]: [
    ShipOreEnum.Laranite,
    ShipOreEnum.Borase,
    ShipOreEnum.Beryl,
    ShipOreEnum.Agricium,
    ShipOreEnum.Hephaestanite,
  ],
  [OreTierEnum.CTier]: [
    ShipOreEnum.Tungsten,
    ShipOreEnum.Titanium,
    ShipOreEnum.Silicon,
    ShipOreEnum.Iron,
    ShipOreEnum.Quartz,
    ShipOreEnum.Corundum,
    ShipOreEnum.Copper,
    ShipOreEnum.Tin,
    ShipOreEnum.Aluminum,
    ShipOreEnum.Ice,
  ],
}
