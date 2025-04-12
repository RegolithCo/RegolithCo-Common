import gql from 'graphql-tag'

export default gql`
schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

directive @admin_only on FIELD_DEFINITION

directive @logged_in on FIELD_DEFINITION

type APIEvent {
  ScoutingFindID: ID
  createdAt: Timestamp!
  orderId: ID
  sessionId: ID
  state: String
  type: APIEventTypeEnum!
}

enum APIEventTypeEnum {
  CREATED
  CS_CREATED
  CS_DELETED
  CS_UPDATED
  DELETED
  JOINED
  LEFT
  MJ_CREATED
  MJ_DELETED
  MJ_UPDATED
  RC_CREATED
  RC_DELETED
  RC_UPDATED
  UPDATED
}

type ActiveMiningLaserLoadout {
  laser: MiningLaserEnum!
  laserActive: Boolean!
  modules: [MiningModuleEnum]!
  modulesActive: [Boolean!]!
}

input ActiveMiningLaserLoadoutInput {
  laser: MiningLaserEnum!
  laserActive: Boolean!
  modules: [MiningModuleEnum]!
  modulesActive: [Boolean!]!
}

enum ActivityEnum {
  OTHER
  SALVAGE
  SHIP_MINING
  VEHICLE_MINING
}

enum AsteroidTypeEnum {
  CTYPE
  ETYPE
  ITYPE
  MTYPE
  PTYPE
  QTYPE
  STYPE
}

enum AuthTypeEnum {
  API_KEY
  DISCORD
  GOOGLE
}

type CIGLookups {
  densitiesLookups: JSONObject
  methodsBonusLookup: JSONObject
  oreProcessingLookup: JSONObject
  refineryBonusLookup: JSONObject
}

type CrewShare {
  createdAt: Timestamp!
  note: String
  orderId: ID!
  payeeScName: String!
  payeeUserId: ID
  session: Session
  sessionId: ID!
  share: Float!
  """
  We explicitly require the name of the share type to be passed in in case the user is deleted OR
  if they change their SCName. This way we can still track who paid whom.
  """
  shareType: ShareTypeEnum!
  state: Boolean
  updatedAt: Timestamp!
  workOrder: WorkOrder
}

input CrewShareInput {
  note: String
  """
  We explicitly require the name of the share type to be passed in in case the user is deleted OR
  if they change their SCName. This way we can still track who paid whom.
  """
  payeeScName: String
  payeeUserId: ID
  share: Float!
  shareType: ShareTypeEnum!
  state: Boolean!
}

type CrewShareTemplate {
  note: String
  """
  We explicitly require the name of the share type to be passed in in case the user is deleted OR
  if they change their SCName. This way we can still track who paid whom.
  """
  payeeScName: String!
  share: Float!
  shareType: ShareTypeEnum!
}

input CrewShareTemplateInput {
  note: String
  """
  We explicitly require the name of the share type to be passed in in case the user is deleted OR
  if they change their SCName. This way we can still track who paid whom.
  """
  payeeScName: String!
  share: Float!
  shareType: ShareTypeEnum!
}

input CrewShareUpdate {
  note: String
  """
  We explicitly require the name of the share type to be passed in in case the user is deleted OR
  if they change their SCName. This way we can still track who paid whom.
  """
  payeeScName: String
  payeeUserId: ID
  share: Float
  shareType: ShareTypeEnum
  state: Boolean
}

enum DepositTypeEnum {
  ATACAMITE
  FELSIC
  GNEISS
  GRANITE
  IGNEOUS
  OBSIDIAN
  QUARTZITE
  SHALE
}

type DiscordGuild implements DiscordGuildInterface {
  iconUrl: String
  id: ID!
  name: String!
}

input DiscordGuildInput {
  iconUrl: String
  id: ID!
  name: String!
}

interface DiscordGuildInterface {
  iconUrl: String
  id: ID!
  name: String!
}

enum EventNameEnum {
  INSERT
  MODIFY
  REMOVE
}

scalar JSONObject

enum LoadoutShipEnum {
  GOLEM
  MOLE
  PROSPECTOR
  ROC
}

enum LocationEnum {
  CAVE
  RING
  SPACE
  SURFACE
}

type LookupData {
  CIG: CIGLookups
  UEX: UEXLookups
  loadout: JSONObject
}

enum LookupTypeEnum {
  CIG
  UEX
}

enum MiningGadgetEnum {
  Boremax
  Okunis
  Optimax
  Sabir
  Stalwart
  Waveshift
}

enum MiningLaserEnum {
  ArborMH1
  ArborMH2
  ArborMHV
  Helix0
  HelixI
  HelixII
  HofstedeS0
  HofstedeS1
  HofstedeS2
  ImpactI
  ImpactII
  KleinS0
  KleinS1
  KleinS2
  LancetMH1
  LancetMH2
  Lawson
  Pitman
}

type MiningLoadout {
  activeGadgetIndex: Int
  activeLasers: [ActiveMiningLaserLoadout]!
  createdAt: Timestamp!
  inventoryGadgets: [MiningGadgetEnum!]!
  inventoryLasers: [MiningLaserEnum!]!
  inventoryModules: [MiningModuleEnum!]!
  loadoutId: ID!
  name: String!
  owner: User!
  ship: LoadoutShipEnum!
  updatedAt: Timestamp!
}

input MiningLoadoutInput {
  activeGadgetIndex: Int
  activeLasers: [ActiveMiningLaserLoadoutInput]!
  inventoryGadgets: [MiningGadgetEnum!]!
  inventoryLasers: [MiningLaserEnum!]!
  inventoryModules: [MiningModuleEnum!]!
  name: String!
  ship: LoadoutShipEnum!
}

enum MiningModuleEnum {
  Brandt
  FLTR
  FLTRL
  FLTRXL
  Focus
  FocusII
  FocusIII
  Forel
  Lifeline
  Optimum
  Rieger
  RiegerC2
  RiegerC3
  Rime
  Stampede
  Surge
  Torpid
  Torrent
  TorrentII
  TorrentIII
  Vaux
  VauxC2
  VauxC3
  XTR
  XTRL
  XTRXL
}

type Mutation {
  addFriends(friends: [String]!): UserProfile @logged_in
  addScoutingFind(scoutingFind: ScoutingFindInput!, sessionId: ID!, shipRocks: [ShipRockInput!], vehicleRocks: [VehicleRockInput!], wrecks: [SalvageWreckInput!]): ScoutingFind @logged_in
  """We need this for users who cannot/will not use the app"""
  addSessionMentions(scNames: [String]!, sessionId: ID!): Session @logged_in
  blockProspector(block: Boolean!, userId: ID!): UserProfile @admin_only
  """
  This is for when a user wants to claim a work order that has been delegated to them
  """
  claimWorkOrder(orderId: ID!, sessionId: ID!): WorkOrder @logged_in
  createLoadout(shipLoadout: MiningLoadoutInput!): MiningLoadout @logged_in
  createSession(crewSharesDefaults: [CrewShareTemplateInput!], salvageOreDefaults: [SalvageOreEnum!], session: SessionInput!, sessionSettings: SessionSettingsInput, shipOreDefaults: [ShipOreEnum!], vehicleOreDefaults: [VehicleOreEnum!], workOrderDefaults: WorkOrderDefaultsInput): Session @logged_in
  createWorkOrder(salvageOres: [SalvageRowInput!], sessionId: ID!, shares: [CrewShareInput!]!, shipOres: [RefineryRowInput!], vehicleOres: [VehicleMiningRowInput!], workOrder: WorkOrderInput!): WorkOrder @logged_in
  deleteCrewShare(orderId: ID!, payeeScName: String!, sessionId: ID!): CrewShare @logged_in
  deleteLoadout(loadoutId: String!): MiningLoadout @logged_in
  deleteScoutingFind(scoutingFindId: ID!, sessionId: ID!): ScoutingFind @logged_in
  deleteSession(sessionId: ID!): ID @logged_in
  deleteUserProfile(leaveData: Boolean): ID @logged_in
  deleteWorkOrder(orderId: ID!, sessionId: ID!): WorkOrder @logged_in
  deliverWorkOrder(isSold: Boolean!, orderId: ID!, sessionId: ID!): WorkOrder @logged_in
  failWorkOrder(orderId: ID!, reason: String, sessionId: ID!): WorkOrder @logged_in
  joinScoutingFind(enRoute: Boolean, scoutingFindId: ID!, sessionId: ID!): ScoutingFind @logged_in
  joinSession(joinId: ID!): SessionUser @logged_in
  leaveScoutingFind(scoutingFindId: ID!, sessionId: ID!): ScoutingFind @logged_in
  leaveSession(sessionId: ID!): ID @logged_in
  markCrewSharePaid(isPaid: Boolean!, orderId: ID!, payeeScName: String!, sessionId: ID!): CrewShare @logged_in
  mergeAccount(authToken: String!, authType: AuthTypeEnum!): UserProfile @admin_only
  mergeAccountAdmin(primaryUserId: String!, secondaryUserId: String!): UserProfile @admin_only
  refreshAvatar(remove: Boolean): UserProfile @logged_in
  removeFriends(friends: [String]!): UserProfile @logged_in
  removeSessionCrew(scNames: [String]!, sessionId: ID!): Session @logged_in
  removeSessionMentions(scNames: [String]!, sessionId: ID!): Session @logged_in
  requestVerifyUserProfile: String @logged_in
  rotateShareId(sessionId: ID!): Session @logged_in
  setLookupData(data: JSONObject!, key: String!, lookupType: LookupTypeEnum!): Boolean @admin_only
  setUserPlan(plan: UserPlanEnum!, userId: ID!): UserProfile @admin_only
  updateLoadout(loadoutId: String!, shipLoadout: MiningLoadoutInput!): MiningLoadout @logged_in
  updatePendingUsers(pendingUsers: [PendingUserInput!]!, sessionId: ID!): Session @logged_in
  updateScoutingFind(scoutingFind: ScoutingFindInput!, scoutingFindId: ID!, sessionId: ID!, shipRocks: [ShipRockInput!], vehicleRocks: [VehicleRockInput!], wrecks: [SalvageWreckInput!]): ScoutingFind @logged_in
  updateSession(crewSharesDefaults: [CrewShareTemplateInput!], salvageOreDefaults: [SalvageOreEnum!], session: SessionInput!, sessionId: ID!, sessionSettings: SessionSettingsInput, shipOreDefaults: [ShipOreEnum!], vehicleOreDefaults: [VehicleOreEnum!], workOrderDefaults: WorkOrderDefaultsInput): Session @logged_in
  updateSessionUser(sessionId: ID!, sessionUser: SessionUserUpdate!, userId: ID!): SessionUser @logged_in
  updateUserProfile(crewSharesDefaults: [CrewShareTemplateInput!], salvageOreDefaults: [SalvageOreEnum!], sessionSettings: SessionSettingsInput, shipOreDefaults: [ShipOreEnum!], userProfile: UserProfileInput!, vehicleOreDefaults: [VehicleOreEnum!], workOrderDefaults: WorkOrderDefaultsInput): UserProfile @logged_in
  updateWorkOrder(orderId: ID!, salvageOres: [SalvageRowInput!], sessionId: ID!, shares: [CrewShareInput!], shipOres: [RefineryRowInput!], vehicleOres: [VehicleMiningRowInput!], workOrder: WorkOrderInput): WorkOrder @logged_in
  upsertCrewShare(crewShare: CrewShareInput!, orderId: ID!, sessionId: ID!): CrewShare @logged_in
  upsertSessionUser(sessionId: ID!, workSessionUser: SessionUserInput): SessionUser @logged_in
  userAPIKey(revoke: Boolean, userId: ID): UserProfile @logged_in
  verifyUserProfile(code: String): UserProfile @logged_in
}

type MyDiscordGuild implements DiscordGuildInterface {
  hasPermission: Boolean
  iconUrl: String
  id: ID!
  name: String!
}

type OtherOrder implements WorkOrderInterface {
  createdAt: Timestamp!
  crewShares: [CrewShare!]
  expenses: [WorkOrderExpense!]
  failReason: String
  includeTransferFee: Boolean
  isSold: Boolean
  note: String
  orderId: ID!
  orderType: ActivityEnum!
  owner: User
  ownerId: ID!
  sellStore: String
  seller: User
  sellerUserId: ID
  """
  This is the user that the work order is delegated to. It is optional and if not set, 
  the owner is assumed to be the delegate
  """
  sellerscName: String
  session: Session
  sessionId: ID!
  shareAmount: Int
  state: WorkOrderStateEnum!
  updatedAt: Timestamp!
  version: String!
}

type PaginatedCrewShares {
  items: [CrewShare!]!
  nextToken: String
}

type PaginatedScoutingFinds {
  items: [ScoutingFind!]!
  nextToken: String
}

type PaginatedSessionUsers {
  items: [SessionUser!]!
  nextToken: String
}

type PaginatedSessions {
  items: [Session!]!
  nextToken: String
}

type PaginatedUsers {
  items: [User!]!
  nextToken: String
}

type PaginatedWorkOrders {
  items: [WorkOrder!]!
  nextToken: String
}

type PendingUser {
  captainId: ID
  scName: String!
  sessionRole: String
  shipRole: String
}

input PendingUserInput {
  captainId: ID
  scName: String!
  sessionRole: SessionRoleEnum
  shipRole: ShipRoleEnum
}

type Query {
  captureRefineryOrder(imgUrl: String!): ShipMiningOrderCapture @logged_in
  captureShipRockScan(imgUrl: String!): ShipRockCapture @logged_in
  crewShares(nextToken: String, orderId: ID, sessionId: ID!): PaginatedCrewShares @logged_in
  lookups: LookupData
  profile: UserProfile @logged_in
  scoutingFind(scoutingFindId: ID!, sessionId: ID!): ScoutingFind @logged_in
  session(sessionId: ID!): Session @logged_in
  sessionShare(joinId: ID!): SessionShare
  sessionUpdates(lastCheck: String, sessionId: ID!): [SessionUpdate] @logged_in
  sessionUser(sessionId: ID!): SessionUser @logged_in
  surveyData(dataName: String!, epoch: String!): SurveyData
  user(userId: ID!): User @logged_in
  workOrder(orderId: ID!, sessionId: ID!): WorkOrder @logged_in
}

enum RefineryEnum {
  ARCL1
  ARCL2
  ARCL4
  CRUL1
  HURL1
  HURL2
  MAGNG
  MICL1
  MICL2
  MICL5
  PYROG
  PYRO_CHECKMATE
  PYRO_ORBITUARY
  PYRO_RUIN
  PYRO_STANTG
  TERRG
}

enum RefineryMethodEnum {
  CORMACK
  DINYX_SOLVENTATION
  ELECTROSTAROLYSIS
  FERRON_EXCHANGE
  GASKIN_PROCESS
  KAZEN_WINNOWING
  PYROMETRIC_CHROMALYSIS
  THERMONATIC_DEPOSITION
  XCR_REACTION
}

type RefineryRow {
  amt: Int!
  ore: ShipOreEnum!
  yield: Int!
}

type RefineryRowCapture {
  amt: Int
  ore: ShipOreEnum!
  yield: Int
}

input RefineryRowInput {
  amt: Int!
  ore: ShipOreEnum!
}

enum RockStateEnum {
  DEPLETED
  IGNORE
  READY
}

scalar RockType

type SalvageFind implements ScoutingFindInterface {
  attendance: [SessionUser!]
  attendanceIds: [ID!]!
  clusterCount: Int
  clusterType: ScoutingFindTypeEnum!
  createdAt: Timestamp!
  gravityWell: String
  includeInSurvey: Boolean
  note: String
  owner: User
  ownerId: ID!
  rawScore: Int
  score: Int
  scoutingFindId: ID!
  sessionId: ID!
  state: ScoutingFindStateEnum!
  surveyBonus: Float
  updatedAt: Timestamp!
  version: String!
  wrecks: [SalvageWreck!]!
}

type SalvageOrder implements WorkOrderInterface {
  createdAt: Timestamp!
  crewShares: [CrewShare!]
  expenses: [WorkOrderExpense!]
  failReason: String
  includeTransferFee: Boolean
  isSold: Boolean
  note: String
  orderId: ID!
  orderType: ActivityEnum!
  owner: User
  ownerId: ID!
  salvageOres: [SalvageRow!]!
  sellStore: String
  seller: User
  sellerUserId: ID
  """
  This is the user that the work order is delegated to. It is optional and if not set, 
  the owner is assumed to be the delegate
  """
  sellerscName: String
  session: Session
  sessionId: ID!
  shareAmount: Int
  state: WorkOrderStateEnum!
  updatedAt: Timestamp!
  version: String!
}

enum SalvageOreEnum {
  CMAT
  RMC
}

type SalvageRow {
  amt: Int!
  ore: SalvageOreEnum!
}

input SalvageRowInput {
  amt: Int!
  ore: SalvageOreEnum!
}

type SalvageWreck {
  isShip: Boolean!
  salvageOres: [SalvageWreckOre!]!
  sellableAUEC: Int
  shipCode: String
  state: WreckStateEnum!
}

input SalvageWreckInput {
  isShip: Boolean!
  salvageOres: [SalvageWreckOreInput!]!
  sellableAUEC: Int
  shipCode: String
  state: WreckStateEnum!
}

type SalvageWreckOre {
  ore: SalvageOreEnum!
  scu: Int!
}

input SalvageWreckOreInput {
  ore: SalvageOreEnum!
  scu: Int!
}

union ScoutingFind = SalvageFind | ShipClusterFind | VehicleClusterFind

input ScoutingFindInput {
  clusterCount: Int
  gravityWell: String
  includeInSurvey: Boolean
  note: String
  state: ScoutingFindStateEnum!
}

interface ScoutingFindInterface {
  attendance: [SessionUser!]
  attendanceIds: [ID!]!
  clusterCount: Int
  clusterType: ScoutingFindTypeEnum!
  createdAt: Timestamp!
  gravityWell: String
  includeInSurvey: Boolean
  note: String
  owner: User
  ownerId: ID!
  rawScore: Int
  score: Int
  scoutingFindId: ID!
  sessionId: ID!
  state: ScoutingFindStateEnum!
  surveyBonus: Float
  updatedAt: Timestamp!
  version: String!
}

"""The state of a cluster found by a scout"""
enum ScoutingFindStateEnum {
  ABANDONNED
  DEPLETED
  DISCOVERED
  READY_FOR_WORKERS
  WORKING
}

enum ScoutingFindTypeEnum {
  SALVAGE
  SHIP
  VEHICLE
}

type SellStores {
  gem: String
  oreRaw: String
  oreRefined: String
  salvage: String
}

type Session {
  activeMemberIds: [String!]
  activeMembers(nextToken: String): PaginatedSessionUsers
  createdAt: Timestamp!
  finishedAt: Timestamp
  joinId: ID!
  mentionedUsers: [PendingUser!]!
  name: String
  note: String
  onTheList: Boolean
  owner: User
  ownerId: ID!
  scouting(nextToken: String): PaginatedScoutingFinds
  sessionId: ID!
  sessionSettings: SessionSettings!
  state: SessionStateEnum!
  summary: SessionSummary
  updatedAt: Timestamp!
  version: String
  workOrders(nextToken: String): PaginatedWorkOrders
}

input SessionInput {
  mentionedUsers: [PendingUserInput!]
  name: String
  note: String
  state: SessionStateEnum
}

enum SessionRoleEnum {
  LOGISTICS
  MANAGER
  MEDICAL
  SCOUT
  SECURITY
  TRANSPORT
}

type SessionSettings {
  activity: ActivityEnum
  allowUnverifiedUsers: Boolean
  controlledSessionRole: Boolean
  controlledShipRole: Boolean
  gravityWell: String
  location: LocationEnum
  lockToDiscordGuild: DiscordGuild
  lockedFields: [String!]
  specifyUsers: Boolean
  systemFilter: SystemEnum
  usersCanAddUsers: Boolean
  usersCanInviteUsers: Boolean
  workOrderDefaults: WorkOrderDefaults
}

input SessionSettingsInput {
  activity: ActivityEnum
  allowUnverifiedUsers: Boolean
  controlledSessionRole: Boolean
  controlledShipRole: Boolean
  gravityWell: String
  location: LocationEnum
  lockToDiscordGuild: DiscordGuildInput
  lockedFields: [String!]
  specifyUsers: Boolean
  systemFilter: SystemEnum
  usersCanAddUsers: Boolean
  usersCanInviteUsers: Boolean
}

type SessionShare {
  activity: ActivityEnum
  allowUnverifiedUsers: Boolean
  createdAt: Timestamp!
  finishedAt: Timestamp
  lockToDiscordGuild: DiscordGuild
  name: String
  note: String
  onTheList: Boolean!
  sessionId: ID!
  specifyUsers: Boolean
  state: SessionStateEnum!
  updatedAt: Timestamp!
  version: String
}

enum SessionStateEnum {
  ACTIVE
  CLOSED
}

type SessionSummary {
  aUEC: Int
  activeMembers: Int
  allPaid: Boolean
  collectedSCU: Float
  lastJobDone: Timestamp
  refineries: [RefineryEnum!]!
  scoutingFindsByType: SessionSummaryTotals
  totalMembers: Int
  workOrderSummaries: [SessionSummaryWorkOrder!]!
  workOrdersByType: SessionSummaryTotals
  yieldSCU: Float
}

type SessionSummaryTotals {
  other: Int
  salvage: Int
  ship: Int
  vehicle: Int
}

type SessionSummaryWorkOrder {
  isFailed: Boolean
  isSold: Boolean
  orderType: ActivityEnum!
  paidShares: Int
  unpaidShares: Int
}

type SessionUpdate {
  data: SessionUpdateUnion
  eventDate: Timestamp!
  eventName: EventNameEnum
  sessionId: ID!
}

union SessionUpdateUnion = CrewShare | OtherOrder | SalvageFind | SalvageOrder | Session | SessionUser | ShipClusterFind | ShipMiningOrder | VehicleClusterFind | VehicleMiningOrder

"""
SessionUser is the type we use to link users who are not the owner to the 
session
"""
type SessionUser {
  captainId: ID
  createdAt: Timestamp!
  isPilot: Boolean!
  loadout: MiningLoadout
  owner: User
  ownerId: ID!
  sessionId: ID!
  sessionRole: String
  shipName: String
  shipRole: String
  state: SessionUserStateEnum!
  updatedAt: Timestamp!
  vehicleCode: String
}

input SessionUserInput {
  captainId: ID
  isPilot: Boolean
  loadoutId: String
  sessionRole: String
  shipName: String
  shipRole: String
  state: SessionUserStateEnum
  vehicleCode: String
}

enum SessionUserStateEnum {
  AFK
  ON_SITE
  REFINERY_RUN
  SCOUTING
  TRAVELLING
  UNKNOWN
}

input SessionUserUpdate {
  captainId: ID
  sessionRole: String
  shipRole: String
  state: SessionUserStateEnum
}

enum ShareTypeEnum {
  AMOUNT
  PERCENT
  SHARE
}

type ShipClusterFind implements ScoutingFindInterface {
  attendance: [SessionUser!]
  attendanceIds: [ID!]!
  clusterCount: Int
  clusterType: ScoutingFindTypeEnum!
  createdAt: Timestamp!
  gravityWell: String
  includeInSurvey: Boolean
  note: String
  owner: User
  ownerId: ID!
  rawScore: Int
  score: Int
  scoutingFindId: ID!
  sessionId: ID!
  shipRocks: [ShipRock!]!
  state: ScoutingFindStateEnum!
  surveyBonus: Float
  updatedAt: Timestamp!
  version: String!
}

enum ShipManufacturerEnum {
  AEGS
  ANVL
  ARGO
  CNOU
  CRUS
  DRAK
  GRIN
  MIRA
  MISC
  RSIN
  TUMBRIL
}

type ShipMiningOrder implements WorkOrderInterface {
  createdAt: Timestamp!
  crewShares: [CrewShare!]
  expenses: [WorkOrderExpense!]
  failReason: String
  includeTransferFee: Boolean
  isRefined: Boolean
  isSold: Boolean
  method: RefineryMethodEnum
  note: String
  orderId: ID!
  orderType: ActivityEnum!
  owner: User
  ownerId: ID!
  processDurationS: Int
  processEndTime: Timestamp
  processStartTime: Timestamp
  refinery: RefineryEnum
  sellStore: String
  seller: User
  sellerUserId: ID
  """
  This is the user that the work order is delegated to. It is optional and if not set, 
  the owner is assumed to be the delegate
  """
  sellerscName: String
  session: Session
  sessionId: ID!
  shareAmount: Int
  shareRefinedValue: Boolean
  shipOres: [RefineryRow!]!
  state: WorkOrderStateEnum!
  updatedAt: Timestamp!
  version: String!
}

type ShipMiningOrderCapture {
  expenses: [WorkOrderExpense!]
  method: RefineryMethodEnum
  processDurationS: Int
  refinery: RefineryEnum
  shipOres: [RefineryRowCapture!]!
}

enum ShipOreEnum {
  AGRICIUM
  ALUMINUM
  BERYL
  BEXALITE
  BORASE
  COPPER
  CORUNDUM
  DIAMOND
  GOLD
  HEPHAESTANITE
  ICE
  INERTMATERIAL
  IRON
  LARANITE
  QUANTANIUM
  QUARTZ
  RICCITE
  SILICON
  STILERON
  TARANITE
  TIN
  TITANIUM
  TUNGSTEN
}

type ShipRock {
  inst: Float
  mass: Float!
  ores: [ShipRockOre!]!
  res: Float
  rockType: RockType
  state: RockStateEnum!
}

type ShipRockCapture {
  inst: Float
  mass: Float!
  ores: [ShipRockOre!]!
  res: Float
  rockType: RockType
}

input ShipRockInput {
  inst: Float
  mass: Float!
  ores: [ShipRockOreInput!]!
  res: Float
  rockType: RockType
  state: RockStateEnum!
}

type ShipRockOre {
  ore: ShipOreEnum!
  percent: Float!
}

input ShipRockOreInput {
  ore: ShipOreEnum!
  percent: Float!
}

enum ShipRoleEnum {
  COPILOT
  ENGINEER
  LASER_OPERATOR
  MEDIC
  PILOT
  SECURITY
  STEVEDORE
  TURRET
}

type Subscription {
  apiSubscription: APIEvent
}

type SurveyData {
  data: JSONObject
  dataName: String!
  epoch: String!
  lastUpdated: Timestamp
}

enum SystemEnum {
  PYRO
  STANTON
}

scalar Timestamp

type UEXLookups {
  bodies: JSONObject
  maxPrices: JSONObject
  ships: JSONObject
  tradeports: JSONObject
}

type User implements UserInterface {
  avatarUrl: String
  createdAt: Timestamp!
  scName: String!
  state: UserStateEnum!
  updatedAt: Timestamp!
  userId: ID!
}

interface UserInterface {
  avatarUrl: String
  createdAt: Timestamp!
  scName: String!
  state: UserStateEnum!
  updatedAt: Timestamp!
  userId: ID!
}

enum UserPlanEnum {
  ADMIN
  ETERNAL_GRATITUDE
  FREE
  GRIZZLED_PROSPECTOR
}

type UserProfile implements UserInterface {
  apiKey: String
  avatarUrl: String
  createdAt: Timestamp!
  deliveryShipCode: String
  discordGuilds(refresh: Boolean): [MyDiscordGuild!]!
  friends: [String!]!
  isSurveyor: Boolean
  isSurveyorBanned: Boolean
  joinedSessions(nextToken: String): PaginatedSessions
  lastActive: Timestamp!
  loadouts: [MiningLoadout!]!
  mySessions(nextToken: String): PaginatedSessions
  plan: UserPlanEnum!
  scName: String!
  sessionSettings: SessionSettings!
  sessionShipCode: String
  state: UserStateEnum!
  surveyorGuild: DiscordGuild
  surveyorName: String
  surveyorScore: Int
  updatedAt: Timestamp!
  userId: ID!
  userSettings: JSONObject
  verifyCode: String
  workOrders(nextToken: String, stateFilter: WorkOrderStateEnum): PaginatedWorkOrders
}

input UserProfileInput {
  deliveryShipCode: String
  isSurveyor: Boolean
  scName: String
  sessionShipCode: String
  surveyorGuildId: ID
  surveyorName: String
  userSettings: JSONObject
}

enum UserStateEnum {
  UNVERIFIED
  VERIFIED
}

type Vehicle {
  UEXID: ID!
  cargo: Int
  maker: String!
  miningHold: Int
  name: String!
  role: VehicleRoleEnum!
}

type VehicleClusterFind implements ScoutingFindInterface {
  attendance: [SessionUser!]
  attendanceIds: [ID!]!
  clusterCount: Int
  clusterType: ScoutingFindTypeEnum!
  createdAt: Timestamp!
  gravityWell: String
  includeInSurvey: Boolean
  note: String
  owner: User
  ownerId: ID!
  rawScore: Int
  score: Int
  scoutingFindId: ID!
  sessionId: ID!
  state: ScoutingFindStateEnum!
  surveyBonus: Float
  updatedAt: Timestamp!
  vehicleRocks: [VehicleRock!]!
  version: String!
}

type VehicleMiningOrder implements WorkOrderInterface {
  createdAt: Timestamp!
  crewShares: [CrewShare!]
  expenses: [WorkOrderExpense!]
  failReason: String
  includeTransferFee: Boolean
  isSold: Boolean
  note: String
  orderId: ID!
  orderType: ActivityEnum!
  owner: User
  ownerId: ID!
  sellStore: String
  seller: User
  sellerUserId: ID
  """
  This is the user that the work order is delegated to. It is optional and if not set, 
  the owner is assumed to be the delegate
  """
  sellerscName: String
  session: Session
  sessionId: ID!
  shareAmount: Int
  state: WorkOrderStateEnum!
  updatedAt: Timestamp!
  vehicleOres: [VehicleMiningRow!]!
  version: String!
}

type VehicleMiningRow {
  amt: Int!
  ore: VehicleOreEnum!
}

input VehicleMiningRowInput {
  amt: Int!
  ore: VehicleOreEnum!
}

enum VehicleOreEnum {
  APHORITE
  BERADOM
  CARINITE
  DOLIVINE
  FEYNMALINE
  GLACOSITE
  HADANITE
  JACLIUM
  JANALITE
  SALDYNIUM
}

type VehicleRock {
  inst: Float
  mass: Float!
  ores: [VehicleRockOre!]!
  res: Float
}

input VehicleRockInput {
  inst: Float
  mass: Float!
  ores: [VehicleRockOreInput!]!
  res: Float
}

type VehicleRockOre {
  ore: VehicleOreEnum!
  percent: Float!
}

input VehicleRockOreInput {
  ore: VehicleOreEnum!
  percent: Float!
}

enum VehicleRoleEnum {
  FIGHTER
  FREIGHT
  MINING
  OTHER
}

union WorkOrder = OtherOrder | SalvageOrder | ShipMiningOrder | VehicleMiningOrder

type WorkOrderDefaults {
  crewShares: [CrewShareTemplate!]
  includeTransferFee: Boolean
  isRefined: Boolean
  lockedFields: [String!]
  method: RefineryMethodEnum
  refinery: RefineryEnum
  salvageOres: [SalvageOreEnum!]
  sellStores: SellStores
  shareRefinedValue: Boolean
  shipOres: [ShipOreEnum!]
  vehicleOres: [VehicleOreEnum!]
}

input WorkOrderDefaultsInput {
  includeTransferFee: Boolean
  isRefined: Boolean
  lockedFields: [String!]
  method: RefineryMethodEnum
  refinery: RefineryEnum
  sellStore: String
  shareAmount: Int
  shareRefinedValue: Boolean
}

type WorkOrderExpense {
  amount: Int!
  name: String!
}

input WorkOrderExpenseInput {
  amount: Int!
  name: String!
}

input WorkOrderInput {
  expenses: [WorkOrderExpenseInput!]
  includeTransferFee: Boolean
  isRefined: Boolean
  isSold: Boolean
  method: RefineryMethodEnum
  note: String
  processDurationS: Int
  processStartTime: Timestamp
  profit: Int
  refinery: RefineryEnum
  sellStore: String
  sellerUserId: ID
  """
  This is the user that the work order is delegated to. It is optional and if not set, 
  the owner is assumed to be the delegate
  """
  sellerscName: String
  shareAmount: Int
  shareRefinedValue: Boolean
}

interface WorkOrderInterface {
  createdAt: Timestamp!
  crewShares: [CrewShare!]
  expenses: [WorkOrderExpense!]
  failReason: String
  includeTransferFee: Boolean
  isSold: Boolean
  note: String
  orderId: ID!
  orderType: ActivityEnum!
  owner: User
  ownerId: ID!
  sellStore: String
  seller: User
  sellerUserId: ID
  """
  This is the user that the work order is delegated to. It is optional and if not set, 
  the owner is assumed to be the delegate
  """
  sellerscName: String
  session: Session
  sessionId: ID!
  shareAmount: Int
  state: WorkOrderStateEnum!
  updatedAt: Timestamp!
  version: String!
}

enum WorkOrderStateEnum {
  DONE
  FAILED
  REFINING_COMPLETE
  REFINING_STARTED
  UNKNOWN
}

enum WreckStateEnum {
  DEPLETED
  IGNORE
  READY
}
`