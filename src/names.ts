/**
 * This file is primarily for translating our GraphQL enumerations into human-readable strings.
 * Eventually it would be nice to localize these strings with i18n or something but.... that's a lot of work.
 */

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
  [ActivityEnum.VehicleMining]: 'Vehicle / FPS Mining',
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

const RefineryAbbrevs: Record<RefineryEnum, string> = {
  [RefineryEnum.Arcl1]: 'Arc-L1',
  [RefineryEnum.Arcl2]: 'Arc-L2',
  [RefineryEnum.Arcl4]: 'Arc-L4',
  [RefineryEnum.Crul1]: 'Cru-L1',
  [RefineryEnum.Hurl1]: 'Hur-L1',
  [RefineryEnum.Hurl2]: 'Hur-L2',
  [RefineryEnum.Micl1]: 'Mic-L1',
  [RefineryEnum.Micl2]: 'Mic-L2',
  [RefineryEnum.Micl5]: 'Mic-L5',
  [RefineryEnum.Magng]: 'ST-MAG',
  [RefineryEnum.Pyrog]: 'ST-PYR',
  [RefineryEnum.Terrg]: 'ST-TER',
  [RefineryEnum.PyroRuin]: 'RUIN',
  [RefineryEnum.PyroOrbituary]: 'ORBIT',
  [RefineryEnum.PyroCheckmate]: 'CHKMT',
  [RefineryEnum.PyroStantg]: 'PYR-ST',
}
export const getRefineryAbbrev = (refinery: RefineryEnum) =>
  RefineryAbbrevs[refinery] ? RefineryAbbrevs[refinery] : refinery

export const RefinerySystemMap: Record<RefineryEnum, SystemEnum> = {
  [RefineryEnum.Arcl1]: SystemEnum.Stanton,
  [RefineryEnum.Arcl2]: SystemEnum.Stanton,
  [RefineryEnum.Arcl4]: SystemEnum.Stanton,
  [RefineryEnum.Crul1]: SystemEnum.Stanton,
  [RefineryEnum.Hurl1]: SystemEnum.Stanton,
  [RefineryEnum.Hurl2]: SystemEnum.Stanton,
  [RefineryEnum.Micl1]: SystemEnum.Stanton,
  [RefineryEnum.Micl2]: SystemEnum.Stanton,
  [RefineryEnum.Micl5]: SystemEnum.Stanton,
  [RefineryEnum.Magng]: SystemEnum.Stanton,
  [RefineryEnum.Pyrog]: SystemEnum.Pyro,
  [RefineryEnum.Terrg]: SystemEnum.Stanton,
  [RefineryEnum.PyroRuin]: SystemEnum.Pyro,
  [RefineryEnum.PyroOrbituary]: SystemEnum.Pyro,
  [RefineryEnum.PyroCheckmate]: SystemEnum.Pyro,
  [RefineryEnum.PyroStantg]: SystemEnum.Pyro,
}

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

/**
 * Note: these abbreviations are a little sloppy. We probably should use the periodic table abbreviations
 * like Au for Gold, but then I worry that people won't be able to find the ore they are looking for.
 *
 * So I stick with phonetic abbreviations that are easy to remember.
 */
const ShipOreAbbrev: Record<ShipOreEnum, [string, string]> = {
  [ShipOreEnum.Agricium]: ['Agr', 'Agri'],
  [ShipOreEnum.Aluminum]: ['Alu', 'Alum'],
  [ShipOreEnum.Beryl]: ['Ber', 'Berl'],
  [ShipOreEnum.Bexalite]: ['Bex', 'Bex'],
  [ShipOreEnum.Borase]: ['Bor', 'Bors'],
  [ShipOreEnum.Copper]: ['Cop', 'Copp'],
  [ShipOreEnum.Corundum]: ['Cor', 'Coru'],
  [ShipOreEnum.Diamond]: ['Dia', 'Diam'],
  [ShipOreEnum.Gold]: ['Gol', 'Gold'],
  [ShipOreEnum.Iron]: ['Iro', 'Iron'],
  [ShipOreEnum.Hephaestanite]: ['Hep', 'Heph'],
  [ShipOreEnum.Inertmaterial]: ['Int', 'Iner'],
  [ShipOreEnum.Laranite]: ['Lar', 'Lara'],
  [ShipOreEnum.Quantanium]: ['Qnt', 'Quan'],
  [ShipOreEnum.Quartz]: ['Qtz', 'Quar'],
  [ShipOreEnum.Taranite]: ['Tar', 'Tara'],
  [ShipOreEnum.Titanium]: ['Tit', 'Tita'],
  [ShipOreEnum.Tungsten]: ['Tng', 'Tung'],
  // Pyro Ores
  [ShipOreEnum.Silicon]: ['Sil', 'Sili'],
  [ShipOreEnum.Tin]: ['Tin', 'Tin'],
  [ShipOreEnum.Stileron]: ['Sti', 'Stil'],
  [ShipOreEnum.Ice]: ['Ice', 'Ice'],
  [ShipOreEnum.Riccite]: ['Ric', 'Ricc'],
}
export const getShipOreAbbrev = (ore: ShipOreEnum, abLen: 3 | 4) => {
  if (abLen === 3) return ShipOreAbbrev[ore] ? ShipOreAbbrev[ore][0] : ore
  if (abLen === 4) return ShipOreAbbrev[ore] ? ShipOreAbbrev[ore][1] : ore
}

