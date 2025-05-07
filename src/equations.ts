import {
  ShipOreEnum,
  RefineryMethodEnum,
  RefineryEnum,
  CrewShare,
  ShareTypeEnum,
  WorkOrderInterface,
  SalvageOrder,
  VehicleMiningOrder,
  ShipMiningOrder,
  ShipClusterFind,
  VehicleClusterFind,
  SalvageFind,
  ActivityEnum,
  ScoutingFindTypeEnum,
  RefineryRow,
  VehicleMiningRow,
  SalvageRow,
  OtherOrder,
  ScoutingFind,
  WorkOrder,
  WorkOrderStateEnum,
  ShipRock,
  SalvageOreEnum,
  VehicleOreEnum,
} from './gen/schema.types'
import log from 'loglevel'
import {
  WorkOrderSummary,
  SessionBreakdown,
  OreSummary,
  TRANSFER_FEES,
  CrewSharePayout,
  FindClusterSummary,
  OwedPaid,
  AnyOreEnum,
  StoreChoice,
  RockSummary,
  UEXTradeport,
  jsRound,
  DataStore,
} from './index'

/**
 * Translate the ores dictionary into a useful, sorted ores array we can store in the db
 */
export function oresDict2Array<T extends RefineryRow | VehicleMiningRow | SalvageRow>(oresDict: OreSummary): T[] {
  const retVal: { amt: number; ore: string }[] = Object.entries(oresDict).map(([oreName, { collected }]) => ({
    amt: collected,
    ore: oreName,
  }))

  // TODO: Sort in the order that the refinery does
  return retVal as T[]
}

/**
 * Calculates the amount of ore yielded from refining a single rock
 * @param rock
 * @returns
 */
const FUDGE_FACTOR = 33.3333333
export async function shipRockCalc(ds: DataStore, rock: ShipRock): Promise<RockSummary> {
  const { ores, mass } = rock
  let rockValue = 0
  let rockVolume = 0

  // We need to go through this twice
  const densityLookup = await ds.getLookup('densitiesLookups')
  const propDensities = ores.map(({ ore, percent }) => {
    const density = densityLookup[ore]
    return density * percent * FUDGE_FACTOR
  })
  const maxVolume = mass / propDensities.reduce((a, b) => a + b, 0)
  const volumes = ores.map(({ percent }) => maxVolume * percent)

  const byOrePromises = ores.map(async ({ ore }, idx) => {
    if (ore === ShipOreEnum.Inertmaterial) return null
    const oreVolume_SCU = volumes[idx]
    const oreVolume_cSCU = oreVolume_SCU * 100
    const refineCost = 0
    const yieldAmt = await yieldCalc(ds, oreVolume_cSCU, ore, RefineryEnum.Arcl1, RefineryMethodEnum.DinyxSolventation)
    const refinedPrice = await findPrice(ds, ore, null, true)
    const yieldBoxes = Math.ceil(yieldAmt / 100)
    const oreGrossValue = refinedPrice * yieldBoxes
    const oreNetProfit = oreGrossValue - refineCost
    rockValue += oreNetProfit
    rockVolume += oreVolume_SCU
    return {
      ore,
      details: {
        value: oreNetProfit,
        volume: oreVolume_SCU,
      },
    }
  })

  const byOreArray = await Promise.all(byOrePromises)

  const byOre = byOreArray.reduce(
    (acc, oreDetails) => {
      if (oreDetails === null) return acc
      return {
        ...acc,
        [oreDetails.ore]: oreDetails.details,
      }
    },
    {} as RockSummary['byOre']
  )

  return {
    rock: {
      value: rockValue,
      volume: rockVolume,
    },
    byOre,
  }
}

export async function clusterCalc(ds: DataStore, cluster: ScoutingFind): Promise<FindClusterSummary> {
  const { clusterType } = cluster
  const retVal: FindClusterSummary = {
    value: 0,
    volume: 0,
    byOre: {},
    byRock: [],
  }
  if (clusterType === ScoutingFindTypeEnum.Ship) {
    const { shipRocks } = cluster as ShipClusterFind
    const rockRef = shipRocks || []
    // Get the value of all rocks
    for (const shipRock of rockRef) {
      if (!shipRock) continue
      const rockCalc = await shipRockCalc(ds, shipRock)
      retVal.value += rockCalc.rock.value
      retVal.volume += rockCalc.rock.volume
      Object.entries(rockCalc.byOre).forEach(([ore, { value, volume }]) => {
        if (!retVal.byOre[ore]) {
          retVal.byOre[ore] = {
            value: 0,
            volume: 0,
          }
        }
        retVal.byOre[ore].value += value
        retVal.byOre[ore].volume += volume
      })
      retVal.byRock.push({
        value: rockCalc.rock.value,
        volume: rockCalc.rock.volume,
      })
    }
  } else if (clusterType === ScoutingFindTypeEnum.Vehicle) {
    const { vehicleRocks } = cluster as VehicleClusterFind
    const rockRef = vehicleRocks || []
    // Get the value of all rocks
    for (const { ores, mass } of rockRef) {
      let rockValue = 0
      let rockVolume = 0
      for (const { ore, percent } of ores) {
        if (!retVal.byOre[ore]) {
          retVal.byOre[ore] = {
            value: 0,
            volume: 0,
          }
        }
        // rock mass x mineralpercent / (density * 32 ) 32 is the "fudge factor" they put in.
        const oreMass = mass * percent
        const oreVolumeSCU = oreMass / 50 // NOTE: mass times percent divided by 50 is the way we get SCU. This seems pretty arbitrary so keep an eye on it
        const oreVolumecSCU = oreVolumeSCU * 100
        const price = await findPrice(ds, ore)
        const grossValue = (price * oreVolumecSCU) / 10 // conversion from mSCU back to SCU
        rockValue += grossValue
        rockVolume += oreVolumeSCU
        // 8250aUEC per rock(30 gems)
        // 8250aUEC / (275 * 100) = 0.3cSCU
        // 0.3 / 100 = 0.003 SCU
        // 0.003 * 50 = 0.15 mass
        retVal.byOre[ore].value += grossValue
        retVal.byOre[ore].volume += oreVolumeSCU
        retVal.value += grossValue
        retVal.volume += oreVolumeSCU
      }
      retVal.byRock.push({
        value: rockValue,
        volume: rockVolume,
      })
    }
  } else if (clusterType === ScoutingFindTypeEnum.Salvage) {
    const { wrecks } = cluster as SalvageFind
    retVal.value = wrecks.reduce((acc, wreck) => acc + (wreck.sellableAUEC || 0), 0)
    retVal.volume = 0

    const wreckRef = wrecks || []
    for (const wreck of wreckRef) {
      let wreckSCUSum = 0
      let wreckValueSum = 0
      for (const { ore, scu } of wreck.salvageOres) {
        if (!retVal.byOre[ore]) {
          retVal.byOre[ore] = {
            value: 0,
            volume: 0,
          }
        }
        const price = await findPrice(ds, ore)
        retVal.byOre[ore].volume += scu
        retVal.byOre[ore].value += price * scu

        wreckSCUSum += scu
        wreckValueSum += price * scu

        retVal.volume += scu
        retVal.value += price * scu
      }
      retVal.byRock.push({
        value: (wreck.sellableAUEC || 0) + wreckValueSum,
        volume: wreckSCUSum,
      })
    }
  }
  if (retVal.byOre) {
    retVal.oreSort = Object
      // Sort by value
      .entries(retVal.byOre)
      .sort(([, a], [, b]) => b.value - a.value)
      .map(([key]) => key as ShipOreEnum)
  }
  return retVal
}

