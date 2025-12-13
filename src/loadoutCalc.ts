import { cloneDeep } from 'lodash'
import {
  ActiveMiningLaserLoadout,
  MiningGadgetEnum,
  MiningLaserEnum,
  MiningLoadout,
  MiningModuleEnum,
} from './gen/schema.types'
import { AllStats, DataStore, LaserLoadoutStats, MiningGadget, MiningLaser, MiningModule } from './types'
import { roundFloat } from './util'

export const DEFAULT_MOLE_LASER = MiningLaserEnum.ArborMh2
export const DEFAULT_PROSPECTOR_LASER = MiningLaserEnum.ArborMh1
export const DEFAULT_GOLEM_LASER = MiningLaserEnum.Pitman
export const DEFAULT_ROC_LASER = MiningLaserEnum.ArborMhv // TODO: this is a guess

export function multiplyReduceLasers(lasers: LaserLoadoutStats[], stat: keyof AllStats): number {
  return lasers.reduce((acc, l) => acc * (l[stat] || 1), 1)
}
export function addReduceLasers(lasers: LaserLoadoutStats[], stat: keyof AllStats): number {
  return lasers.reduce((acc, l) => acc + (l[stat] || 0), 0)
}

export const getMinLoadoutPrice = (obj: MiningModule | MiningLaser | MiningGadget) => {
  if (!obj) return 0
  const allPrices = (Object.values(obj.prices) as number[]) || [0]
  const minPrice = Math.min(...allPrices)
  return minPrice
}

/**
 * This does all the calculations for how to display a mining loadout
 * @param ds
 * @param miningLoadout
 * @returns
 */
