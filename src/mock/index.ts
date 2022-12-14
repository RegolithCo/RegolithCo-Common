/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
  CrewShare,
  WorkOrderStateEnum,
  ShipOreEnum,
  RefineryEnum,
  RefineryMethodEnum,
  RefineryRow,
  ShareTypeEnum,
  ScoutingFindTypeEnum,
  ScoutingFindStateEnum,
  UserProfile,
  UserStateEnum,
  ShipClusterFind,
  VehicleClusterFind,
  SalvageFind,
  VehicleRock,
  ShipRock,
  ShipRockOre,
  VehicleRockOre,
  VehicleOreEnum,
  WorkOrderInterface,
  VehicleMiningOrder,
  ActivityEnum,
  ShipMiningOrder,
  VehicleMiningRow,
  SalvageRow,
  SalvageOreEnum,
  SalvageOrder,
  Session,
  SessionStateEnum,
  LocationEnum,
  SalvageWreck,
  User,
  SessionUser,
  OtherOrder,
  PaginatedUsers,
  WorkOrder,
  SessionSettings,
  ScoutingFind,
  ScoutingFindInterface,
  PaginatedSessionUsers,
  RockStateEnum,
  LoadoutShipEnum,
  MiningModuleEnum,
  MiningLaserEnum,
  MiningGadgetEnum,
  MiningLoadout,
  ActiveMiningLaserLoadout,
  PendingUser,
  SessionUserStateEnum,
  SessionShare,
  WreckStateEnum,
  SalvageWreckOre,
} from '../gen/schema.types'
import { v4 as uuid } from 'uuid'
import { faker } from '@faker-js/faker'
import { isUndefined, random } from 'lodash'
import { DataStore, UserSuggest, VerifiedUserLookup } from '../types'
import { createFriendlyWorkOrderId, createScoutingFindId } from '../util'
import { calculatedOrderState, calculateWorkOrder } from '../equations'
import dayjs from 'dayjs'
import { scVersion } from '../constants'

function getRandomElement<T>(arr: T[]): T {
  return arr[random(0, arr.length - 1, false)]
}
const randomEnum = (enumeration) => {
  const values = Object.keys(enumeration)
  const enumKey = values[Math.floor(Math.random() * values.length)]
  return enumeration[enumKey]
}

export function fakeSCName(): string {
  return faker.word.adjective() + '_' + faker.name.firstName().toLocaleLowerCase()
}

export function fakeSCNameList(num?: number): PendingUser[] {
  const names: string[] = []
  const numNames = num || random(1, 20)
  for (let i = 0; i < numNames; i++) {
    names.push(fakeSCName())
  }
  return names.map((scName) => ({ scName, __typename: 'PendingUser' }))
}

export function fakeUserList(num?: number): User[] {
  const users: User[] = []
  const numUsers = num || random(1, 20)
  for (let i = 0; i < numUsers; i++) {
    users.push(fakeUser())
  }
  return users
}

export function fakeSessionUserList(num?: number): SessionUser[] {
  const users: SessionUser[] = []
  const numUsers = num || random(1, 20)
  for (let i = 0; i < numUsers; i++) {
    users.push(fakeSessionUser())
  }
  return users
}

export function fakePaginatedUserList(num?: number): PaginatedUsers {
  return {
    items: fakeUserList(num),
    __typename: 'PaginatedUsers',
  }
}

export function fakePaginatedSessionUserList(num?: number): PaginatedSessionUsers {
  return {
    items: fakeSessionUserList(num),
    __typename: 'PaginatedSessionUsers',
  }
}

export function randomShipRefineryRow(min = 1, max = 10): RefineryRow[] {
  const rows: RefineryRow[] = []
  for (let i = 0; i < random(min, max); i++) {
    rows.push({
      ore: getRandomElement(Object.values(ShipOreEnum)),
      amt: random(0, 10000, true),
      // NOTE: We calculate yield on the fly in the app.
      yield: null,
      __typename: 'RefineryRow',
    })
  }
  return rows
}
export function randomVehicleMiningRow(min = 1, max = 10): VehicleMiningRow[] {
  const rows: VehicleMiningRow[] = []
  for (let i = 0; i < random(min, max); i++) {
    rows.push({
      ore: getRandomElement(Object.values(VehicleOreEnum)),
      amt: random(0, 10000, true),
      __typename: 'VehicleMiningRow',
    })
  }
  return rows
}
export function randomSalvageRow(min = 1, max = 10): SalvageRow[] {
  const rows: SalvageRow[] = []
  for (let i = 0; i < random(min, max); i++) {
    rows.push({
      ore: getRandomElement(Object.values(SalvageOreEnum)),
      amt: random(0, 10000, true),
      __typename: 'SalvageRow',
    })
  }
  return rows
}