/**
 * Calculates the payouts for each crew member
 * @param sellerName Name of the person paying so we don't include transfer fees for them
 * @param netProfit
 * @param crewShares
 * @returns an array of payouts, one for each crew member entered
 */
export function crewSharePayouts(
  sellerName: string,
  netProfit: number,
  crewShares: CrewShare[],
  includeTransferFees = true
): CrewSharePayout {
  const idxMap: [number, CrewShare][] = crewShares.map((cs, idx) => [idx, cs])

  const payClasses: Record<ShareTypeEnum, [number, CrewShare][]> = {
    [ShareTypeEnum.Amount]: idxMap.filter(([, { shareType }]) => shareType === ShareTypeEnum.Amount),
    [ShareTypeEnum.Percent]: idxMap.filter(([, { shareType }]) => shareType === ShareTypeEnum.Percent),
    [ShareTypeEnum.Share]: idxMap.filter(([, { shareType }]) => shareType === ShareTypeEnum.Share),
  }
  const retVal = new Array(crewShares.length).fill(0)
  // We subtract off the transfer fees from the net profit
  let transferFees = 0

  const owed: OwedPaid = {}
  const paid: OwedPaid = {}

  const payOrOwed = (scName: string, amt: number, isPayed: boolean) => {
    const payObj = isPayed ? paid : owed
    if (!payObj[sellerName]) payObj[sellerName] = {}
    if (!payObj[sellerName][scName]) payObj[sellerName][scName] = 0
    payObj[sellerName][scName] += amt
  }

  // First we pay out the constant amounts
  const afterPayouts = payClasses[ShareTypeEnum.Amount].reduce((acc, [idx, { share, payeeScName, state }]) => {
    const isMe = payeeScName === sellerName
    const transferFee = includeTransferFees && !isMe ? TRANSFER_FEES * share : 0
    retVal[idx] = [share, share, transferFee]
    transferFees += transferFee
    // We subtract off the transfer fee as well for constant amounts so that
    // the recipient gets exactly what they expect. The transfer fee is absorbed by the
    // Percent and Share types
    if (share > 0) payOrOwed(payeeScName, share, isMe || state)
    return acc - share - transferFee
  }, netProfit)

  // What's left is split up by percents
  let afterPercents = 0
  if (afterPayouts < 0) {
    afterPercents = afterPayouts
    // If there's nothing left then nobody gets nuthin
    payClasses[ShareTypeEnum.Percent].forEach(([idx]) => {
      retVal[idx] = [0, 0, 0]
    })
  } else {
    afterPercents = payClasses[ShareTypeEnum.Percent].reduce((acc, [idx, { share, payeeScName, state }]) => {
      const isMe = payeeScName === sellerName
      const rawShare = afterPayouts * share
      const transferFee = includeTransferFees && !isMe ? TRANSFER_FEES * rawShare : 0
      retVal[idx] = [rawShare, rawShare - transferFee, transferFee]
      transferFees += transferFee
      if (retVal[idx][1] > 0) payOrOwed(payeeScName, retVal[idx][1], isMe || state)
      return acc - rawShare
    }, afterPayouts)
  }

  // The shareholders get the rest. If there is a remainder, this goes to the remaineder field
  let totalShares = payClasses[ShareTypeEnum.Share].reduce((acc, [, { share }]) => acc + share, 0)
  // Avoid divide by zero
  if (totalShares === 0) totalShares = 1
  // Calculate the shares
  let afterShares = 0
  if (afterPercents < 0) {
    afterShares = afterPercents
    payClasses[ShareTypeEnum.Share].forEach(([idx]) => {
      retVal[idx] = [0, 0, 0]
    })
  } else {
    afterShares = payClasses[ShareTypeEnum.Share].reduce((acc, [idx, { share, payeeScName, state }]) => {
      const isMe = payeeScName === sellerName
      const rawShare = (afterPercents * share) / totalShares
      if (rawShare < 0) {
        retVal[idx] = [0, 0, 0]
        return acc - rawShare
      } else {
        const transferFee = includeTransferFees && !isMe ? TRANSFER_FEES * rawShare : 0
        transferFees += transferFee
        retVal[idx] = [rawShare, rawShare - transferFee, transferFee]
        if (retVal[idx][1] > 0) payOrOwed(payeeScName, retVal[idx][1], isMe || state)
        return acc - rawShare
      }
    }, afterPercents)
  }
  const allPaid = crewShares.reduce((acc, { state: paid }) => acc && paid, true)

  return {
    allPaid,
    owed,
    paid,
    payouts: retVal,
    transferFees,
    remainder: jsRound(afterShares, 0),
  }
}

/**
 * Given a yield, ore, refinery, and method, calculate the amount of ore that went into the process
 * @param oreYield
 * @param ore
 * @param refinery
 * @param method
 * @returns
 */