const VehicleOreNames: Record<VehicleOreEnum, string> = {
  [VehicleOreEnum.Hadanite]: 'Hadanite',
  [VehicleOreEnum.Aphorite]: 'Aphorite',
  [VehicleOreEnum.Dolivine]: 'Dolivine',
  [VehicleOreEnum.Janalite]: 'Janalite',
  [VehicleOreEnum.Beradom]: 'Beradom',
  [VehicleOreEnum.Glacosite]: 'Glacosite',
  [VehicleOreEnum.Feynmaline]: 'Feynmaline',
  [VehicleOreEnum.Jaclium]: 'Jaclium',
  [VehicleOreEnum.Saldynium]: 'Saldynium',
  [VehicleOreEnum.Carinite]: 'Carinite',
}
export const getVehicleOreName = (ore: VehicleOreEnum) => (VehicleOreNames[ore] ? VehicleOreNames[ore] : ore)

const VehicleOreAbbrev: Record<VehicleOreEnum, [string, string]> = {
  [VehicleOreEnum.Hadanite]: ['Had', 'Hada'],
  [VehicleOreEnum.Aphorite]: ['Aph', 'Apho'],
  [VehicleOreEnum.Dolivine]: ['Dol', 'Dolv'],
  [VehicleOreEnum.Janalite]: ['Jan', 'Jana'],
  [VehicleOreEnum.Beradom]: ['Ber', 'Bera'],
  [VehicleOreEnum.Glacosite]: ['Gla', 'Glac'],
  [VehicleOreEnum.Feynmaline]: ['Fey', 'Feyn'],
  [VehicleOreEnum.Jaclium]: ['Jac', 'Jacl'],
  [VehicleOreEnum.Saldynium]: ['Sld', 'Sald'],
  [VehicleOreEnum.Carinite]: ['Car', 'Cari'],
}

export const getVehicleOreAbbrev = (ore: VehicleOreEnum, abLen: 3 | 4) => {
  if (abLen === 3) return VehicleOreAbbrev[ore] ? VehicleOreAbbrev[ore][0] : ore
  if (abLen === 4) return VehicleOreAbbrev[ore] ? VehicleOreAbbrev[ore][1] : ore
}

const SalveageOreNames: Record<SalvageOreEnum, string> = {
  [SalvageOreEnum.Rmc]: 'Recy. Material Composite',
  [SalvageOreEnum.Cmat]: 'Const. Materials',
}
export const getSalvageOreName = (ore: SalvageOreEnum) => (SalveageOreNames[ore] ? SalveageOreNames[ore] : ore)

const SalvageOreAbbrev: Record<SalvageOreEnum, [string, string]> = {
  [SalvageOreEnum.Rmc]: ['Rmc', 'Rmc'],
  [SalvageOreEnum.Cmat]: ['Cmt', 'Cmat'],
}

export const getSalvageOreAbbrev = (ore: SalvageOreEnum, abLen: 3 | 4) => {
  if (abLen === 3) return SalvageOreAbbrev[ore] ? SalvageOreAbbrev[ore][0] : ore
  if (abLen === 4) return SalvageOreAbbrev[ore] ? SalvageOreAbbrev[ore][1] : ore
}

const OreNames = {
  ...ShipOreNames,
  ...VehicleOreNames,
  ...SalveageOreNames,
}
export const getOreName = (ore: AnyOreEnum) => (OreNames[ore] ? OreNames[ore] : ore)

const OreAbbrevs = {
  ...ShipOreAbbrev,
  ...VehicleOreAbbrev,
  ...SalvageOreAbbrev,
}
export const getOreAbbrev = (ore: AnyOreEnum, abLen: 3 | 4) => {
  if (OreAbbrevs[ore]) return OreAbbrevs[ore][abLen === 3 ? 0 : 1]
  return ore
}

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
