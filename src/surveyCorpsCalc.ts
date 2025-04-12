/**
 * Here's where the score calculation logic lives (well, the publicly visible parts of it)
 */
import { ScVersionEpochEnum } from './constants'
import {
  ScoutingFind,
  ScoutingFindTypeEnum,
  ShipRock,
  VehicleRock,
  SalvageWreck,
  ShipOreEnum,
  DepositTypeEnum,
  AsteroidTypeEnum,
} from './gen/schema.types'
import { OreTierEnum, ShipOreTiers } from './names'
import { GravityWell } from './types'

export const getSurveyDataPath = (epoch: ScVersionEpochEnum, stub: string): string => {
  return `SurveyData/${epoch}/${stub}.json`
}

export type SurveyFindScore = {
  score: number
  rawScore: number // this one's pre-bonus (but only the global bonus, it includes the bonuses for completion)
  possible: number
  errors: string[]
  areaBonus: number
  warnings: string[]
}
// Because this takes ScoutingFind and ScoutingFindRow we need a common type to smooth out the use
export type SurveyFindScoreInput = Pick<
  ScoutingFind,
  'gravityWell' | 'clusterCount' | 'clusterType' | 'surveyBonus'
> & {
  shipRocks?: ShipRock[]
  vehicleRocks?: VehicleRock[]
  wrecks?: SalvageWreck[]
}

/**
 * Gneric function to calculate the score for a survey find
 * @param sf
 * @param gravWells
 * @returns
 */
export const calculateSurveyFind = async (
  sf: SurveyFindScoreInput,
  gravWells: GravityWell[]
): Promise<SurveyFindScore> => {
  // There's a base score of 10 for just submitting a job
  const scoreObjDefault: SurveyFindScore = {
    score: 10,
    rawScore: 0,
    possible: 10,
    areaBonus: 0,
    errors: [],
    warnings: [],
  }

  // If there's no gravity well, this data is not very useful to us
  if (!sf.gravityWell) {
    scoreObjDefault.errors.push('No gravity well detected. You need to tell us where this cluster is.')
  }

  let finalScore: SurveyFindScore

  switch (sf.clusterType) {
    case ScoutingFindTypeEnum.Ship:
      finalScore = await calculateShipFind(gravWells, sf, scoreObjDefault)
      break
    case ScoutingFindTypeEnum.Vehicle:
      finalScore = await calculateVehicleFind(gravWells, sf, scoreObjDefault)
      break
    case ScoutingFindTypeEnum.Salvage:
      finalScore = await calculateSalvageFind(sf, scoreObjDefault)
      break
    default:
      throw new Error('Invalid find type')
  }

  // If there are any errors, the score is 0
  if (finalScore.errors.length > 0) finalScore.score = 0

  // Finally we calculate any overall bonuses for the survey
  const surveyBonus = sf.surveyBonus || 1
  finalScore.areaBonus = surveyBonus
  finalScore.rawScore = finalScore.score

  // Apply the survey bonus multiplier if there are no warnings or errors
  if (finalScore.errors.length === 0 && finalScore.warnings.length === 0) {
    finalScore.score *= surveyBonus
    finalScore.possible *= surveyBonus
  }

  // We need to store the scores as integers
  finalScore.score = Math.round(finalScore.score)
  finalScore.possible = Math.round(finalScore.possible)

  return finalScore
}

/**
 * Calculate the score for a ship rock
 * @param ds
 * @param sf
 * @param scoreObj
 * @returns
 */