export async function oreAmtCalc(
  ds: DataStore,
  oreYield: number,
  ore: ShipOreEnum,
  refinery: RefineryEnum,
  method: RefineryMethodEnum
): Promise<number> {
  const [oreProcessingLookup, refineryBonusLookup, methodsBonusLookup] = await Promise.all([
    ds.getLookup('oreProcessingLookup'),
    ds.getLookup('refineryBonusLookup'),
    ds.getLookup('methodsBonusLookup'),
  ])
  let processingBonus = 1
  let refineryBonus = 1
  let methodBonus = 1
  if (!refineryBonusLookup[refinery]) log.debug(`oreAmtCalc: Refinery ${refinery} not found`)
  else if (!refineryBonusLookup[refinery][ore]) log.debug(`oreAmtCalc: Refinery ore ${refinery} ${ore} not found`)
  else {
    refineryBonus = refineryBonusLookup[refinery][ore][0]
  }

  if (!methodsBonusLookup[method]) log.debug(`oreAmtCalc: Method ${method} not found`)
  else {
    methodBonus = methodsBonusLookup[method][0]
  }

  if (!oreProcessingLookup[ore]) log.debug(`oreAmtCalc: Ore ${ore} not found`)
  else {
    processingBonus = oreProcessingLookup[ore][0]
  }

  const finalOreYield = oreYield / (processingBonus * refineryBonus * methodBonus)
  return Math.round(finalOreYield)
}

/**
 *
 * @param oreAmt this is in cSCU
 * @param ore
 * @param refinery
 * @param method
 * @returns
 */
export async function yieldCalc(
  ds: DataStore,
  oreAmt: number,
  ore: ShipOreEnum,
  refinery: RefineryEnum,
  method: RefineryMethodEnum
): Promise<number> {
  const [oreProcessingLookup, refineryBonusLookup, methodsBonusLookup] = await Promise.all([
    ds.getLookup('oreProcessingLookup'),
    ds.getLookup('refineryBonusLookup'),
    ds.getLookup('methodsBonusLookup'),
  ])
  let processingBonus = 1
  let refineryBonus = 1
  let methodBonus = 1
  if (!refineryBonusLookup[refinery]) log.debug(`yieldCalc: Refinery ${refinery} not found`)
  else if (!refineryBonusLookup[refinery][ore]) log.debug(`yieldCalc: Refinery ore ${refinery} ${ore} not found`)
  else {
    refineryBonus = refineryBonusLookup[refinery][ore][0]
  }

  if (!methodsBonusLookup[method]) log.debug(`yieldCalc: Method ${method} not found`)
  else {
    methodBonus = methodsBonusLookup[method][0]
  }
  if (!oreProcessingLookup[ore]) log.debug(`yieldCalc: Ore ${ore} not found`)
  else {
    processingBonus = oreProcessingLookup[ore][0]
  }

  return oreAmt * processingBonus * refineryBonus * methodBonus
}

/**
 * Figures out the modifier for the yield you get from a refinery
 * @param ore
 * @param refinery
 * @param method
 * @returns
 */
export async function yieldModCalc(
  ds: DataStore,
  ore: ShipOreEnum,
  refinery: RefineryEnum,
  method: RefineryMethodEnum
): Promise<number> {
  const [refineryBonusLookup, methodsBonusLookup] = await Promise.all([
    ds.getLookup('refineryBonusLookup'),
    ds.getLookup('methodsBonusLookup'),
  ])

  return refineryBonusLookup[refinery][ore][0] * methodsBonusLookup[method][0]
}

/**
 * Calculates the cost in aUEC to refine ore
 * @param amt cSCU initial amount of ore to be processed
 * @param ore
 * @param refinery
 * @param method
 * @returns total cost in aUEC (unrounded)
 * Translate the ores dictionary into a useful, sorted ores array we can store in the db
 */
export async function getRefiningCost(
  ds: DataStore,
  amt: number,
  ore: ShipOreEnum,
  refinery: RefineryEnum,
  method: RefineryMethodEnum
) {
  const [oreProcessingLookup, refineryBonusLookup, methodsBonusLookup] = await Promise.all([
    ds.getLookup('oreProcessingLookup'),
    ds.getLookup('refineryBonusLookup'),
    ds.getLookup('methodsBonusLookup'),
  ])
  const refBonus =
    refineryBonusLookup[refinery] && refineryBonusLookup[refinery][ore] ? refineryBonusLookup[refinery][ore][2] : 1
  const oreCost = oreProcessingLookup[ore][2]
  const methodBonus = methodsBonusLookup[method][2]
  return amt * refBonus * oreCost * methodBonus
}

export async function getRefiningCostMod(
  ds: DataStore,
  ore: ShipOreEnum,
  refinery: RefineryEnum,
  method: RefineryMethodEnum
) {
  const [refineryBonusLookup, methodsBonusLookup] = await Promise.all([
    ds.getLookup('refineryBonusLookup'),
    ds.getLookup('methodsBonusLookup'),
  ])
  const refBonus =
    refineryBonusLookup[refinery] && refineryBonusLookup[refinery][ore] ? refineryBonusLookup[refinery][ore][2] : 1
  const methodBonus = methodsBonusLookup[method][2]
  return refBonus * methodBonus
}

/**
 * Calculates the time in ms to refine ore
 * @param amt cSCU initial amount of ore to be processed
 * @param ore
 * @param refinery
 * @param method
 * @returns total time in ms
 */
export async function getRefiningTime(
  ds: DataStore,
  amt: number,
  ore: ShipOreEnum,
  refinery: RefineryEnum,
  method: RefineryMethodEnum
) {
  const [oreProcessingLookup, refineryBonusLookup, methodsBonusLookup] = await Promise.all([
    ds.getLookup('oreProcessingLookup'),
    ds.getLookup('refineryBonusLookup'),
    ds.getLookup('methodsBonusLookup'),
  ])
  if (!oreProcessingLookup[ore] || !methodsBonusLookup[method]) return NaN
  const refBonus =
    refineryBonusLookup[refinery] && refineryBonusLookup[refinery][ore] ? refineryBonusLookup[refinery][ore][1] : 1
  const oreTime = oreProcessingLookup[ore][1]
  const methodBonus = methodsBonusLookup[method][1]

  // =if(ISNUMBER(L9),L9*VLOOKUP(A9,ORES,3,FALSE)*VLOOKUP(C9,METHODS,4, FALSE)*VLOOKUP(B9&"::"&A9,BONUSES,3,FALSE)/(3600*24), "")
  return Math.round(amt * refBonus * oreTime * methodBonus * 1000)
}