export function concentrationPopulate(arr: unknown[]): number[] {
  const rows: number[] = []
  let totalPercent = 0.5
  for (let i = 0; i < arr.length; i++) {
    const percent = random(0, totalPercent, true)
    totalPercent -= percent
    rows.push(percent)
  }
  return rows
}

export function randomShipRockOreConcentrations(ores: ShipOreEnum[]): ShipRockOre[] {
  const rows: ShipRockOre[] = []
  const concentrations = concentrationPopulate(ores)
  for (let i = 0; i < concentrations.length; i++) {
    rows.push({
      ore: ores[i],
      percent: concentrations[i],
      __typename: 'ShipRockOre',
    })
  }
  return rows
}

export function randomVehicleRockOreConcentrations(ores: VehicleOreEnum[]): VehicleRockOre[] {
  const rows: VehicleRockOre[] = []
  const concentrations = concentrationPopulate(ores)
  for (let i = 0; i < concentrations.length; i++) {
    rows.push({
      ore: ores[i],
      percent: concentrations[i],
      __typename: 'VehicleRockOre',
    })
  }
  return rows
}

export function randomShipRockOres(min = 1, max = 5): ShipRockOre[] {
  const rows: ShipRockOre[] = []

  let totalPercent = 0.5
  for (let i = 0; i < random(min, max); i++) {
    const percent = random(0, totalPercent, true)
    totalPercent -= percent
    rows.push({
      ore: randomEnum(ShipOreEnum),
      percent,
      __typename: 'ShipRockOre',
    })
  }
  return rows
}

export function randomVehicleRockOres(min = 1, max = 2): VehicleRockOre[] {
  const rows: VehicleRockOre[] = []
  let totalPercent = 0.5
  for (let i = 0; i < random(min, max); i++) {
    const percent = random(0, totalPercent, true)
    totalPercent -= percent
    rows.push({
      ore: randomEnum(VehicleOreEnum),
      percent,
      __typename: 'VehicleRockOre',
    })
  }
  return rows
}

export function fakeWorkOrderInterface(
  workOrder?: Partial<WorkOrderInterface>,
  crewShares?: Partial<CrewShare>[]
): WorkOrderInterface {
  const createdAt = faker.date.between({ from: dayjs().subtract(2, 'day').toDate(), to: new Date() }).getTime()
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() }).getTime()
  const state = randomEnum(WorkOrderStateEnum)
  const orderType = randomEnum(ActivityEnum)
  const owner = fakeUser()
  return {
    orderId: createFriendlyWorkOrderId(orderType),
    sessionId: uuid(),
    createdAt,
    updatedAt,
    ownerId: owner.userId,
    orderType,
    owner,
    state,
    version: scVersion, // Just use the lastest version
    includeTransferFee: Boolean(random(0, 1, true) > 0.5),
    failReason: state === WorkOrderStateEnum.Failed ? faker.lorem.sentence() : null,

    note: faker.lorem.sentence(),
    crewShares: crewShares
      ? crewShares.map((cs) => fakeCrewShare(cs))
      : Array.from({ length: random(2, 10) }, fakeCrewShare),
    ...(workOrder ? workOrder : {}),
  }
}

/**
 *
 * @param ds
 * @param vehicleMiningOrder
 * @param crewShares
 * @returns
 */