export async function calcLoadoutStats(ds: DataStore, miningLoadout: MiningLoadout): Promise<AllStats> {
  const loadoutLookup = await ds.getLookup('loadout')

  const activeLasers = miningLoadout.activeLasers || []
  const laserStatsPromises = activeLasers.map((ml) =>
    ml && ml.laser ? calcLaserStats(ds, ml) : Promise.resolve({ ...baseStats, price: 0, priceNoStock: 0 })
  )

  const laserStats: AllStats[] = await Promise.all(laserStatsPromises)
  const activeGadget =
    miningLoadout.activeGadgetIndex != undefined &&
    miningLoadout.activeGadgetIndex > -1 &&
    miningLoadout.inventoryGadgets.length > miningLoadout.activeGadgetIndex
      ? cloneDeep(loadoutLookup.gadgets[miningLoadout.inventoryGadgets[miningLoadout.activeGadgetIndex]])
      : null
  const gadgetStats = sanitizeStats(activeGadget?.stats || {})

  const totalUnModdedPower = activeLasers.reduce((acc, al) => {
    if (!al || !al.laser || !al.laserActive) return acc
    const laser = loadoutLookup.lasers[al.laser as MiningLaserEnum]
    return acc + (laser.stats.maxPower || 0)
  }, 0)

  const totalUnModdedExtrPower = activeLasers.reduce((acc, al) => {
    if (!al || !al.laser || !al.laserActive) return acc
    const laser = loadoutLookup.lasers[al.laser as MiningLaserEnum]
    return acc + (laser.stats.extrPower || 0)
  }, 0)

  const totalModdedPower = laserStats.reduce((acc, ls) => acc + ls.maxPower, 0)
  const totalModdedExtrPower = laserStats.reduce((acc, ls) => acc + ls.extrPower, 0)

  const inventoryPrice =
    miningLoadout.inventoryModules.reduce(
      (acc, m) => getMinLoadoutPrice(loadoutLookup.modules[m as MiningModuleEnum]) + acc,
      0
    ) +
    miningLoadout.inventoryGadgets.reduce(
      (acc, g) => getMinLoadoutPrice(loadoutLookup.gadgets[g as MiningGadgetEnum]) + acc,
      0
    ) +
    miningLoadout.inventoryLasers.reduce(
      (acc, l) => getMinLoadoutPrice(loadoutLookup.lasers[l as MiningLaserEnum]) + acc,
      0
    )

  const maxPower = addReduceLasers(laserStats, 'maxPower')
  const minPower = addReduceLasers(laserStats, 'minPower')
  const extrPower = addReduceLasers(laserStats, 'extrPower')

  const extrPowerMod = activeLasers.length > 0 ? totalModdedExtrPower / (totalUnModdedExtrPower || 1) : 1
  const minPowerPct = 0 // Not really relevant for groups of lasers
  const powerMod = activeLasers.length > 0 ? totalModdedPower / (totalUnModdedPower || 1) : 1
  const retVal = {
    maxPower,
    minPower,
    extrPower,
    maxRange: laserStats.length > 0 ? addReduceLasers(laserStats, 'maxRange') / laserStats.length : 0,
    // Get the minimum value or 0 if there are no lasers
    optimumRange: laserStats.length > 0 ? addReduceLasers(laserStats, 'optimumRange') / laserStats.length : 0,

    overchargeRate: multiplyReduceLasers(laserStats, 'overchargeRate') * (gadgetStats.overchargeRate || 1),
    clusterMod: multiplyReduceLasers(laserStats, 'clusterMod') * (gadgetStats.clusterMod || 1),
    inertMaterials: multiplyReduceLasers(laserStats, 'inertMaterials') * (gadgetStats.inertMaterials || 1),

    instability: multiplyReduceLasers(laserStats, 'instability') * (gadgetStats.instability || 1),
    resistance: multiplyReduceLasers(laserStats, 'resistance') * (gadgetStats.resistance || 1),
    optimalChargeRate: multiplyReduceLasers(laserStats, 'optimalChargeRate') * (gadgetStats.optimalChargeRate || 1),
    optimalChargeWindow:
      multiplyReduceLasers(laserStats, 'optimalChargeWindow') * (gadgetStats.optimalChargeWindow || 1),
    shatterDamage: multiplyReduceLasers(laserStats, 'shatterDamage') * (gadgetStats.shatterDamage || 1),

    extrPowerMod,
    minPowerPct,
    powerMod,

    price: laserStats.reduce((acc, l) => (l.price ? acc + l.price : acc), 0) + inventoryPrice,
    priceNoStock: laserStats.reduce((acc, l) => (l.priceNoStock ? acc + l.priceNoStock : acc), 0) + inventoryPrice,
  }

  return retVal
}

/**
 * Feb 10, 2025: As of 4.0.1 modules stack again. What this means is that the laser power (l) is
 * (l * m1) + (l * m2) + (l * m3) + ... + (l * mn) where m1, m2, m3, ... mn are the module multipliers
 * @param modules
 * @param stat
 * @returns
 */
export function multiplyReduceModules(modules: MiningModule[], stat: keyof AllStats): number {
  // THIS IS THE OLD WAY. Leaving it here for reference
  // return modules.reduce((acc, m) => acc * (m.stats[stat] || 1), 1)
  const retVal =
    modules.reduce((acc, m) => {
      if (!m) return acc
      return acc + (m.stats[stat] || 1) - 1
    }, 0) + 1
  return retVal
}