export async function getRefiningTimeMod(
  ds: DataStore,
  ore: ShipOreEnum,
  refinery: RefineryEnum,
  method: RefineryMethodEnum
) {
  const [refineryBonusLookup, methodsBonusLookup] = await Promise.all([
    ds.getLookup('refineryBonusLookup'),
    ds.getLookup('methodsBonusLookup'),
  ])

  const refBonus =
    refineryBonusLookup[refinery] && refineryBonusLookup[refinery][ore] ? refineryBonusLookup[refinery][ore][1] : 1
  const methodBonus = methodsBonusLookup[method][1]

  return refBonus * methodBonus
}

/**
 * Just a helper function to call the correct calculation function based on the order type
 * @param order
 * @returns
 */
export async function calculateWorkOrder(ds: DataStore, order: WorkOrder): Promise<WorkOrderSummary> {
  switch (order.orderType) {
    case ActivityEnum.ShipMining:
      return await calculateShipOrder(ds, order as ShipMiningOrder)
    case ActivityEnum.VehicleMining:
      return await calculateVehicleOrder(ds, order as VehicleMiningOrder)
    case ActivityEnum.Salvage:
      return await calculateSalvageOrder(ds, order as SalvageOrder)
    case ActivityEnum.Other:
      return await calculateOtherOrder(ds, order as OtherOrder)
    default:
      throw new Error('Invalid order type')
  }
}

/**
 * Calculate all the costs and payputs for a workorder
 * @param order
 * @returns
 */
