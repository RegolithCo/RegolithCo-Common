/* eslint-disable no-unused-vars */
import {
  RefineryEnum,
  ShipOreEnum,
  VehicleOreEnum,
  RefineryMethodEnum,
  SalvageOreEnum,
  User,
  WorkOrderStateEnum,
  MiningLaserEnum,
  MiningModuleEnum,
  MiningGadgetEnum,
  Vehicle,
  ActivityEnum,
  AuthTypeEnum,
  SessionRoleEnum,
  ShipRoleEnum,
  AsteroidTypeEnum,
  DepositTypeEnum,
  SystemEnum,
} from './gen/schema.types'

export type JSONObject = string | number | boolean | { [x: string]: JSONObject } | Array<JSONObject>
export type ObjectValues<T> = T[keyof T]

export const MAX_NOTE_LENGTH = 255 // character length limit for notes

export type RegolithStatsSummary = {
  users: number
  sessions: number
  workOrders: number
  scouting: {
    rocks: number
    gems: number
    wrecks: number
  }
  workOrderTypes: Record<ActivityEnum, number>
  failReasons: Record<string, number>
  shipOres: Record<ShipOreEnum, number>
  refineryMethod: Record<RefineryMethodEnum, number>
  refineries: Record<RefineryEnum, number>
  vehicleOres: Record<VehicleOreEnum, number>
  salvageOres: Record<SalvageOreEnum, number>
  grossProfitaUEC: number
  rawOreSCU: number
  lossaUEC: number
}

export type RegolithMonthStats = {
  days: Record<string, RegolithStatsSummary>
  summary: RegolithStatsSummary
}

export type RegolithAllTimeStats = {
  months: Record<string, RegolithStatsSummary>
  summary: RegolithStatsSummary
}

export type AuthorizerContextReturn = {
  avatar?: string
  authId: string // DiscordID, GoogleId or API Key
  authType: AuthTypeEnum
  authToken?: string
}

export const AccountVerifyReturnEnum = {
  SUCCESS: 'Success', // The code was found on the page
  NOT_VALID: 'NotValid', // The code was not found on the page
  USER_NOT_FOUND: 'UserNotFound', // The user was not found (404)
  UNKNOWN_ERROR: 'UnknownError', // any other error
} as const
export type AccountVerifyReturnEnum = ObjectValues<typeof AccountVerifyReturnEnum>

export type RefineryModifiers = [yldMod: number, timeMod: number, costMod: number]

export type RefineryBonusLookup = Record<RefineryEnum, OreProcessingLookup>

export type OreProcessingLookup = Record<ShipOreEnum, RefineryModifiers>

export type MethodsBonusLookup = Record<RefineryMethodEnum, RefineryModifiers>

export type ShipLookups = Vehicle[]
export type OwedPaid = Record<string, Record<string, number>>

export type ShareAmtArr = [beforeXfer: number, afterXfer: number, xFerAmt: number]
export type CrewSharePayout = {
  allPaid: boolean
  payouts: ShareAmtArr[]
  owed: OwedPaid
  paid: OwedPaid
  transferFees: number
  remainder?: number
}

// We rework this slightly so it's easier to work with
export type GravityWell = {
  label: string
  wellType: GravityWellTypeEnum
  id: string
  system: SystemEnum
  depth: number
  parent: string | null
  parents: string[]
  parentType: GravityWellTypeEnum | null
  isSpace: boolean
  isSurface: boolean
  hasRocks: boolean
  hasGems: boolean
}

export type Lookups = {
  refineryBonusLookup: RefineryBonusLookup
  oreProcessingLookup: OreProcessingLookup
  methodsBonusLookup: MethodsBonusLookup
  shipLookups: ShipLookups
  tradeportLookups: UEXTradeport[]
  priceStatsLookups: UEXPriceStats
  densitiesLookups: Record<ShipOreEnum, number>
  gravityWellLookups: GravityWell[]
  loadout: LoadoutLookup
}

export type WorkOrderSummary = {
  calculatedState: WorkOrderStateEnum
  allPaid: boolean
  sellerScName: string
  payoutSummary: Record<string, ShareAmtArr>
  owed: OwedPaid
  paid: OwedPaid
  remainder?: number
  crewShareSummary?: ShareAmtArr[]
  oreSummary: OreSummary
  // Yield SCU is a strange number because it's rounded up for each ore to the nearest SCU
  // This includes refined OR unrefined depending
  yieldSCU: number
  transferFees: number
  refiningTime?: number
  unrefinedValue?: number
  payoutsTotal: number
  refinedValue?: number
  remainingTime?: number
  completionTime?: number
  expensesValue: number
  lossValue: number
  grossValue: number
  shareAmount: number
}

export type OreSummary = Partial<Record<AnyOreEnum, { collected: number; refined: number; isRefined: boolean }>>

export type SessionBreakdown = Omit<Omit<WorkOrderSummary, 'sellerScName'>, 'calculatedState'> & {
  orderBreakdowns: Record<string, WorkOrderSummary>
  payoutSummary: Record<string, ShareAmtArr>
  rawOreCollected: number
  owed: OwedPaid
  paid: OwedPaid
  oreSummary: OreSummary
  // Yield SCU is a strange number because it's rounded up for each ore to the nearest SCU
  // This includes refined OR unrefined depending
  yieldSCU: number
  lastFinishedOrder: number | null
  expensesValue: number
  transferFees: number
  lossValue: number
  grossValue: number
  shareAmount: number
}