export async function fakeShipMiningOrder(
  ds: DataStore,
  vehicleMiningOrder?: Partial<ShipMiningOrder>,
  crewShares?: Partial<CrewShare>[]
): Promise<ShipMiningOrder> {
  const {
    orderType,
    isRefined: isRefinedIn,
    processStartTime,
    processDurationS,
    shareRefinedValue,
    refinery,
    method,
    shipOres,
    ...rest
  } = vehicleMiningOrder || {}
  const interfaceOrder = fakeWorkOrderInterface(rest, crewShares)
  const isRefined = isUndefined(isRefinedIn) ? Boolean(random(0, 1, true) > 0.5) : isRefinedIn
  // Valid states for ship mining
  const order: ShipMiningOrder = {
    ...interfaceOrder,
    state: WorkOrderStateEnum.Unknown,
    orderType: ActivityEnum.ShipMining,
    isRefined,
    processDurationS: processDurationS || interfaceOrder.state !== WorkOrderStateEnum.Unknown ? random(0, 10000) : null,
    processStartTime:
      processStartTime || interfaceOrder.state !== WorkOrderStateEnum.Unknown
        ? faker.date.between({ from: interfaceOrder.createdAt, to: new Date() }).getTime()
        : null,
    shareRefinedValue: isUndefined(shareRefinedValue)
      ? isRefined
        ? Boolean(random(0, 1, true) > 0.5)
        : false
      : shareRefinedValue,

    refinery: refinery || isRefined ? randomEnum(RefineryEnum) : null,
    method: method || isRefined ? randomEnum(RefineryMethodEnum) : null,
    shipOres: shipOres || randomShipRefineryRow(),
    __typename: 'ShipMiningOrder',
  }
  const { allPaid, remainingTime } = await calculateWorkOrder(ds, order)
  order.state = calculatedOrderState(
    order.state,
    order.orderType,
    isRefined,
    allPaid,
    order.processStartTime,
    remainingTime
  )
  return order
}

/**
 *
 * @param vehicleMiningOrder
 * @param crewShares
 * @returns
 */
export async function fakeVehicleMiningOrder(
  vehicleMiningOrder?: VehicleMiningOrder,
  crewShares?: Partial<CrewShare>[]
): Promise<VehicleMiningOrder> {
  const { orderType, failReason, vehicleOres, ...rest } = vehicleMiningOrder || {}
  const interfaceOrder = fakeWorkOrderInterface(rest, crewShares)
  const order: VehicleMiningOrder = {
    ...interfaceOrder,
    state: WorkOrderStateEnum.Unknown,
    orderType: ActivityEnum.VehicleMining,
    vehicleOres: vehicleOres || randomVehicleMiningRow(),
    __typename: 'VehicleMiningOrder',
  }
  const allPaid = order.crewShares.every(({ state: paid }) => paid)
  order.state = calculatedOrderState(order.state, order.orderType, false, allPaid)
  return order
}

export async function fakeSalvageOrder(
  vehicleMiningOrder?: SalvageOrder,
  crewShares?: Partial<CrewShare>[]
): Promise<SalvageOrder> {
  const { orderType, failReason, salvageOres, ...rest } = vehicleMiningOrder || {}
  const interfaceOrder = fakeWorkOrderInterface(rest, crewShares)
  const order: SalvageOrder = {
    ...interfaceOrder,
    state: WorkOrderStateEnum.Unknown,
    orderType: ActivityEnum.Salvage,
    salvageOres: salvageOres || randomSalvageRow(),
    __typename: 'SalvageOrder',
  }
  const allPaid = order.crewShares.every(({ state: paid }) => paid)
  order.state = calculatedOrderState(order.state, order.orderType, false, allPaid)
  return order
}

export async function fakeOtherOrder(otherOrder?: OtherOrder, crewShares?: Partial<CrewShare>[]): Promise<OtherOrder> {
  const { orderType, failReason, shareAmount, ...rest } = otherOrder || {}
  const interfaceOrder = fakeWorkOrderInterface(rest, crewShares)

  const order: OtherOrder = {
    ...interfaceOrder,
    state: WorkOrderStateEnum.Unknown,
    orderType: ActivityEnum.Other,
    shareAmount: shareAmount || random(10000, 2000000),
    __typename: 'OtherOrder',
  }
  const allPaid = order.crewShares.every(({ state: paid }) => paid)
  order.state = calculatedOrderState(order.state, order.orderType, false, allPaid)
  return order
}