export async function calculateShipOrder(ds: DataStore, order: ShipMiningOrder): Promise<WorkOrderSummary> {
  // first calculate the value of the ore
  let refinedValue = 0
  const ores = order.shipOres || []
  const crewShares = order.crewShares || []
  let yieldSCU = 0

  if (order.isRefined) {
    if (!order.owner) throw new Error('Owner is required for a work order')
    if (!order.refinery) throw new Error(`Refinery is required for a refined order. order: ${JSON.stringify(order)}`)
    if (!order.method) throw new Error(`Method is required for a refined order. order: ${JSON.stringify(order)}`)
  }

  const oreSummary = ores.reduce(
    (acc, { ore, amt }) => {
      acc[ore] = { collected: amt, refined: 0, isRefined: order.isRefined }
      return acc
    },
    {} as WorkOrderSummary['oreSummary']
  )

  const orePromises = ores.map(async ({ amt, ore }) => {
    const finalStore = order.shareRefinedValue ? order.sellStore : null
    const price = await findPrice(ds, ore, finalStore, false)
    const finalBoxes = Math.ceil(amt / 100)
    return price * finalBoxes
  })

  const oreValues = await Promise.all(orePromises)

  const unrefinedValue = oreValues.reduce((acc, value) => acc + value, 0)

  // let refiningTime = 0

  let finalSellStore = null
  const expensesValue = totalExpenses(order)
  let lossValue = 0
  const bestSeller = await findAllStoreChoices(ds, oreSummary, order.isRefined, true)
  try {
    finalSellStore = order.sellStore || bestSeller[0].code || null
  } catch {
    // Do nothing
  }

  // If this is a refining job then go the extra mile
  if (order.isRefined) {
    // refiningTime = calculateRefiningTime(ores, order.refinery, order.method)
    // refiningCost = calculateRefiningCost(ores, order.refinery, order.method)

    // Note that if the user has used the profit field then we don't want to overwrite it
    const { refinedValue: calcRefined, refinedYieldSCU } = await calculateRefinedValue(
      ds,
      ores,
      order.refinery,
      order.method,
      finalSellStore,
      oreSummary
    )
    refinedValue = calcRefined
    yieldSCU += refinedYieldSCU
  } else {
    yieldSCU = ores.reduce((acc, { amt }) => acc + Math.ceil(amt / 100), 0)
  }
  let finalShareAmt = 0
  let grossValue = 0
  if (order.state !== WorkOrderStateEnum.Failed) {
    if (order.isRefined && !order.shareRefinedValue) {
      finalShareAmt = unrefinedValue
    } else if (order.shareAmount && order.shareAmount >= -1)
      finalShareAmt = !order.isRefined || order.shareRefinedValue ? order.shareAmount : unrefinedValue
    else finalShareAmt = order.isRefined ? (order.shareRefinedValue ? refinedValue : unrefinedValue) : unrefinedValue
    grossValue = finalShareAmt
  } else {
    if (order.shareAmount && order.shareAmount >= -1)
      lossValue = !order.isRefined || order.shareRefinedValue ? order.shareAmount : unrefinedValue
    else lossValue = order.isRefined ? (order.shareRefinedValue ? refinedValue : unrefinedValue) : unrefinedValue
  }
  // Here we are subtracting the expenses from the share amount
  finalShareAmt -= expensesValue
  const ownerReimbursements =
    order.expenses?.reduce(
      (acc, exp) => {
        acc[exp.ownerScName] = (acc[exp.ownerScName] || 0) + exp.amount
        return acc
      },
      {} as Record<string, number>
    ) || {}

  const { payouts, transferFees, remainder, allPaid, owed, paid } = crewSharePayouts(
    order.sellerscName || order.owner.scName,
    finalShareAmt,
    crewShares,
    order.includeTransferFee
  )

  for (const [scName, amount] of Object.entries(ownerReimbursements)) {
    const idx = crewShares.findIndex((cs) => cs.payeeScName === scName)
    if (idx > -1) {
      payouts[idx][0] += amount // pre-fee total
      payouts[idx][1] += amount // post-fee net
    } else {
      // Optional: handle reimbursements for non-crew members if needed
    }
  }

  // If we're sharing the unrefined value then add the difference to the job owner
  const myIdx = crewShares.findIndex((share) => share.payeeScName === order.owner.scName)
  if (myIdx > -1 && order.isRefined && !order.shareRefinedValue) {
    // Make sure to add the amount BEFORE subtracting the transfer fee
    let refinedUnrefinedDiff = refinedValue - unrefinedValue
    if (order.shareAmount && order.shareAmount >= -1) {
      refinedUnrefinedDiff = order.shareAmount - unrefinedValue
    }
    payouts[myIdx][0] += refinedUnrefinedDiff
    payouts[myIdx][1] += refinedUnrefinedDiff
  }

  // Now that we're done manipulating the payouts we can summarize the payouts in a
  // dictionary for convenience
  const payoutSummary = crewShares.reduce(
    (acc, { payeeScName }, idx) => {
      if (!acc[payeeScName]) acc[payeeScName] = [0, 0, 0]
      acc[payeeScName][0] += payouts[idx][0]
      acc[payeeScName][1] += payouts[idx][1]
      acc[payeeScName][2] += payouts[idx][2]
      return acc
    },
    {} as WorkOrderSummary['payoutSummary']
  )

  // The amount the owner needs to transfer to other people (Not including transfer fees)
  const payoutsTotal = Object.entries(payoutSummary)
    .filter(([scName]) => scName !== order.owner.scName)
    .reduce((acc, [, val]) => acc + val[0], 0)
  const refiningTime = (order.processDurationS || 0) * 1000
  const { remainingTime, completionTime } = calculateDoneTime(order.processStartTime, refiningTime, order.isRefined)

  return {
    allPaid,
    sellerScName: order.seller?.scName || order.sellerscName || order.owner.scName,
    calculatedState: calculatedOrderState(
      order.state,
      order.orderType,
      order.isRefined,
      allPaid,
      order.processStartTime,
      remainingTime
    ),
    owed,
    paid,
    oreSummary,
    yieldSCU,
    remainder,
    crewShareSummary: payouts,
    payoutSummary,
    transferFees,
    refiningTime,
    completionTime,
    refinedValue,
    unrefinedValue,
    payoutsTotal,
    expensesValue,
    lossValue,
    shareAmount: finalShareAmt,
    grossValue,
  }
}
export async function calculateVehicleOrder(ds: DataStore, order: VehicleMiningOrder): Promise<WorkOrderSummary> {
  // first calculate the value of the ore
  const haul = order.vehicleOres || []
  const crewShares = order.crewShares || []
  let yieldSCU = 0

  const oreSummary = haul.reduce(
    (acc, { ore, amt }) => {
      // NOTE: That we store mSCU for vehicles so there are some tricky factor of 10 conversions
      acc[ore] = { collected: amt / 10, refined: 0, isRefined: false }
      yieldSCU += amt / 1000
      return acc
    },
    {} as WorkOrderSummary['oreSummary']
  )

  // Calculate total profit from the sale
  // NOTE: That we store mSCU for vehicles so there are some tricky factor of 10 conversions
  const profitPromises = Object.entries(oreSummary).map(async ([ore, amt]) => {
    const price = await findPrice(ds, ore as VehicleOreEnum, order.sellStore)
    return (amt.collected * price) / 100
  })

  const profits = await Promise.all(profitPromises)

  let grossProfit = profits.reduce((acc, profit) => acc + profit, 0)

  let finalShareAmt = 0
  const expensesValue = totalExpenses(order)
  let lossValue = 0
  if (order.state !== WorkOrderStateEnum.Failed) {
    if (order.shareAmount && order.shareAmount >= 0) finalShareAmt = order.shareAmount
    else finalShareAmt = grossProfit
  } else {
    if (order.shareAmount && order.shareAmount >= 0) lossValue = order.shareAmount
    else lossValue = grossProfit
    grossProfit = 0
  }

  finalShareAmt -= expensesValue

  const { payouts, transferFees, remainder, allPaid, owed, paid } = crewSharePayouts(
    order.sellerscName || order.owner.scName,
    finalShareAmt,
    crewShares,
    order.includeTransferFee
  )
  const payoutSummary = crewShares.reduce(
    (acc, { payeeScName }, idx) => {
      if (!acc[payeeScName]) acc[payeeScName] = [0, 0, 0]
      // Before transfer
      acc[payeeScName][0] += payouts[idx][0]
      // After transfer
      acc[payeeScName][1] += payouts[idx][1]
      // Transfer fee
      acc[payeeScName][2] += payouts[idx][2]
      return acc
    },
    {} as WorkOrderSummary['payoutSummary']
  )

  // The amount the owner needs to transfer to other people (Not including transfer fees)
  const payoutsTotal = Object.entries(payoutSummary)
    .filter(([scName]) => scName !== order.owner.scName)
    .reduce((acc, [, val]) => acc + val[0], 0)

  return {
    allPaid,
    sellerScName: order.sellerscName || order.owner.scName,
    calculatedState: calculatedOrderState(order.state, order.orderType, false, allPaid),
    oreSummary,
    yieldSCU,
    payoutSummary,
    owed,
    paid,
    remainder,
    crewShareSummary: payouts,
    transferFees,
    payoutsTotal,
    lossValue,
    expensesValue,
    grossValue: grossProfit,
    shareAmount: finalShareAmt,
  }
}
export async function calculateSalvageOrder(ds: DataStore, order: SalvageOrder): Promise<WorkOrderSummary> {
  // first calculate the value of the ore

  const haul = order.salvageOres || []
  const crewShares = order.crewShares || []
  let yieldSCU = 0

  const oreSummary = haul.reduce(
    (acc, { ore, amt }) => {
      acc[ore] = { collected: amt, refined: 0, isRefined: false }
      yieldSCU += amt / 100
      return acc
    },
    {} as WorkOrderSummary['oreSummary']
  )

  // Calculate total profit from the sale
  const profitPromises = Object.entries(oreSummary).map(async ([ore, amt]) => {
    const price = await findPrice(ds, ore as SalvageOreEnum, order.sellStore)
    return (amt.collected * price) / 100
  })

  const profits = await Promise.all(profitPromises)

  let grossProfit = profits.reduce((acc, profit) => acc + profit, 0)
  let finalShareAmt = 0
  const expensesValue = totalExpenses(order)
  let lossValue = 0
  if (order.state !== WorkOrderStateEnum.Failed) {
    if (order.shareAmount && order.shareAmount >= 0) finalShareAmt = order.shareAmount
    else finalShareAmt = grossProfit
  } else {
    if (order.shareAmount && order.shareAmount >= 0) lossValue = order.shareAmount
    else lossValue = grossProfit
    grossProfit = 0
  }
  finalShareAmt -= expensesValue

  const { payouts, transferFees, remainder, allPaid, owed, paid } = crewSharePayouts(
    order.sellerscName || order.owner.scName,
    finalShareAmt,
    crewShares,
    order.includeTransferFee
  )
  const payoutSummary = crewShares.reduce(
    (acc, { payeeScName }, idx) => {
      if (!acc[payeeScName]) acc[payeeScName] = [0, 0, 0]
      acc[payeeScName][0] += payouts[idx][0]
      acc[payeeScName][1] += payouts[idx][1]
      acc[payeeScName][2] += payouts[idx][2]
      return acc
    },
    {} as WorkOrderSummary['payoutSummary']
  )

  // The amount the owner needs to transfer to other people (Not including transfer fees)
  const payoutsTotal = Object.entries(payoutSummary)
    .filter(([scName]) => scName !== order.owner.scName)
    .reduce((acc, [, val]) => acc + val[0], 0)

  return {
    allPaid,
    sellerScName: order.sellerscName || order.owner.scName,
    calculatedState: calculatedOrderState(order.state, order.orderType, false, allPaid),
    oreSummary,
    yieldSCU,
    payoutSummary,
    owed,
    paid,
    remainder,
    crewShareSummary: payouts,
    transferFees,
    payoutsTotal,
    expensesValue,
    lossValue,
    grossValue: grossProfit,
    shareAmount: finalShareAmt,
  }
}