export type FindSummary = {
  value: number
  volume: number
}

export type AnyOreEnum = ShipOreEnum | VehicleOreEnum | SalvageOreEnum

export type RockSummary = {
  rock: FindSummary
  byOre: Partial<Record<AnyOreEnum, FindSummary>>
}

export type RockVolumeSummary = {
  rock: number
  byOre: Partial<Record<AnyOreEnum, number>>
}

export type FindClusterSummary = FindSummary & {
  oreSort?: AnyOreEnum[]
  byOre?: Partial<Record<AnyOreEnum, FindSummary>>
  byRock?: FindSummary[]
}

export type UserSuggest = Record<
  string,
  {
    friend: boolean
    session: boolean
    named: boolean
    crew: boolean
    userId?: string
    sessionRole?: SessionRoleEnum
    shipRole?: ShipRoleEnum
  }
>

export type CrewList = { activeIds: string[]; innactiveSCNames: string[] }
export type CrewHierarchy = Record<string, CrewList>

export type VerifiedUserLookup = Record<string, User | null>

export type UEXTradeport = {
  system: string
  planet: string
  satellite: string
  city: string
  code: string
  name: string
  name_short: string
  refinery: boolean
  prices: {
    oreRaw: { [key in ShipOreEnum]?: number }
    oreRefined: { [key in ShipOreEnum]?: number }
    gems: { [key in VehicleOreEnum]?: number }
    salvage: { [key in SalvageOreEnum]?: number }
  }
}

export type UEXPriceStat = {
  max: [number, string[]]
  min: [number, string[]]
  avg: number
}

export type StoreChoice = {
  prices: Partial<Record<AnyOreEnum, number>>
  price: number
  system: string
  planet: string
  city: string
  satellite: string
  code: string
  name: string
  name_short: string
  missingOres: AnyOreEnum[]
}

export type UEXPriceStats = {
  oreRaw: { [key in ShipOreEnum]?: UEXPriceStat }
  oreRefined: { [key in ShipOreEnum]?: UEXPriceStat }
  gems: { [key in VehicleOreEnum]?: UEXPriceStat }
  salvage: { [key in SalvageOreEnum]?: UEXPriceStat }
}

/**
 * We will use this for each of the individual components and
 */
export type LoadoutStats = {
  resistance?: number // %
  instability?: number // %
  optimalChargeRate?: number // %
  optimalChargeWindow?: number // %
  inertMaterials?: number // %
  overchargeRate?: number // %
  clusterMod?: number // %
  shatterDamage?: number // %
}

// Sometimes a lower number is better
export const BackwardStats = [
  //
  'minPower',
  'minPowerPct',
  'resistance',
  'instability',
  'inertMaterials',
  'shatterDamage',
  'overchargeRate',
]

export type LaserLoadoutStats = LoadoutStats & {
  optimumRange: number
  maxRange: number
  minPower: number
  maxPower: number
  minPowerPct: number // %
  extrPower: number // %
}

export type ModuleLoadoutStats = LoadoutStats & {
  uses?: number
  duration?: number
  powerMod?: number
  extrPowerMod?: number // %
}

export type AllStats = LaserLoadoutStats &
  ModuleLoadoutStats & {
    price: number
    priceNoStock: number
  }

export type MiningItemBase = {
  UEXID: string
  code: MiningLaserEnum | MiningGadgetEnum | MiningModuleEnum
  name: string
  // UEX Tradeport ID --> Price
  prices: Record<string, number>
}

export type MiningModule = MiningItemBase & {
  active: boolean
  category: string
  stats: ModuleLoadoutStats
}

export type MiningGadget = MiningItemBase & {
  stats: ModuleLoadoutStats
  category: string
}

export type MiningLaser = MiningItemBase & {
  size: number
  slots: number
  stats: LaserLoadoutStats
}

export type MiningStore = {
  UEXID: string
  name: string
  nickname: string
  system: SystemEnum
  planet: string
  moon: string
  station: string
  outpost: string
  city: string
}

export type LoadoutLookup = {
  lasers: Record<MiningLaserEnum, MiningLaser>
  modules: Record<MiningModuleEnum, MiningModule>
  gadgets: Record<MiningGadgetEnum, MiningGadget>
  // UEX Tradeport ID --> Store
  stores: Record<string, MiningStore>
}

export type LoadoutActive = {
  lasers: {
    laser: boolean
    modules: boolean[]
  }[]
  // The inventory index of the module that is active
  gadget: MiningGadgetEnum | null
}

export type UserPrivacyMaps = {
  activeMemberIds: { [key: string]: string } // This one is id to scName
  activeMemberNames: { [key: string]: string } // This one is id to scName
  mentionedUsers: { [key: string]: string } // this one is name to name
}

// Define an interface for a data store
export interface DataStore {
  loading: boolean
  error: string | null
  ready: boolean
  isLocal: boolean
  localPath?: string
  getLookup: <K extends keyof Lookups>(key: K) => Promise<Lookups[K]> | Lookups[K]
}

export type RockType = AsteroidTypeEnum | DepositTypeEnum

export const GravityWellTypeEnum = {
  BELT: 'BELT',
  CLUSTER: 'CLUSTER',
  LAGRANGE: 'LAGRANGE',
  PLANET: 'PLANET',
  SATELLITE: 'SATELLITE',
  SYSTEM: 'SYSTEM',
} as const
export type GravityWellTypeEnum = ObjectValues<typeof GravityWellTypeEnum>