export function fakeCrewShare(crewShare?: Partial<CrewShare>): CrewShare {
  const shareType = randomEnum(ShareTypeEnum)
  let share = 0
  switch (shareType) {
    case ShareTypeEnum.Amount:
      share = random(0, 100, true)
      break
    case ShareTypeEnum.Percent:
      share = random(0, 0.2, true)
      break
    case ShareTypeEnum.Share:
      share = random(1, 3, false)
      break
  }
  const createdAt = faker.date.past().getTime()
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() }).getTime()
  return {
    sessionId: uuid(),
    payeeScName: fakeSCName(),
    payeeUserId: uuid(),
    orderId: uuid(),
    shareType,
    share,
    note: faker.lorem.sentence(),
    state: random(0, 1, true) > 0.7,
    createdAt,
    updatedAt,
    ...(crewShare ? crewShare : {}),
    __typename: 'CrewShare',
  }
}

export function fakeShipRock(rock?: Partial<ShipRock>, ores?: ShipOreEnum[]): ShipRock {
  return {
    state: randomEnum(RockStateEnum),
    mass: random(2000, 10000, false),
    ores: ores ? randomShipRockOreConcentrations(ores) : randomShipRockOres(),
    ...(rock ? rock : {}),
    __typename: 'ShipRock',
  }
}
export function fakeVehicleRock(rock?: Partial<VehicleRock>, ores?: VehicleOreEnum[]): VehicleRock {
  return {
    mass: random(2000, 10000, false),
    ores: ores ? randomVehicleRockOreConcentrations(ores) : randomVehicleRockOres(),
    ...(rock ? rock : {}),
    __typename: 'VehicleRock',
  }
}

export function randomSalvageWreckOres(min = 1, max = 10): SalvageWreckOre[] {
  const ores: SalvageWreckOre[] = []
  for (let i = 0; i < random(min, max); i++) {
    ores.push({
      ore: randomEnum(SalvageOreEnum),
      scu: random(0, 150, false),
    } as SalvageWreckOre)
  }
  return ores
}
export function fakeSalvageWreck(wreck?: Partial<SalvageWreck>): SalvageWreck {
  const isShip = random(0, 1, true) > 0.5
  return {
    isShip,
    state: randomEnum(WreckStateEnum),
    salvageOres: randomSalvageWreckOres(),
    sellableAUEC: random(0, 10000, false),
    shipCode: isShip ? '165' : null,
    ...(wreck ? wreck : {}),
    __typename: 'SalvageWreck',
  }
}

export function randomShipRocks(min = 1, max = 10): ShipRock[] {
  const rocks = []
  const numRocks = random(min, max)
  if (min > 0) {
    const firstRock = fakeShipRock()
    rocks.push(firstRock)
    for (let i = 1; i < numRocks; i++) {
      rocks.push(
        fakeShipRock(
          {},
          firstRock.ores.map(({ ore }) => ore)
        )
      )
    }
  }
  return rocks
}
export function randomVehicleRocks(min = 1, max = 10): VehicleRock[] {
  const rocks = []
  const numRocks = random(min, max)
  if (min > 0) {
    const firstRock = fakeVehicleRock()
    rocks.push(firstRock)
    for (let i = 1; i < numRocks; i++) {
      rocks.push(
        fakeVehicleRock(
          {},
          firstRock.ores.map(({ ore }) => ore)
        )
      )
    }
  }
  return rocks
}
export function randomSalvageWrecks(min = 1, max = 10): SalvageWreck[] {
  const rocks = []
  for (let i = 0; i < random(min, max); i++) {
    rocks.push(fakeSalvageWreck())
  }
  return rocks
}

export async function fakeWorkOrders(ds: DataStore, num?: number): Promise<WorkOrder[]> {
  const finds: WorkOrder[] = []
  const findsNum = num || random(1, 40)
  for (let i = 0; i < findsNum; i++) {
    const findType = randomEnum(ActivityEnum)
    switch (findType) {
      case ActivityEnum.ShipMining:
        finds.push(await fakeShipMiningOrder(ds))
        break
      case ActivityEnum.VehicleMining:
        finds.push(await fakeVehicleMiningOrder())
        break
      case ActivityEnum.Salvage:
        finds.push(await fakeSalvageOrder())
        break
      case ActivityEnum.Other:
        finds.push(await fakeOtherOrder())
        break
    }
  }
  return finds
}