export function totalExpenses(order: WorkOrder): number {
  const expenses = order.expenses || []
  return expenses.reduce((acc, { amount }) => acc + amount, 0)
}

export async function calculateOtherOrder(ds: DataStore, order: OtherOrder): Promise<WorkOrderSummary> {
  // first calculate the value of the ore
  const grossProfit = order.state === WorkOrderStateEnum.Failed ? 0 : order.shareAmount || 0
  const yieldSCU = 0
  let shareAmount = grossProfit
  const crewShares = order.crewShares || []
  const expensesValue = totalExpenses(order)
  const lossValue = order.state !== WorkOrderStateEnum.Failed ? 0 : order.shareAmount || 0

  shareAmount -= expensesValue
  const { payouts, transferFees, remainder, allPaid, owed, paid } = crewSharePayouts(
    order.sellerscName || order.owner.scName,
    shareAmount,
    crewShares,
    order.includeTransferFee
  )
  const payoutSummary = crewShares.reduce(
    (acc, { payeeScName }, idx) => {
      if (!acc[payeeScName]) acc[payeeScName] = [0, 0, 0]
      acc[payeeScName][0] += payouts[idx][0]
      acc[payeeScName][1] += payouts[idx][1]
      acc[payeeScName][2] += payouts[idx][2]
      return acc
    },
    {} as WorkOrderSummary['payoutSummary']
  )

  // The amount the owner needs to transfer to other people (Not including transfer fees)
  const payoutsTotal = Object.entries(payoutSummary)
    .filter(([scName]) => scName !== order.owner.scName)
    .reduce((acc, [, val]) => acc + val[0], 0)

  return {
    allPaid,
    sellerScName: order.sellerscName || order.owner.scName,
    calculatedState: calculatedOrderState(order.state, order.orderType, false, allPaid),
    oreSummary: {},
    yieldSCU,
    payoutSummary,
    owed,
    paid,
    remainder,
    crewShareSummary: payouts,
    transferFees,
    payoutsTotal,
    expensesValue,
    lossValue,
    grossValue: grossProfit,
    shareAmount: shareAmount,
  }
}

/**
 * Get a summary of the session
 * @param orders
 * @returns
 */
export async function sessionReduce(ds: DataStore, orders: WorkOrderInterface[]): Promise<SessionBreakdown> {
  const orderBreakdowns: Record<string, WorkOrderSummary> = {}
  const oreSummary: OreSummary = {}
  let rawOreCollected = 0
  let lastFinishedOrder = null

  let shareAmount = 0
  let grossValue = 0
  let expensesValue = 0
  let lossValue = 0
  let yieldSCU = 0

  for (const order of orders) {
    let orderBreakdown: WorkOrderSummary = {
      calculatedState: WorkOrderStateEnum.Unknown,
      allPaid: false,
      sellerScName: order.sellerscName || order.owner.scName,
      payoutSummary: {},
      owed: {},
      paid: {},
      remainder: 0,
      crewShareSummary: [],
      oreSummary: {},
      yieldSCU: 0,
      transferFees: 0,
      refiningTime: 0,
      unrefinedValue: 0,
      payoutsTotal: 0,
      refinedValue: 0,
      remainingTime: 0,
      completionTime: 0,
      shareAmount: 0,
      expensesValue: 0,
      lossValue: 0,
      grossValue: 0,
    }
    if (order.orderType === ActivityEnum.ShipMining) {
      orderBreakdown = await calculateShipOrder(ds, order as ShipMiningOrder)
      if ((orderBreakdown.completionTime && !lastFinishedOrder) || lastFinishedOrder < orderBreakdown.completionTime)
        lastFinishedOrder = orderBreakdown.completionTime
    } else if (order.orderType === ActivityEnum.VehicleMining)
      orderBreakdown = await calculateVehicleOrder(ds, order as VehicleMiningOrder)
    else if (order.orderType === ActivityEnum.Salvage)
      orderBreakdown = await calculateSalvageOrder(ds, order as SalvageOrder)
    else if (order.orderType === ActivityEnum.Other) orderBreakdown = await calculateOtherOrder(ds, order as OtherOrder)

    if (orderBreakdown?.oreSummary) {
      Object.entries(orderBreakdown.oreSummary).forEach(([ore, { collected, isRefined, refined }]) => {
        if (!oreSummary[ore]) oreSummary[ore] = { collected: 0, refined: 0, isRefined: isRefined }
        oreSummary[ore].collected += collected
        rawOreCollected += collected
        oreSummary[ore].refined += refined
      })
      yieldSCU += orderBreakdown?.yieldSCU || 0
    }
    orderBreakdowns[order.orderId] = orderBreakdown

    shareAmount += orderBreakdown.shareAmount
    grossValue += orderBreakdown.grossValue
    expensesValue += orderBreakdown.expensesValue
    lossValue += orderBreakdown.lossValue
  }

  const payoutSummary = Object.values(orderBreakdowns).reduce(
    (acc, { payoutSummary }) => {
      Object.keys(payoutSummary).forEach((scName) => {
        if (!acc[scName]) acc[scName] = [0, 0, 0]
        acc[scName][0] += payoutSummary[scName][0]
        acc[scName][1] += payoutSummary[scName][1]
        acc[scName][2] += payoutSummary[scName][2]
      })
      return acc
    },
    {} as WorkOrderSummary['payoutSummary']
  )

  return {
    allPaid: Object.values(orderBreakdowns).every(({ allPaid }) => allPaid),
    orderBreakdowns: orderBreakdowns,
    transferFees: Object.values(orderBreakdowns).reduce((acc, { transferFees }) => acc + transferFees, 0),
    payoutSummary,
    // We need to combine the objects from each owed object inside orderBreakdowns
    owed: Object.values(orderBreakdowns).reduce((acc, { owed }) => {
      Object.keys(owed).forEach((payeeName) => {
        const innerObj = owed[payeeName]
        Object.keys(innerObj).forEach((scName) => {
          if (!acc[payeeName]) acc[payeeName] = {}
          if (!acc[payeeName][scName]) acc[payeeName][scName] = 0
          acc[payeeName][scName] += innerObj[scName]
        })
      })
      return acc
    }, {} as OwedPaid),
    paid: Object.values(orderBreakdowns).reduce((acc, { paid }) => {
      Object.keys(paid).forEach((payeeName) => {
        const innerObj = paid[payeeName]
        Object.keys(innerObj).forEach((scName) => {
          if (!acc[payeeName]) acc[payeeName] = {}
          if (!acc[payeeName][scName]) acc[payeeName][scName] = 0
          acc[payeeName][scName] += innerObj[scName]
        })
      })
      return acc
    }, {} as OwedPaid),
    oreSummary,
    rawOreCollected,
    lastFinishedOrder,
    shareAmount,
    yieldSCU,
    grossValue,
    expensesValue,
    lossValue,
    payoutsTotal: Object.values(orderBreakdowns).reduce((acc, { payoutsTotal }) => acc + payoutsTotal, 0),
    unrefinedValue: Object.values(orderBreakdowns).reduce((acc, { unrefinedValue }) => acc + unrefinedValue, 0),
    refinedValue: Object.values(orderBreakdowns).reduce((acc, { refinedValue }) => acc + refinedValue, 0),
  }
}