export async function calcLaserStats(ds: DataStore, activeLaser: ActiveMiningLaserLoadout): Promise<AllStats> {
  const loadoutLookup = await ds.getLookup('loadout')

  const laser = cloneDeep(loadoutLookup.lasers[activeLaser.laser as MiningLaserEnum] as MiningLaser)
  if (!laser) return { ...baseStats, price: 0, priceNoStock: 0 }
  laser.stats = sanitizeStats(laser.stats)
  const isLaserOn = activeLaser.laserActive
  if (!isLaserOn) laser.stats = baseStats

  const modules = (activeLaser.modules || []).map((m) => loadoutLookup.modules[m as MiningModuleEnum])

  const modulePrice = modules.reduce((acc, m) => {
    const price = getMinLoadoutPrice(m)
    return m && price ? acc + price : acc
  }, 0)
  // TODO: This is going to need to change
  const isStockLaser = laser.code === DEFAULT_MOLE_LASER || laser.code === DEFAULT_PROSPECTOR_LASER

  const activatedModules = modules.filter(
    (m, idx) => m && activeLaser.modulesActive.length > idx && activeLaser.modulesActive[idx]
  )

  const maxRange = laser.stats.maxRange
  const optimumRange = laser.stats.optimumRange

  const multReduceStats = [
    'resistance',
    'instability',
    'maxRange',
    'optimumRange',
    'shatterDamage',
    'optimalChargeRate',
    'optimalChargeWindow',
    'inertMaterials',
    'clusterMod',
    'overchargeRate',
  ].reduce(
    (acc, stat) => ({
      ...acc,
      [stat]: laser.stats[stat] * multiplyReduceModules(activatedModules, stat as keyof AllStats),
    }),
    {} as Partial<AllStats>
  )
  const powerMod = multiplyReduceModules(activatedModules, 'powerMod')
  const extrPowerMod = multiplyReduceModules(activatedModules, 'extrPowerMod')

  const maxPower = laser.stats.maxPower * powerMod
  const minPower = laser.stats.minPower * powerMod
  const extrPower = laser.stats.extrPower * extrPowerMod

  const minPowerPct = 0 // Not really relevant for groups of lasers
  // Just a simple add up
  const laserMinPrice = getMinLoadoutPrice(laser)
  const price = (laserMinPrice || 0) + modulePrice
  const priceNoStock = (isStockLaser ? 0 : laserMinPrice || 0) + modulePrice

  const retVal: AllStats = {
    ...(multReduceStats as AllStats),
    maxPower,
    minPower,
    extrPower,
    maxRange,
    optimumRange,
    extrPowerMod,
    powerMod,
    minPowerPct,
    price,
    priceNoStock,
  }
  return retVal
}

export const baseStats: AllStats = {
  maxPower: 0,
  minPower: 0,
  extrPower: 0,
  maxRange: 0,
  optimumRange: 0,
  overchargeRate: 1,
  clusterMod: 1,
  inertMaterials: 1,
  instability: 1,
  resistance: 1,
  optimalChargeRate: 1,
  optimalChargeWindow: 1,
  shatterDamage: 1,
  minPowerPct: 0,
  extrPowerMod: 1,
  price: 0,
  priceNoStock: 0,
  powerMod: 1,
}

export const sanitizeStats = (incoming: Partial<AllStats>): AllStats => {
  return {
    maxPower: roundFloat(incoming.maxPower || 0),
    minPower: roundFloat(incoming.minPower || 0),
    extrPower: roundFloat(incoming.extrPower || 0),
    maxRange: roundFloat(incoming.maxRange || 0),
    optimumRange: roundFloat(incoming.optimumRange || 0),
    // Modifiers
    overchargeRate: roundFloat(incoming.overchargeRate || 1, 2),
    clusterMod: roundFloat(incoming.clusterMod || 1, 2),
    inertMaterials: roundFloat(incoming.inertMaterials || 1, 2),
    instability: roundFloat(incoming.instability || 1, 2),
    resistance: roundFloat(incoming.resistance || 1, 2),
    optimalChargeRate: roundFloat(incoming.optimalChargeRate || 1, 2),
    optimalChargeWindow: roundFloat(incoming.optimalChargeWindow || 1, 2),
    shatterDamage: roundFloat(incoming.shatterDamage || 1, 2),
    extrPowerMod: roundFloat(incoming.extrPowerMod || 1, 2),
    minPowerPct: roundFloat(incoming.minPowerPct || 0, 2),
    powerMod: roundFloat(incoming.powerMod || 1, 2),
    // Prices
    price: roundFloat(incoming.price || 0),
    priceNoStock: roundFloat(incoming.priceNoStock || 0),
  }
}