export function fakeScoutingFinds(num?: number): ScoutingFind[] {
  const finds = []
  const findsNum = num || random(1, 10)
  for (let i = 0; i < findsNum; i++) {
    const findType = randomEnum(ScoutingFindTypeEnum)
    switch (findType) {
      case ScoutingFindTypeEnum.Ship:
        finds.push(fakeShipClusterFind())
        break
      case ScoutingFindTypeEnum.Vehicle:
        finds.push(fakeVehicleClusterFind())
        break
      case ScoutingFindTypeEnum.Salvage:
        finds.push(fakeSalvageFind())
        break
    }
  }
  return finds
}

export function fakeScoutingInterface(scoutingFind?: Partial<ScoutingFind>): ScoutingFindInterface {
  const createdAt = faker.date.past().getTime()
  const clusterType = (scoutingFind || {}).clusterType || randomEnum(ScoutingFindTypeEnum)
  const state = randomEnum(ScoutingFindStateEnum)
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() }).getTime()
  const attendance = Array.from({ length: random(2, 6) }, () => fakeSessionUser())
  // const attendance =
  //   state === ScoutingFindStateEnum.Working && random(0, 1, true) > 0.2
  //     ? Array.from({ length: random(1, 4) }, () => fakeSessionUser())
  //     : []
  const ownerSessUser = fakeSessionUser()
  if (state === ScoutingFindStateEnum.Discovered || state === ScoutingFindStateEnum.ReadyForWorkers) {
    attendance.push(ownerSessUser)
  }

  return {
    sessionId: uuid(),
    scoutingFindId: createScoutingFindId(clusterType),
    createdAt,
    updatedAt,
    clusterType,
    // clusterCount: random(0, 1, true) > 0.2 ? random(1, 10, false) : undefined,
    clusterCount: random(1, 10, false),
    version: scVersion, // Just use the lastest version
    ownerId: ownerSessUser.owner.userId,
    owner: ownerSessUser.owner,
    state,
    attendanceIds: attendance.map((c) => c.owner.userId),
    attendance,
    ...(scoutingFind || {}),
  }
}
export function fakeShipClusterFind(scoutingFind?: Partial<ShipClusterFind>): ShipClusterFind {
  const { shipRocks, ...rest } = scoutingFind || {}
  const baseObj = fakeScoutingInterface({ ...scoutingFind, clusterType: ScoutingFindTypeEnum.Ship })
  return {
    ...baseObj,
    // shipRocks: baseObj.clusterCount ? shipRocks || randomShipRocks(5, baseObj.clusterCount) : [],
    shipRocks: baseObj.clusterCount ? shipRocks || randomShipRocks(5, baseObj.clusterCount) : [],
    ...rest,
    __typename: 'ShipClusterFind',
  }
}
export function fakeVehicleClusterFind(scoutingFind?: Partial<VehicleClusterFind>): VehicleClusterFind {
  const { vehicleRocks, ...rest } = scoutingFind || {}
  const baseObj = fakeScoutingInterface({ ...scoutingFind, clusterType: ScoutingFindTypeEnum.Vehicle })
  return {
    ...fakeScoutingInterface(scoutingFind),
    vehicleRocks: baseObj.clusterCount ? vehicleRocks || randomVehicleRocks(1, baseObj.clusterCount) : [],
    ...rest,
    __typename: 'VehicleClusterFind',
  }
}
export function fakeSalvageFind(scoutingFind?: Partial<SalvageFind>): SalvageFind {
  const { wrecks, ...rest } = scoutingFind || {}
  const baseObj = fakeScoutingInterface({ ...scoutingFind, clusterType: ScoutingFindTypeEnum.Salvage })
  return {
    ...fakeScoutingInterface(scoutingFind),
    wrecks: baseObj.clusterCount ? wrecks || randomSalvageWrecks(1, baseObj.clusterCount) : [],
    ...rest,
    __typename: 'SalvageFind',
  }
}