// TODO: CHANGE ME
export function calculateDoneTime(
  processStartTime: number,
  refiningTime: number,
  isRefined: boolean
): { remainingTime: number; completionTime: number } {
  let remainingTime
  let completionTime
  if (!processStartTime || !refiningTime || !isRefined) return { remainingTime: 0, completionTime: 0 }
  if (isRefined && processStartTime) {
    // The timestamp when we expect the job to be completed
    completionTime = (processStartTime as number) + (refiningTime as number)
    // The time remaining in ms
    remainingTime = completionTime - Date.now()
    if (remainingTime < 0) remainingTime = 0
  }
  return { remainingTime, completionTime }
}

export async function calculateRefinedValue(
  ds: DataStore,
  ores: RefineryRow[],
  refinery: RefineryEnum,
  method: RefineryMethodEnum,
  storeCode?: string,
  oreSummary?: OreSummary
): Promise<{ refinedValue: number; refinedYieldSCU: number }> {
  if (!ores || !ores.length || !refinery || !method) return { refinedValue: 0, refinedYieldSCU: 0 }
  let refinedYieldSCU = 0
  const orePromises = ores.map(async ({ amt, ore }) => {
    if (Object.values(ShipOreEnum).includes(ore as unknown as ShipOreEnum)) {
      const oreYld = await yieldCalc(ds, amt, ore as unknown as ShipOreEnum, refinery, method)
      if (oreSummary) {
        if (!oreSummary[ore]) oreSummary[ore] = { collected: 0, refined: 0, isRefined: true }
        oreSummary[ore].collected = amt
        oreSummary[ore].refined = oreYld
        refinedYieldSCU += Math.ceil(oreYld / 100)
      }
      const refinedPrice = await findPrice(ds, ore, storeCode, true)
      const oreYldSCU = Math.ceil(oreYld / 100)
      return oreYldSCU * refinedPrice
    }
    const unrefinedPrice = await findPrice(ds, ore, storeCode)
    const oreYldSCU = Math.ceil(amt / 100)
    return oreYldSCU * unrefinedPrice
  })

  const oreValues = await Promise.all(orePromises)

  const refinedValue = oreValues.reduce((acc, value) => acc + value, 0)
  if (isNaN(refinedValue)) return { refinedValue: 0, refinedYieldSCU: 0 }
  return { refinedValue, refinedYieldSCU }
}

export function calculatedOrderState(
  startState: WorkOrderStateEnum,
  orderType: ActivityEnum,
  isRefined: boolean,
  allPaid: boolean,
  processStartTime?: number,
  processDurationS?: number,
  remainingTime?: number
): WorkOrderStateEnum {
  // DONE
  // FAILED
  // RefiningStarted
  // RefiningComplete
  // UNKNOWN

  // Fail trumps everything else
  if (startState === WorkOrderStateEnum.Failed) return WorkOrderStateEnum.Failed

  // Next we've got two refinery states
  if (orderType === ActivityEnum.ShipMining && isRefined) {
    // If there's time left then this thing is refining
    // TODO: CHANGE ME
    if (processStartTime && remainingTime > 0) {
      return WorkOrderStateEnum.RefiningStarted
    }
    // If there's no time left and the order is paid then it's done
    // otherwise it's refining complete
    else if (processStartTime && remainingTime <= 0) {
      if (allPaid) return WorkOrderStateEnum.Done
      else return WorkOrderStateEnum.RefiningComplete
    } else {
      return WorkOrderStateEnum.Unknown
    }
  }
  // Not a ship order so the only states we have access to are Done, and Unknown
  else {
    // if it's paid then that's the most important thing
    if (allPaid) return WorkOrderStateEnum.Done
    else return WorkOrderStateEnum.Unknown
  }
}

