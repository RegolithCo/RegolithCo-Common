import {
  ActivityEnum,
  CrewShare,
  CrewShareInput,
  CrewShareTemplateInput,
  SalvageFind,
  SalvageOreEnum,
  SalvageWreckInput,
  ScoutingFind,
  ScoutingFindInput,
  ScoutingFindTypeEnum,
  SessionSettings,
  SessionSettingsInput,
  SessionUser,
  ShipClusterFind,
  ShipOreEnum,
  ShipRockInput,
  VehicleClusterFind,
  VehicleOreEnum,
  VehicleRockInput,
  WorkOrderDefaults,
  WorkOrderDefaultsInput,
  Session,
  UserProfile,
} from './gen/schema.types'
import { Buffer } from 'buffer'
import numeral from 'numeral'
import { CrewHierarchy, JSONObject, UserSuggest } from './types'
import dayjs from 'dayjs'

export function defaultSessionName(): string {
  return 'Session: ' + dayjs().format('dddd, MMM D, h A')
}

export function makeHumanIds(ownerScName?: string, objId?: string): string {
  const newID = `${(ownerScName || 'NEW').slice(0, 3)}-${(objId || '000000').split('_')[0]}`
  return newID.toUpperCase()
}

export function obfuscateId(guid: string): string {
  let hash = 0
  for (let i = 0; i < guid.length; i++) {
    const char = guid.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash % 1000)
    .toString()
    .padStart(3, '0')
}

export function obfuscateUserId(guid: string): string {
  return `USER-${obfuscateId(guid)}`
}

export const roundFloat = (num: unknown, precision = 0): number | null => {
  // Ensure the input is a valid number
  if (typeof num !== 'number' || isNaN(num)) {
    console.error(`Invalid input to roundFloat: ${num}`)
    return null // Return null for invalid inputs
  }

  // Ensure precision is a non-negative integer
  if (!Number.isInteger(precision) || precision < 0) {
    console.error(`Invalid precision value: ${precision}`)
    return null // Return null for invalid precision
  }

  // Handle extremely large or small numbers
  if (!isFinite(num)) {
    console.error(`Input number is not finite: ${num}`)
    return null // Return null for non-finite numbers
  }

  // Perform rounding
  return parseFloat(num.toFixed(precision))
}

/**
 * Javascript round function
 * @param num number to round
 * @param dec number of decimal places
 * @returns
 */
export function jsRound(num: number, dec: number) {
  // if num is not a number just return it as-is
  if (typeof num !== 'number') return num
  const mult = Math.pow(10, dec)
  return Math.round((num + Number.EPSILON) * mult) / mult
}

/**
 * Convert a number to bigint safely
 * @param val
 * @returns
 */
export function toBigIntSafe(val: number): bigint {
  return BigInt(Math.round(isNaN(val) ? 0 : val))
}

/**
 * JSON stringify that converts bigints to strings
 * @param data
 * @returns
 */
export function jsonSerializeBigInt(data: unknown): string {
  return JSON.stringify(data, (_key, value) => {
    return typeof value === 'bigint' ? value.toString() : value
  })
}