export function fakeUser(user?: Partial<User | UserProfile>): User {
  const createdAt = faker.date.past().getTime()
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() }).getTime()
  return {
    userId: uuid(),
    createdAt,
    updatedAt,
    scName: fakeSCName(),
    state: randomEnum(UserStateEnum),
    ...(user ? user : {}),
    __typename: 'User',
  }
}
export function fakeSessionUser(
  sessionUser?: Partial<SessionUser>,
  user?: Partial<User> | Partial<UserProfile>
): SessionUser {
  const createdAt = faker.date.past().getTime()
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() }).getTime()
  const isPilot = random(0, 1, true) > 0.5
  const captainId = isPilot ? null : random(0, 1, true) > 0.5 ? fakeSCName() : null
  const loadout = isPilot ? (random(0, 1, true) < 0.3 ? fakeLoadout() : undefined) : undefined

  const shipOptions = [null, 'ARMOLE', 'MPROSP', 'Cutlass Black']
  const randomVehicle = isPilot ? shipOptions[Math.floor(Math.random() * shipOptions.length)] : null
  const state = randomEnum(SessionUserStateEnum)
  const owner = fakeUser(user)

  return {
    createdAt,
    updatedAt,
    state,
    isPilot,
    sessionId: uuid(),
    ownerId: owner.userId,
    // vehicle
    vehicleCode: randomVehicle,
    loadout,
    shipName: null,
    owner,

    captainId,
    ...(sessionUser || {}),
    __typename: 'SessionUser',
  }
}

export function fakeSessionSettings(sessionSettings?: Partial<SessionSettings>): SessionSettings {
  const newSessionSettings = sessionSettings || {}
  const activity = newSessionSettings.activity || random(0, 1, true) > 0.5 ? randomEnum(ActivityEnum) : undefined

  return {
    activity,
    gravityWell: undefined,
    location: random(0, 1, true) > 0.5 ? randomEnum(LocationEnum) : undefined,
    allowUnverifiedUsers: random(0, 1, true) > 0.5,
    specifyUsers: random(0, 1, true) > 0.5,

    lockedFields: [],
    ...newSessionSettings,
    __typename: 'SessionSettings',
  }
}

export async function fakeActiveLaser(
  ds: DataStore,
  activeLaser?: Partial<ActiveMiningLaserLoadout>
): Promise<ActiveMiningLaserLoadout> {
  const loadoutLookup = await ds.getLookup('loadout')
  const newActiveLaser = activeLaser || {}
  const laser = newActiveLaser.laser || randomEnum(MiningLaserEnum)
  const slots = loadoutLookup.lasers[laser] || []
  const modules = Array.from({ length: random(0, slots) }).map(() => randomEnum(MiningModuleEnum))
  return {
    laser,
    modules,
    modulesActive: modules.map(() => random(0, 1, true) > 0.5),
    laserActive: random(0, 1, true) > 0.5,

    __typename: 'ActiveMiningLaserLoadout',
  }
}

export function fakeLoadout(loadout?: Partial<MiningLoadout>): MiningLoadout {
  const newLoadout = loadout || {}
  const createdAt = faker.date.past().getTime()
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() }).getTime()
  return {
    loadoutId: uuid(),
    createdAt,
    updatedAt,
    owner: fakeUser(),
    name: faker.word.noun(),
    ship: randomEnum(LoadoutShipEnum),
    // lasers:
    activeLasers: [],
    inventoryGadgets: Array.from({ length: random(1, 2) }, () => randomEnum(MiningGadgetEnum)),
    inventoryLasers: Array.from({ length: random(1, 2) }, () => randomEnum(MiningLaserEnum)),
    inventoryModules: Array.from({ length: random(1, 2) }, () => randomEnum(MiningModuleEnum)),
    ...newLoadout,
    __typename: 'MiningLoadout',
  }
}