/**
 *
 * @param ore
 * @param priceType
 * @param storeCode
 * @returns [price, storeCode[]]
 */
export async function findPrice(
  ds: DataStore,
  ore: AnyOreEnum,
  storeCode?: string,
  refined?: boolean
): Promise<number> {
  // If we have a store code then just find the max price
  let priceType = 'oreRaw'

  if (Object.values(ShipOreEnum).includes(ore as ShipOreEnum)) priceType = refined ? 'oreRefined' : 'oreRaw'
  else if (Object.values(VehicleOreEnum).includes(ore as VehicleOreEnum)) priceType = 'gems'
  else if (Object.values(SalvageOreEnum).includes(ore as SalvageOreEnum)) priceType = 'salvage'
  let price = 0

  const [priceLookups, tradeportLookups] = await Promise.all([
    ds.getLookup('priceStatsLookups'),
    ds.getLookup('tradeportLookups'),
  ])

  try {
    if (!storeCode) {
      if (!priceLookups || !priceLookups[priceType] || !priceLookups[priceType][ore]) return 0
      price = priceLookups[priceType][ore].max[0]
    } else {
      // Store prices can be a string or an array of strings separated by commas
      const storeCodeArr = storeCode ? storeCode.split(',').map((s) => s.trim()) : null

      const foundStores: UEXTradeport[] = storeCodeArr
        .map((scode) => tradeportLookups.find(({ code }) => code === scode.trim()))
        .filter((x) => x)
      if (!foundStores) return 0
      // find the maximum price
      const prices: number[] = foundStores.map((store) => store.prices[priceType][ore] as number).filter((x) => x > 0)
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
      if (!maxPrice) return 0
      price = maxPrice || 0
    }
    return jsRound(price, 0)
  } catch (e) {
    log.error(`Error finding price for ${ore} ${priceType} ${storeCode}`, e)
    return 0
  }
}

/**
 *
 * @param ores
 * @param isRefined
 * @returns
 */
export async function findAllStoreChoices(
  ds: DataStore,
  ores: OreSummary,
  isRefined?: boolean,
  isShipOrder?: boolean
): Promise<StoreChoice[]> {
  const tradeports = await ds.getLookup('tradeportLookups')
  if (!tradeports || tradeports.length === 0) return []
  const retVal: StoreChoice[] = tradeports.map<StoreChoice>(
    ({ system, planet, satellite, city, code, name, name_short, prices }) => {
      const orePrices: Partial<Record<AnyOreEnum, number>> = Object.entries(ores).reduce(
        (acc, [ore, { collected, refined }]) => {
          let priceType = 'oreRaw'
          if (Object.values(ShipOreEnum).includes(ore as ShipOreEnum)) priceType = refined ? 'oreRefined' : 'oreRaw'
          else if (Object.values(VehicleOreEnum).includes(ore as VehicleOreEnum)) priceType = 'gems'
          else if (Object.values(SalvageOreEnum).includes(ore as SalvageOreEnum)) priceType = 'salvage'

          const orePrice = prices[priceType][ore]
          if (!orePrice) return acc
          const finalBoxAmt = isShipOrder
            ? Math.ceil((isRefined ? refined : collected) / 100)
            : (isRefined ? refined : collected) / 100
          const finalPrice = (orePrice || 0) * finalBoxAmt
          acc[ore] = jsRound(finalPrice, 0)
          return acc
        },
        {} as Partial<Record<AnyOreEnum, number>>
      )
      const totalPrice = Object.values(orePrices).reduce((acc, price) => acc + price, 0)
      const missingOres = Object.keys(ores)
        .filter((ore) => !orePrices[ore as AnyOreEnum] || orePrices[ore as AnyOreEnum] === 0)
        .map((ore) => ore as AnyOreEnum)
      return {
        system,
        planet,
        satellite,
        city,
        code,
        name,
        name_short,
        prices: orePrices,
        price: totalPrice,
        missingOres,
      }
    }
  )

  // Now we need to group the stores by city
  const cityMap: Record<string, StoreChoice[]> = retVal.reduce((acc, store) => {
    if (Object.values(store.prices).length === 0) return acc
    // If this is not in a city then we use the code
    if (!store.city) {
      acc['NOCITY_' + store.code] = [store]
      return acc
    }
    if (!acc[store.city]) acc[store.city] = []
    acc[store.city].push(store)
    return acc
  }, {})

  const finalStores: StoreChoice[] = Object.values(cityMap)
    .map((stores) => {
      // If there's only one store then we just return it
      if (stores.length === 1) return stores[0]
      // Also for prices, choose the highest one for each ore in the list of store prices
      const [prices, totalPrice] = Object.entries(ores).reduce(
        (acc, [ore]) => {
          // If there's only one store then we just return it
          if (stores.length === 1) return acc
          // Otherwise we need to find the highest price for each ore
          const highestPrice = stores.reduce((acc, store) => {
            const storePrice = store.prices[ore as AnyOreEnum] || 0
            if (storePrice > acc) return storePrice
            else return acc
          }, 0)
          acc[0][ore as AnyOreEnum] = highestPrice
          acc[1] += highestPrice
          return acc
        },
        [{} as Partial<Record<AnyOreEnum, number>>, 0] as [Partial<Record<AnyOreEnum, number>>, number]
      )

      // Leave all fields alone but concatenate city, code, name and name_short with a comma
      const combinedStore: StoreChoice = {
        ...stores[0],
        code: stores.map(({ code }) => code).join(', '),
        name: stores.map(({ name }) => name).join(' & '),
        name_short: stores.map(({ name_short }) => name_short).join(' & '),
        prices,
        price: totalPrice,
      }

      const missingOres = Object.keys(ores)
        .filter((ore) => !combinedStore.prices[ore as AnyOreEnum] && combinedStore.prices[ore as AnyOreEnum] !== 0)
        .map((ore) => ore as AnyOreEnum)

      combinedStore.missingOres = missingOres
      return combinedStore
    })
    // Filter out anuthing with a zero price
    .filter(({ prices }) => Object.values(prices).reduce((acc, price) => acc + price, 0) > 0)

  // Sort the storeChoices array in descending order of total price
  finalStores.sort((a, b) => {
    if (a.price > b.price) return -1
    else if (a.price < b.price) return 1
    else return 0
  })
  return finalStores
}
