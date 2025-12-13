import gql from 'graphql-tag'

export default gql`
schema {
  query: Query
  mutation: Mutation
}

directive @admin_only on FIELD_DEFINITION

directive @example(value: String) on ARGUMENT_DEFINITION | ENUM | FIELD_DEFINITION | INPUT_FIELD_DEFINITION | INPUT_OBJECT | INTERFACE | OBJECT | SCALAR

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

scalar BigInt

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

"""GraphQL Enums and Unions"""
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
  addFriends(
    """A list of friend user IDs to add."""
    friends: [String]!
  ): UserProfile @logged_in
  """Add a scouting find to a session."""
  addScoutingFind(
    """The scouting find data to add."""
    scoutingFind: ScoutingFindInput!
    """The session ID for the scouting find."""
    sessionId: ID!
    """(Optional) Ship rocks to associate with the find."""
    shipRocks: [ShipRockInput!]
    """(Optional) Vehicle rocks to associate with the find."""
    vehicleRocks: [VehicleRockInput!]
    """(Optional) Salvage wrecks to associate with the find."""
    wrecks: [SalvageWreckInput!]
  ): ScoutingFind @logged_in
  """We need this for users who cannot/will not use the app"""
  addSessionMentions(
    """The Star Citizen names to mention."""
    scNames: [String]!
    """The session ID to add mentions to."""
    sessionId: ID!
  ): Session @logged_in
  blockProspector(
    """True to block, false to unblock."""
    block: Boolean!
    """The user ID of the prospector to block or unblock."""
    userId: ID!
  ): UserProfile @admin_only
  """
  This is for when a user wants to claim a work order that has been delegated to them
  """
  claimWorkOrder(
    """The work order ID to claim."""
    orderId: ID!
    """The session ID for the work order."""
    sessionId: ID!
  ): WorkOrder @logged_in
  createLoadout(
    """The mining loadout data to create."""
    shipLoadout: MiningLoadoutInput!
  ): MiningLoadout @logged_in
  """
  Create a new session with the provided details and defaults.
  This is the public resolver for creating a session.
  """
  createSession(
    """(Optional) Default crew share templates."""
    crewSharesDefaults: [CrewShareTemplateInput!]
    """(Optional) Default salvage ore types."""
    salvageOreDefaults: [SalvageOreEnum!]
    """The session details."""
    session: SessionInput!
    """(Optional) Default session settings."""
    sessionSettings: SessionSettingsInput
    """(Optional) Default ship ore types."""
    shipOreDefaults: [ShipOreEnum!]
    """(Optional) Default vehicle ore types."""
    vehicleOreDefaults: [VehicleOreEnum!]
    """(Optional) Default work order settings."""
    workOrderDefaults: WorkOrderDefaultsInput
  ): Session @logged_in
  createWorkOrder(
    """(Optional) Salvage ore rows for the work order."""
    salvageOres: [SalvageRowInput!]
    """The session ID for the work order."""
    sessionId: ID!
    """The crew shares for the work order."""
    shares: [CrewShareInput!]!
    """(Optional) Ship ore rows for the work order."""
    shipOres: [RefineryRowInput!]
    """(Optional) Vehicle ore rows for the work order."""
    vehicleOres: [VehicleMiningRowInput!]
    """The work order details."""
    workOrder: WorkOrderInput!
  ): WorkOrder @logged_in
  deleteCrewShare(
    """The work order ID for the crew share."""
    orderId: ID!
    """The Star Citizen name of the payee."""
    payeeScName: String!
    """The session ID for the crew share."""
    sessionId: ID!
  ): CrewShare @logged_in
  deleteLoadout(
    """The loadout ID to delete."""
    loadoutId: String!
  ): MiningLoadout @logged_in
  deleteScoutingFind(
    """The scouting find ID to delete."""
    scoutingFindId: ID!
    """The session ID for the scouting find."""
    sessionId: ID!
  ): ScoutingFind @logged_in
  deleteSession(
    """The session ID to delete."""
    sessionId: ID!
  ): ID @logged_in
  deleteUserProfile(
    """If true, leaves user data in place after deletion."""
    leaveData: Boolean
  ): ID @logged_in
  deleteWorkOrder(
    """The work order ID to delete."""
    orderId: ID!
    """The session ID for the work order."""
    sessionId: ID!
  ): WorkOrder @logged_in
  """Marka. work order as delivered."""
  deliverWorkOrder(
    """True if the order is sold, false otherwise."""
    isSold: Boolean!
    """The work order ID to deliver."""
    orderId: ID!
    """The session ID for the work order."""
    sessionId: ID!
  ): WorkOrder @logged_in
  failWorkOrder(
    """The work order ID to fail."""
    orderId: ID!
    """(Optional) The reason for failing the work order."""
    reason: String
    """The session ID for the work order."""
    sessionId: ID!
  ): WorkOrder @logged_in
  joinScoutingFind(
    """(Optional) Whether the user is en route."""
    enRoute: Boolean
    """The scouting find ID to join."""
    scoutingFindId: ID!
    """The session ID for the scouting find."""
    sessionId: ID!
  ): ScoutingFind @logged_in
  joinSession(
    """The join ID for the session."""
    joinId: ID!
  ): SessionUser @logged_in
  leaveScoutingFind(
    """The scouting find ID to leave."""
    scoutingFindId: ID!
    """The session ID for the scouting find."""
    sessionId: ID!
  ): ScoutingFind @logged_in
  leaveSession(
    """The session ID to leave."""
    sessionId: ID!
  ): ID @logged_in
  markCrewSharePaid(
    """True if the share is paid, false otherwise."""
    isPaid: Boolean!
    """The work order ID for the crew share."""
    orderId: ID!
    """The Star Citizen name of the payee."""
    payeeScName: String!
    """The session ID for the crew share."""
    sessionId: ID!
  ): CrewShare @logged_in
  mergeAccount(
    """The authentication token for the account to merge."""
    authToken: String!
    """The authentication type for the account to merge."""
    authType: AuthTypeEnum!
  ): UserProfile @admin_only
  mergeAccountAdmin(
    """The primary user ID for the merge."""
    primaryUserId: String!
    """The secondary user ID to merge into the primary."""
    secondaryUserId: String!
  ): UserProfile
  refreshAvatar(
    """If true, removes the current avatar."""
    remove: Boolean
  ): UserProfile @logged_in
  removeFriends(
    """A list of friend user IDs to remove."""
    friends: [String]!
  ): UserProfile @logged_in
  removeSessionCrew(
    """The Star Citizen names of the crew to remove."""
    scNames: [String]!
    """The session ID to remove crew from."""
    sessionId: ID!
  ): Session @logged_in
  removeSessionMentions(
    """The Star Citizen names to remove from mentions."""
    scNames: [String]!
    """The session ID to remove mentions from."""
    sessionId: ID!
  ): Session @logged_in
  requestVerifyUserProfile: String @logged_in
  rotateShareId(
    """The session ID to rotate the share ID for."""
    sessionId: ID!
  ): Session @logged_in
  """Set lookup data for populating dropdowns and other UI elements."""
  setLookupData(
    """The data to store for the lookup."""
    data: JSONObject!
    """The key for the lookup data to set."""
    key: String!
    """The type of lookup to set."""
    lookupType: LookupTypeEnum!
  ): Boolean @admin_only
  setUserPlan(
    """The plan to assign to the user."""
    plan: UserPlanEnum!
    """The user ID to update the plan for."""
    userId: ID!
  ): UserProfile @admin_only
  updateLoadout(
    """The loadout ID to update."""
    loadoutId: String!
    """The updated mining loadout data."""
    shipLoadout: MiningLoadoutInput!
  ): MiningLoadout @logged_in
  """Modify the session's pending users."""
  updatePendingUsers(
    """The list of pending users to set."""
    pendingUsers: [PendingUserInput!]!
    """The session ID to update pending users for."""
    sessionId: ID!
  ): Session @logged_in
  updateScoutingFind(
    """The updated scouting find data."""
    scoutingFind: ScoutingFindInput!
    """The scouting find ID to update."""
    scoutingFindId: ID!
    """The session ID for the scouting find."""
    sessionId: ID!
    """(Optional) Updated ship rocks."""
    shipRocks: [ShipRockInput!]
    """(Optional) Updated vehicle rocks."""
    vehicleRocks: [VehicleRockInput!]
    """(Optional) Updated salvage wrecks."""
    wrecks: [SalvageWreckInput!]
  ): ScoutingFind @logged_in
  """
    Update an existing session with new details and optional settings.
  This is the public resolver for updating a session.
  """
  updateSession(
    """(Optional) Updated crew share templates."""
    crewSharesDefaults: [CrewShareTemplateInput!]
    """(Optional) Updated salvage ore types."""
    salvageOreDefaults: [SalvageOreEnum!]
    """The updated session details."""
    session: SessionInput!
    """The session ID to update."""
    sessionId: ID!
    """(Optional) Updated session settings."""
    sessionSettings: SessionSettingsInput
    """(Optional) Updated ship ore types."""
    shipOreDefaults: [ShipOreEnum!]
    """(Optional) Updated vehicle ore types."""
    vehicleOreDefaults: [VehicleOreEnum!]
    """(Optional) Updated work order defaults."""
    workOrderDefaults: WorkOrderDefaultsInput
  ): Session @logged_in
  updateSessionUser(
    """The session ID for the user update."""
    sessionId: ID!
    """The session user update data."""
    sessionUser: SessionUserUpdate!
    """The user ID to update."""
    userId: ID!
  ): SessionUser @logged_in
  updateUserProfile(
    """(Optional) Default crew share templates for the user."""
    crewSharesDefaults: [CrewShareTemplateInput!]
    """(Optional) Default salvage ore types for the user."""
    salvageOreDefaults: [SalvageOreEnum!]
    """(Optional) Default session settings for the user."""
    sessionSettings: SessionSettingsInput
    """(Optional) Default ship ore types for the user."""
    shipOreDefaults: [ShipOreEnum!]
    """The updated user profile information."""
    userProfile: UserProfileInput!
    """(Optional) Default vehicle ore types for the user."""
    vehicleOreDefaults: [VehicleOreEnum!]
    """(Optional) Default work order settings for the user."""
    workOrderDefaults: WorkOrderDefaultsInput
  ): UserProfile @logged_in
  updateWorkOrder(
    """The work order ID to update."""
    orderId: ID!
    """(Optional) Updated salvage ore rows."""
    salvageOres: [SalvageRowInput!]
    """The session ID for the work order."""
    sessionId: ID!
    """(Optional) Updated crew shares."""
    shares: [CrewShareInput!]
    """(Optional) Updated ship ore rows."""
    shipOres: [RefineryRowInput!]
    """(Optional) Updated vehicle ore rows."""
    vehicleOres: [VehicleMiningRowInput!]
    """(Optional) Updated work order details."""
    workOrder: WorkOrderInput
  ): WorkOrder @logged_in
  upsertCrewShare(
    """The crew share data to upsert."""
    crewShare: CrewShareInput!
    """The work order ID for the crew share."""
    orderId: ID!
    """The session ID for the crew share."""
    sessionId: ID!
  ): CrewShare @logged_in
  upsertSessionUser(
    """The session ID to update the user for."""
    sessionId: ID!
    """The session user data to upsert."""
    workSessionUser: SessionUserInput
  ): SessionUser @logged_in
  userAPIKey(
    """If true, revokes the API key."""
    revoke: Boolean
    """(Optional) The user ID to get or revoke the API key for."""
    userId: ID
  ): UserProfile @logged_in
  """
  Verify a user by pinging CIG's website and looking for a verification code in the text of the page
  """
  verifyUserProfile(
    """The verification code sent to the user."""
    code: String
  ): UserProfile @logged_in
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
  shareAmount: BigInt
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
  """Fetch paginated crew shares for a session and (optionally) an order."""
  crewShares(
    """(Optional) The pagination token for fetching the next page."""
    nextToken: String
    """(Optional) The unique identifier (GUID) of the work order."""
    orderId: ID
    """The unique identifier (GUID) of the session."""
    sessionId: ID!
  ): PaginatedCrewShares @logged_in
  """
  Returns lookup data for populating dropdowns and other UI elements.
  This is the public resolver for the session user.
  """
  lookups: LookupData
  """
  Returns the currently authenticated user's profile.
  Requires authentication.
  """
  profile: UserProfile @logged_in
  """Fetch a scouting find by session and scouting find ID."""
  scoutingFind(
    """The unique identifier (GUID) of the scouting find."""
    scoutingFindId: ID!
    """The unique identifier (GUID) of the session."""
    sessionId: ID!
  ): ScoutingFind @logged_in
  """Fetch a session by its session ID."""
  session(
    """The unique identifier (GUID) of the session to fetch."""
    sessionId: ID!
  ): Session @logged_in
  """Fetch a shared session using a public join ID."""
  sessionShare(
    """The public join identifier (GUID) for the session."""
    joinId: ID!
  ): SessionShare
  """Fetch updates for a session since the last check timestamp."""
  sessionUpdates(
    """(Optional) The timestamp of the last check for updates."""
    lastCheck: String
    """The unique identifier (GUID) of the session."""
    sessionId: ID!
  ): [SessionUpdate] @logged_in
  """Fetch the session user object for the current session."""
  sessionUser(
    """The unique identifier (GUID) of the session."""
    sessionId: ID!
  ): SessionUser @logged_in
  """Fetch survey data for a given epoch and data name."""
  surveyData(
    """The name of the survey data set."""
    dataName: String!
    """The epoch to fetch survey data for."""
    epoch: String!
  ): SurveyData
  """Fetch a user by their user ID (GUID)."""
  user(
    """The unique identifier (GUID) of the user to fetch."""
    userId: ID! @example(value: "00000000-0000-0000-0000-000000000000")
  ): User @logged_in
  """Fetch a work order by session and order ID."""
  workOrder(
    """The unique identifier (GUID) of the work order."""
    orderId: ID!
    """The unique identifier (GUID) of the session."""
    sessionId: ID!
  ): WorkOrder @logged_in
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
  NYX_LEVSKI
  NYX_STANTG
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
  shareAmount: BigInt
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
  sellableAUEC: BigInt
  shipCode: String
  state: WreckStateEnum!
}

input SalvageWreckInput {
  isShip: Boolean!
  salvageOres: [SalvageWreckOreInput!]!
  sellableAUEC: BigInt
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
  aUEC: BigInt
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

"""This is the object that represents a session update."""
type SessionUpdate {
  data: SessionUpdateUnion
  eventDate: Timestamp!
  eventName: EventNameEnum
  sessionId: ID!
}

"""GraphQL Enums for Lookup Types"""
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
  shareAmount: BigInt
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
  LINDINIUM
  QUANTANIUM
  QUARTZ
  RICCITE
  SAVRILIUM
  SILICON
  STILERON
  TARANITE
  TIN
  TITANIUM
  TORITE
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

"""
This is object that represents the survey data for a specific epoch and data name.
"""
type SurveyData {
  data: JSONObject
  dataName: String!
  epoch: String!
  lastUpdated: Timestamp
}

enum SystemEnum {
  NYX
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
  shareAmount: BigInt
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
  shareAmount: BigInt
  shareRefinedValue: Boolean
}

type WorkOrderExpense {
  amount: BigInt!
  name: String!
  ownerScName: String!
}

input WorkOrderExpenseInput {
  amount: BigInt!
  name: String!
  ownerScName: String!
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
  profit: BigInt
  refinery: RefineryEnum
  sellStore: String
  sellerUserId: ID
  """
  This is the user that the work order is delegated to. It is optional and if not set, 
  the owner is assumed to be the delegate
  """
  sellerscName: String
  shareAmount: BigInt
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
  shareAmount: BigInt
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