export function fakeUserProfile(userProfile?: Partial<UserProfile | User>): UserProfile {
  const overrideProfile = userProfile || {}
  const createdAt = faker.date.past().getTime()
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() }).getTime()
  try {
    return {
      userId: uuid(),
      createdAt,
      updatedAt,
      apiKey: faker.string.alphanumeric(20),
      plan: randomEnum(UserStateEnum),
      lastActive: updatedAt,
      scName: fakeSCName(),
      state: randomEnum(UserStateEnum),
      verifyCode: null,
      friends: Array.from({ length: random(2, 50) }, () => fakeSCName()),
      userSettings: {
        theme: 'dark',
      },
      sessionSettings: (overrideProfile as UserProfile).sessionSettings || fakeSessionSettings(),
      // deliveryShipCode: random(0, 1) > 0.5 ? 'CONAND' : null,
      // sessionShipCode
      loadouts: Array.from({ length: random(0, 5) }, () => fakeLoadout()),
      ...overrideProfile,
      __typename: 'UserProfile',
    }
  } catch (err) {
    // console.error('Log Error', err)
  }
}

export async function fakeSession(ds: DataStore, session?: Partial<Session>): Promise<Session> {
  const sessionId = uuid()
  const joinId = uuid()
  const createdAt = faker.date.past().getTime()
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() }).getTime()
  const user = fakeUser()
  const mentionedUsers: PendingUser[] = session && session.mentionedUsers ? session.mentionedUsers : fakeSCNameList()
  const activeMembers: PaginatedSessionUsers =
    session && session.activeMembers
      ? session.activeMembers
      : {
          nextToken: '22323232',
          items: Array.from({ length: random(3, 10) }, () =>
            fakeSessionUser({
              sessionId,
            })
          ),
          __typename: 'PaginatedSessionUsers',
        }

  const state = randomEnum(SessionStateEnum)
  return {
    sessionId,
    joinId,
    ownerId: user.userId,
    owner: user,
    createdAt,
    updatedAt,
    finishedAt:
      state === SessionStateEnum.Closed ? faker.date.between({ from: createdAt, to: new Date() }).getTime() : null,
    state,
    note: faker.lorem.sentence(),

    sessionSettings: session?.sessionSettings || fakeSessionSettings(session && session.sessionSettings),
    mentionedUsers,

    activeMemberIds: activeMembers.items.map((m) => m.ownerId),
    activeMembers,
    scouting: {
      nextToken: '22323232',
      items: fakeScoutingFinds(),
      __typename: 'PaginatedScoutingFinds',
    },
    workOrders: {
      nextToken: '22323232',
      items: await fakeWorkOrders(ds),
      __typename: 'PaginatedWorkOrders',
    },
    ...(session ? session : {}),
    __typename: 'Session',
  }
}

/**
 *
 * @param sessionShare
 * @returns
 */
export function fakeSessionShare(sessionShare?: Partial<SessionShare>): SessionShare {
  const createdAt = faker.date.past().getTime()
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() }).getTime()
  return {
    sessionId: uuid(),
    createdAt,
    updatedAt,
    onTheList: random(0, 1, true) > 0.5,
    state: randomEnum(SessionStateEnum),
    activity: randomEnum(ActivityEnum),
    allowUnverifiedUsers: random(0, 1, true) > 0.5,
    finishedAt: random(0, 1, true) > 0.5 ? faker.date.between({ from: createdAt, to: new Date() }).getTime() : null,
    name: faker.word.adjective(),
    note: faker.lorem.sentence(),
    specifyUsers: random(0, 1, true) > 0.5,
    version: scVersion,
    __typename: 'SessionShare',
  }
}

export const fakeUserSuggest = (): UserSuggest => {
  const friends = Array.from({ length: 10 }, () => faker.word.adjective() + '_' + faker.word.noun())
  const session = Array.from({ length: 20 }, () => faker.word.adjective() + '_' + faker.word.noun())
  return {
    ...friends.reduce((acc, f) => {
      return { ...acc, [f]: { friend: true, session: Boolean(random(0, 1, true) > 0.2) } }
    }, {}),
    ...session.reduce((acc, f) => {
      return { ...acc, [f]: { friend: Boolean(random(0, 1, true) > 0.2), session: true } }
    }, {}),
  }
}

export const fakeVerifiedUserLookup = (userList?: string[]): VerifiedUserLookup => {
  const vUsers: VerifiedUserLookup = (userList || []).reduce((acc, f) => {
    return { ...acc, [f]: random(0, 1, true) > 0.5 ? null : fakeUser({ scName: f }) }
  }, {})
  return vUsers
}