const calculateShipFind = async (gravWells: GravityWell[], sf: SurveyFindScoreInput, scoreObj: SurveyFindScore) => {
  const newObj: SurveyFindScore = { ...scoreObj }
  newObj.possible += (sf.clusterCount || 1) * 5
  // There's a 5 point bonus for every rock scanned and you get 2 for an incomplete scan
  let completeCount = 0
  const gravWellObj: GravityWell | undefined =
    (sf.gravityWell && gravWells.find((gw) => gw.id === sf.gravityWell)) || undefined
  if (sf.gravityWell && !gravWellObj) {
    newObj.errors.push(`Gravity well specified but invalid: ${sf.gravityWell}`)
  }
  if (gravWellObj && !gravWellObj.hasRocks) {
    newObj.errors.push(`Gravity well: "${gravWellObj.label}" does not have rocks`)
  }

  // Now do some rock class checking
  const shipRocks = sf.shipRocks || []
  const rockTypes = shipRocks.map((r) => r.rockType)
  const uniqueRockTypes = Array.from(new Set(rockTypes))
  // Dedupe the rockTypes
  if (uniqueRockTypes.length > 1) {
    newObj.errors.push(
      'Multiple rock types detected in cluster. Clusters must be homogenous. Found types: ' + uniqueRockTypes.join(', ')
    )
  }

  // Now let's go through each rock and check it
  for (const rock of shipRocks) {
    const complete =
      (rock.inst || 0) >= 0 && rock.mass && (rock.res || 0) >= 0 && rock.rockType && rock.ores && rock.ores.length > 1
    const missingFields: string[] = []
    // Resistance and instability can be zero but they can't be missing
    if (typeof rock.res !== 'number' || isNaN(rock.res)) missingFields.push('resistance')
    if (typeof rock.res !== 'number' || isNaN(rock.res)) missingFields.push('instability')

    // The rest of these fields are required
    if (!rock.mass) missingFields.push('mass')
    if (!rock.rockType) missingFields.push('rock class')
    if (missingFields.length > 0)
      newObj.warnings.push(`A scan is missing the following fields: ${missingFields.join(', ')}`)
    if (!rock.ores || rock.ores.length < 2) newObj.warnings.push('A scan has incomplete ore data')

    // Do some location checking
    if (gravWellObj) {
      const oreNames = rock.ores.map((o) => o.ore)
      // Stanton has some special rules
      if (gravWellObj.id === 'STANTON' || gravWellObj.parents.includes('STANTON')) {
        if (oreNames.includes(ShipOreEnum.Riccite)) newObj.errors.push('Riccite does not occure in Stanton')
        if (oreNames.includes(ShipOreEnum.Stileron)) newObj.errors.push('Stileron does not occure in Stanton')
      }
    }

    // Now do some ore checking
    const oreTypes = rock.ores.map((o) => o.ore)
    // Dedupe the oreTypes
    const uniqueOreTypes = Array.from(new Set(oreTypes))
    // The rock is unlikely to contain 0% of anything. This is likely the user being sloppy
    rock.ores.forEach((o) => {
      if (o.percent === 0) {
        newObj.warnings.push(`Ore ${o.ore} in rock ${rock.rockType} has 0% yield. This is likely an error.`)
      }
    })

    // the rock cannot have more than one ore from OreTierEnum.STier
    const sTierCount = uniqueOreTypes.filter((o) => ShipOreTiers[OreTierEnum.STier].includes(o)).length
    if (sTierCount > 1) {
      newObj.errors.push('Multiple S-tier ores detected in a single rock. This is impossible.')
    }
    if (oreTypes && oreTypes.length > 0) {
      //
    }

    if (rockTypes && rockTypes.length > 0) {
      if (gravWellObj) {
        if (gravWellObj.isSpace && Object.values(DepositTypeEnum).includes(rock.rockType as DepositTypeEnum)) {
          newObj.errors.push('Surface rocks detected in space. This is not possible.')
        }
        if (gravWellObj.isSurface && Object.values(AsteroidTypeEnum).includes(rock.rockType as AsteroidTypeEnum)) {
          newObj.errors.push('Space rocks detected on a planet. This is not possible.')
        }
      }
    }

    newObj.score += complete ? 5 : 2
    completeCount += complete ? 1 : 0
  }

  // If the scan is complete add a 2x bonus
  newObj.possible *= 2
  if ((sf.clusterCount || 0) <= completeCount) {
    newObj.score *= 2
  }
  if (sf.clusterCount !== shipRocks.length) {
    newObj.warnings.push('Not all rocks have been scanned')
  }

  return newObj
}

/**
 * Calculate the score for a vehicle find
 * @param ds
 * @param sf
 * @param scoreObj
 * @returns
 */
const calculateVehicleFind = async (gravWells: GravityWell[], sf: SurveyFindScoreInput, scoreObj: SurveyFindScore) => {
  const newObj: SurveyFindScore = { ...scoreObj }
  const gravWellObj: GravityWell | undefined =
    (sf.gravityWell && gravWells.find((gw) => gw.id === sf.gravityWell)) || undefined
  // These are such easy scans we don't really need any kind of bonus
  if (sf.gravityWell && !gravWellObj) {
    newObj.errors.push(`Gravity well specified but invalid: ${sf.gravityWell}`)
  }
  if (gravWellObj && !gravWellObj.hasGems) {
    newObj.errors.push(`Gravity well: "${gravWellObj.label}" does not have ROC-mineable gems`)
  }

  if (newObj.errors.length === 0 && newObj.warnings.length === 0) {
    newObj.possible += 20
    newObj.score += 20
  }

  return newObj
}

/**
 * Calculate the score for a salvage find
 * @param ds
 * @param sf
 * @param scoreObj
 * @returns
 */
const calculateSalvageFind = async (sf: SurveyFindScoreInput, scoreObj: SurveyFindScore) => {
  const newObj: SurveyFindScore = { ...scoreObj }

  // There's a 5 point bonus for every wreck scanned and you get 2 for an incomplete scan
  let completeCount = 0
  const wrecks = sf.wrecks || []
  for (const wreck of wrecks) {
    const complete = (wreck.isShip && wreck.shipCode) || !wreck.isShip

    const missingFields: string[] = []
    if (!wreck.sellableAUEC) missingFields.push('aUEC')
    if (!wreck.salvageOres || wreck.salvageOres.length < 1) missingFields.push('ores')
    if (missingFields.length > 0)
      newObj.errors.push(`Wreck is missing the following fields: ${missingFields.join(', ')}`)

    newObj.possible += 5
    newObj.score += complete ? 5 : 2
    completeCount += complete ? 1 : 0
  }

  // Also now a 2x completion bonus
  newObj.possible *= 2
  if (sf.clusterCount === completeCount) {
    newObj.score *= 2
  }

  return newObj
}