export function createSafeFileName(input: string, guid: string): string {
  // Remove unwanted characters
  const cleanInput = input.replace(/[^a-zA-Z0-9-_]/g, '')

  // Add the GUID to the end of the file name
  return `${cleanInput}-${guid}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeKeyRecursive(obj: any, removeKey: string) {
  if (obj === null || obj === undefined) return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => removeKeyRecursive(item, removeKey))
  } else if (obj.constructor === Object) {
    const newObj = {}
    Object.keys(obj).forEach((k) => {
      if (k !== removeKey && typeof obj[k] !== 'undefined') {
        newObj[k] = removeKeyRecursive(obj[k], removeKey)
      }
    })
    return newObj
  } else if (typeof obj === 'bigint') {
    return obj.toString()
  } else {
    return obj
  }
}

export function stripTypeNames(input) {
  // if it's not an object just return it
  if (typeof input !== 'object') {
    return input
  }
  const result = removeKeyRecursive(input, '__typename')
  return result
}

/**
 * generate a unique id for the user in the form of C followed by a random letter then 3 random numbers
 */
export function createScoutingFindId(clusterType: ScoutingFindTypeEnum): string {
  const uuid = Math.random().toString(36).substring(2, 8)
  const randomNumbers = Math.floor(Math.random() * 999)
  let clusterPrefix = 'CX'
  switch (clusterType) {
    case ScoutingFindTypeEnum.Ship:
      clusterPrefix = 'S'
      break
    case ScoutingFindTypeEnum.Vehicle:
      clusterPrefix = 'V'
      break
    case ScoutingFindTypeEnum.Salvage:
      clusterPrefix = 'W'
      break
  }
  // Note that the uuid is probably overkill and not for display
  // but it is a good way to ensure uniqueness
  return `${clusterPrefix}${randomNumbers.toString().padStart(3, '0')}_${uuid}`
}

export function createFriendlyWorkOrderId(orderType: ActivityEnum): string {
  const uuid = Math.random().toString(36).substring(2, 8)
  const randomNumbers = Math.floor(Math.random() * 1000)
  let clusterPrefix = 'CX'
  switch (orderType) {
    case ActivityEnum.ShipMining:
      clusterPrefix = 'SM'
      break
    case ActivityEnum.VehicleMining:
      clusterPrefix = 'VM'
      break
    case ActivityEnum.Salvage:
      clusterPrefix = 'SO'
      break
    case ActivityEnum.Other:
      clusterPrefix = 'PL'
      break
  }
  // Note that the uuid is probably overkill and not for display
  // but it is a good way to ensure uniqueness. We won't display it to the user
  return `${clusterPrefix}${randomNumbers}_${uuid}`
}

/**
 * Encode a json object as a base64 string
 * @param {*} text
 */
export function jsonToBase64(json: object): string {
  const jsonString = JSON.stringify(json)
  return Buffer.from(jsonString).toString('base64')
}
/**
 * Decode a base64 string back to a json object
 * @param {*} b64String
 */
export function base64ToJson(base64: string): JSONObject {
  return JSON.parse(Buffer.from(base64, 'base64').toString())
}

export type DestructuredSettings = {
  sessionSettings?: SessionSettingsInput
  workOrderDefaults?: WorkOrderDefaultsInput
  crewSharesDefaults?: CrewShareTemplateInput[]
  salvageOreDefaults?: SalvageOreEnum[]
  shipOreDefaults?: ShipOreEnum[]
  vehicleOreDefaults?: VehicleOreEnum[]
}

export function destructureSettings(settings: Partial<SessionSettings>): DestructuredSettings {
  // get rid of __typename so we can reassign these to inputs
  const { workOrderDefaults: WorkOrderDefaultsDIRTY, ...sessionSettings } = stripTypeNames(settings || {})
  const { crewShares, shipOres, vehicleOres, salvageOres, ...workOrderDefaults } = (WorkOrderDefaultsDIRTY ||
    {}) as Omit<WorkOrderDefaults, '__typename'>

  return {
    sessionSettings,
    crewSharesDefaults: crewShares,
    salvageOreDefaults: salvageOres,
    shipOreDefaults: shipOres,
    vehicleOreDefaults: vehicleOres,
    workOrderDefaults: workOrderDefaults || {},
  }
}

export function reverseDestructured(destructured: DestructuredSettings): SessionSettings {
  const {
    sessionSettings,
    workOrderDefaults,
    crewSharesDefaults,
    salvageOreDefaults,
    shipOreDefaults,
    vehicleOreDefaults,
  } = destructured
  return {
    ...sessionSettings,
    lockToDiscordGuild: sessionSettings?.lockToDiscordGuild
      ? { ...sessionSettings?.lockToDiscordGuild, __typename: 'DiscordGuild' }
      : null,
    workOrderDefaults: {
      ...workOrderDefaults,
      crewShares: (crewSharesDefaults || []).map((c) => ({
        ...c,
        __typename: 'CrewShareTemplate',
      })),
      salvageOres: salvageOreDefaults,
      shipOres: shipOreDefaults,
      vehicleOres: vehicleOreDefaults,
      __typename: 'WorkOrderDefaults',
    },
    __typename: 'SessionSettings',
  }
}

export function mergeDestructured(
  oldSessionSettings: SessionSettings,
  destructured: DestructuredSettings
): SessionSettings {
  const destructuredStripped = stripTypeNames(destructured || {})
  const mergedCrewShares = destructuredStripped.crewSharesDefaults || oldSessionSettings.workOrderDefaults.crewShares
  return {
    ...oldSessionSettings,
    ...destructuredStripped.sessionSettings,
    workOrderDefaults: {
      ...oldSessionSettings.workOrderDefaults,
      ...destructuredStripped.workOrderDefaults,
      crewShares: mergedCrewShares.map((c) => ({
        ...c,
        __typename: 'CrewShareTemplate',
      })),
      salvageOres: destructuredStripped.salvageOreDefaults || oldSessionSettings.workOrderDefaults.salvageOres,
      shipOres: destructuredStripped.shipOreDefaults || oldSessionSettings.workOrderDefaults.shipOres,
      vehicleOres: destructuredStripped.vehicleOreDefaults || oldSessionSettings.workOrderDefaults.vehicleOres,
    },
  }
}

export function mergeSessionSettings(
  oldSessSetDIRTY: Partial<SessionSettings>,
  newSessSetDIRTY: Partial<SessionSettings>
): DestructuredSettings {
  const newSessSet = destructureSettings(newSessSetDIRTY)
  const oldSessSet = destructureSettings(oldSessSetDIRTY)

  return mergeDestructuredSessionSettings(oldSessSet, newSessSet)
}

export function mergeDestructuredSessionSettings(
  oldSessSet: DestructuredSettings,
  newSessSet: DestructuredSettings
): DestructuredSettings {
  return {
    sessionSettings: {
      ...oldSessSet.sessionSettings,
      ...newSessSet.sessionSettings,
    },
    workOrderDefaults: {
      ...oldSessSet.workOrderDefaults,
      ...newSessSet.workOrderDefaults,
    },
    crewSharesDefaults: newSessSet.crewSharesDefaults || oldSessSet.crewSharesDefaults,
    salvageOreDefaults: newSessSet.salvageOreDefaults || oldSessSet.salvageOreDefaults,
    shipOreDefaults: newSessSet.shipOreDefaults || oldSessSet.shipOreDefaults,
    vehicleOreDefaults: newSessSet.vehicleOreDefaults || oldSessSet.vehicleOreDefaults,
  }
}

export function mergeSessionSettingsInplace(
  oldSessSetDIRTY: Partial<SessionSettings>,
  newSessSetDIRTY: Partial<SessionSettings>
): SessionSettings {
  const newSessSet = destructureSettings(newSessSetDIRTY)
  const oldSessSet = destructureSettings(oldSessSetDIRTY)
  const crewShares = oldSessSet.crewSharesDefaults || newSessSet.crewSharesDefaults || []

  return {
    ...oldSessSet.sessionSettings,
    ...newSessSet.sessionSettings,
    lockToDiscordGuild: {
      ...oldSessSet?.sessionSettings.lockToDiscordGuild,
      ...newSessSet?.sessionSettings.lockToDiscordGuild,
      __typename: 'DiscordGuild',
    },
    workOrderDefaults: {
      ...oldSessSet.workOrderDefaults,
      ...newSessSet.workOrderDefaults,
      crewShares: crewShares.map((crewShare) => ({ ...crewShare, __typename: 'CrewShareTemplate' })),
      salvageOres: newSessSet.salvageOreDefaults || oldSessSet.salvageOreDefaults,
      shipOres: newSessSet.shipOreDefaults || oldSessSet.shipOreDefaults,
      vehicleOres: newSessSet.vehicleOreDefaults || oldSessSet.vehicleOreDefaults,
      __typename: 'WorkOrderDefaults',
    },
    __typename: 'SessionSettings',
  }
}

export function crewSharesToInput(crewShares: CrewShare[]): CrewShareInput[] {
  return crewShares.map(({ payeeScName, payeeUserId, share, shareType, state, note }) => {
    if (payeeUserId)
      return {
        payeeUserId,
        share,
        shareType,
        state,
        note: note || null,
      }
    else
      return {
        payeeScName,
        share,
        shareType,
        state,
        note: note || null,
      }
  })
}

export const createUserSuggest = (
  session: Session | undefined,
  myUserProfile: UserProfile,
  mySessionUser: SessionUser,
  crewHierarchy: CrewHierarchy
): UserSuggest => {
  if (!session) return {}
  const activeMembers = session.activeMembers.items || []
  const pendingUsers = session.mentionedUsers || []
  const friends = myUserProfile.friends || []

  const activeLookup = activeMembers.reduce((acc, obj) => {
    if (obj) acc[obj.owner.scName] = obj
    return acc
  }, {})
  const pendingLookup = pendingUsers.reduce((acc, obj) => {
    acc[obj.scName] = obj
    return acc
  }, {})

  const tempArr = Array.from(new Set([...Object.keys(activeLookup), ...Object.keys(pendingLookup), ...friends]))
  tempArr.sort((a, b) => a.localeCompare(b))

  const crew: string[] = []
  const crewMembers =
    mySessionUser.captainId && crewHierarchy[mySessionUser.captainId]
      ? crewHierarchy[mySessionUser.captainId]
      : crewHierarchy[mySessionUser.ownerId]

  if (crewMembers) {
    activeMembers
      .filter(({ ownerId }) => crewMembers.activeIds.includes(ownerId))
      .forEach(({ owner }) => {
        crew.push(owner?.scName as string)
      })
    pendingUsers
      .filter(({ scName }) => crewMembers.innactiveSCNames.includes(scName))
      .forEach(({ scName }) => {
        crew.push(scName)
      })
  }
  return tempArr.reduce(
    (acc, scName) => ({
      ...acc,
      [scName]: {
        friend: friends.includes(scName),
        session: Object.keys(activeLookup).includes(scName),
        named: Object.keys(pendingLookup).includes(scName),
        crew: crew.includes(scName),
        sessionRole: activeLookup[scName]?.sessionRole || pendingLookup[scName]?.sessionRole,
        shipRole: activeLookup[scName]?.shipRole || pendingLookup[scName]?.shipRole,
        userId: activeLookup[scName]?.ownerId,
      } as UserSuggest[0],
    }),
    {}
  )
}

type DestructuredScoutingFind = {
  scoutingFind: ScoutingFindInput
  shipRocks?: ShipRockInput[]
  vehicleRocks?: VehicleRockInput[]
  wrecks?: SalvageWreckInput[]
}

export const scoutingFindDestructured = (scoutingFind: ScoutingFind): DestructuredScoutingFind => {
  const { state, clusterCount, note, gravityWell, includeInSurvey } = scoutingFind
  const shipFind = scoutingFind as ShipClusterFind
  const vehicleFind = scoutingFind as VehicleClusterFind
  const wreckFind = scoutingFind as SalvageFind

  const shipRocksInput = shipFind.shipRocks
    ? shipFind.shipRocks.map(({ mass, ores, state, inst, res, rockType }) => ({
        mass,
        state,
        inst,
        res,
        rockType,
        ores: ores.map(({ ore, percent }) => ({ percent, ore })),
      }))
    : undefined
  const vehicleRocksInput = vehicleFind.vehicleRocks
    ? vehicleFind.vehicleRocks.map(({ mass, ores, inst, res }) => ({
        mass,
        inst,
        res,
        ores: ores.map(({ ore, percent }) => ({ percent, ore })),
      }))
    : undefined
  const wreckInput = wreckFind.wrecks
    ? wreckFind.wrecks.map(({ isShip, state, salvageOres, sellableAUEC, shipCode }) => ({
        isShip,
        state,
        salvageOres: salvageOres.map(({ ore, scu }) => ({ ore, scu })),
        sellableAUEC,
        shipCode,
      }))
    : undefined

  return {
    scoutingFind: {
      state,
      clusterCount,
      note,
      includeInSurvey,
      gravityWell,
    },
    shipRocks: shipRocksInput,
    vehicleRocks: vehicleRocksInput,
    wrecks: wreckInput,
  }
}

export const makeAvatar = (url?: string): string => {
  if (!url || url.length === 0 || typeof url !== 'string') return url
  if (url.indexOf('google') > 0) return url
  else if (url.indexOf('dummyAvatar.png') > 0) return url
  else {
    return `${url}.webp?size=256`
  }
}

export function formatCardNumber(n: number): [string, string] {
  let numberPart = ''
  let scale = ''
  if (n < 10000) {
    numberPart = numeral(n).format('0,0')
  } else {
    const formatted = numeral(n).format('0.00a')
    scale = formatted.slice(-1)
    numberPart = formatted.slice(0, -1)
  }

  let scaleWord = ''
  switch (scale) {
    case 'k':
      scaleWord = 'thousand'
      break
    case 'm':
      scaleWord = 'million'
      break
    case 'b':
      scaleWord = 'billion'
      break
    case 't':
      scaleWord = 'trillion'
      break
  }
  if (scaleWord.length === 0) {
    // Strip off any trailing zeros
    return [numberPart.replace(/\.0+$/, ''), scaleWord]
  }

  return [numberPart, scaleWord]
}
