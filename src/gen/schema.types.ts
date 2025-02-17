import { RockType } from '../types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSONObject: { input: Record<string, any>; output: Record<string, any>; }
  RockType: { input: RockType; output: RockType; }
  Timestamp: { input: number; output: number; }
};

export type ApiEvent = {
  __typename: 'APIEvent';
  ScoutingFindID?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  orderId?: Maybe<Scalars['ID']['output']>;
  sessionId?: Maybe<Scalars['ID']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  type: ApiEventTypeEnum;
};

export const ApiEventTypeEnum = {
  Created: 'CREATED',
  CsCreated: 'CS_CREATED',
  CsDeleted: 'CS_DELETED',
  CsUpdated: 'CS_UPDATED',
  Deleted: 'DELETED',
  Joined: 'JOINED',
  Left: 'LEFT',
  MjCreated: 'MJ_CREATED',
  MjDeleted: 'MJ_DELETED',
  MjUpdated: 'MJ_UPDATED',
  RcCreated: 'RC_CREATED',
  RcDeleted: 'RC_DELETED',
  RcUpdated: 'RC_UPDATED',
  Updated: 'UPDATED'
} as const;

export type ApiEventTypeEnum = typeof ApiEventTypeEnum[keyof typeof ApiEventTypeEnum];
export type ActiveMiningLaserLoadout = {
  __typename: 'ActiveMiningLaserLoadout';
  laser: MiningLaserEnum;
  laserActive: Scalars['Boolean']['output'];
  modules: Array<Maybe<MiningModuleEnum>>;
  modulesActive: Array<Scalars['Boolean']['output']>;
};

export type ActiveMiningLaserLoadoutInput = {
  laser: MiningLaserEnum;
  laserActive: Scalars['Boolean']['input'];
  modules: Array<InputMaybe<MiningModuleEnum>>;
  modulesActive: Array<Scalars['Boolean']['input']>;
};

export const ActivityEnum = {
  Other: 'OTHER',
  Salvage: 'SALVAGE',
  ShipMining: 'SHIP_MINING',
  VehicleMining: 'VEHICLE_MINING'
} as const;

export type ActivityEnum = typeof ActivityEnum[keyof typeof ActivityEnum];
export const AsteroidTypeEnum = {
  Ctype: 'CTYPE',
  Etype: 'ETYPE',
  Itype: 'ITYPE',
  Mtype: 'MTYPE',
  Ptype: 'PTYPE',
  Qtype: 'QTYPE',
  Stype: 'STYPE'
} as const;

export type AsteroidTypeEnum = typeof AsteroidTypeEnum[keyof typeof AsteroidTypeEnum];
export const AuthTypeEnum = {
  ApiKey: 'API_KEY',
  Discord: 'DISCORD',
  Google: 'GOOGLE'
} as const;

export type AuthTypeEnum = typeof AuthTypeEnum[keyof typeof AuthTypeEnum];
export type CigLookups = {
  __typename: 'CIGLookups';
  densitiesLookups?: Maybe<Scalars['JSONObject']['output']>;
  methodsBonusLookup?: Maybe<Scalars['JSONObject']['output']>;
  oreProcessingLookup?: Maybe<Scalars['JSONObject']['output']>;
  refineryBonusLookup?: Maybe<Scalars['JSONObject']['output']>;
};

export type CrewShare = {
  __typename: 'CrewShare';
  createdAt: Scalars['Timestamp']['output'];
  note?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['ID']['output'];
  payeeScName: Scalars['String']['output'];
  payeeUserId?: Maybe<Scalars['ID']['output']>;
  session?: Maybe<Session>;
  sessionId: Scalars['ID']['output'];
  share: Scalars['Float']['output'];
  /**
   * We explicitly require the name of the share type to be passed in in case the user is deleted OR
   * if they change their SCName. This way we can still track who paid whom.
   */
  shareType: ShareTypeEnum;
  state?: Maybe<Scalars['Boolean']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
  workOrder?: Maybe<WorkOrder>;
};

export type CrewShareInput = {
  note?: InputMaybe<Scalars['String']['input']>;
  /**
   * We explicitly require the name of the share type to be passed in in case the user is deleted OR
   * if they change their SCName. This way we can still track who paid whom.
   */
  payeeScName?: InputMaybe<Scalars['String']['input']>;
  payeeUserId?: InputMaybe<Scalars['ID']['input']>;
  share: Scalars['Float']['input'];
  shareType: ShareTypeEnum;
  state: Scalars['Boolean']['input'];
};

export type CrewShareTemplate = {
  __typename: 'CrewShareTemplate';
  note?: Maybe<Scalars['String']['output']>;
  /**
   * We explicitly require the name of the share type to be passed in in case the user is deleted OR
   * if they change their SCName. This way we can still track who paid whom.
   */
  payeeScName: Scalars['String']['output'];
  share: Scalars['Float']['output'];
  shareType: ShareTypeEnum;
};

export type CrewShareTemplateInput = {
  note?: InputMaybe<Scalars['String']['input']>;
  /**
   * We explicitly require the name of the share type to be passed in in case the user is deleted OR
   * if they change their SCName. This way we can still track who paid whom.
   */
  payeeScName: Scalars['String']['input'];
  share: Scalars['Float']['input'];
  shareType: ShareTypeEnum;
};

export type CrewShareUpdate = {
  note?: InputMaybe<Scalars['String']['input']>;
  /**
   * We explicitly require the name of the share type to be passed in in case the user is deleted OR
   * if they change their SCName. This way we can still track who paid whom.
   */
  payeeScName?: InputMaybe<Scalars['String']['input']>;
  payeeUserId?: InputMaybe<Scalars['ID']['input']>;
  share?: InputMaybe<Scalars['Float']['input']>;
  shareType?: InputMaybe<ShareTypeEnum>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export const DepositTypeEnum = {
  Atacamite: 'ATACAMITE',
  Felsic: 'FELSIC',
  Gneiss: 'GNEISS',
  Granite: 'GRANITE',
  Igneous: 'IGNEOUS',
  Obsidian: 'OBSIDIAN',
  Quartzite: 'QUARTZITE',
  Shale: 'SHALE'
} as const;

export type DepositTypeEnum = typeof DepositTypeEnum[keyof typeof DepositTypeEnum];
export type DiscordGuild = DiscordGuildInterface & {
  __typename: 'DiscordGuild';
  iconUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type DiscordGuildInput = {
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type DiscordGuildInterface = {
  iconUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export const EventNameEnum = {
  Insert: 'INSERT',
  Modify: 'MODIFY',
  Remove: 'REMOVE'
} as const;

export type EventNameEnum = typeof EventNameEnum[keyof typeof EventNameEnum];
export const LoadoutShipEnum = {
  Mole: 'MOLE',
  Prospector: 'PROSPECTOR'
} as const;

export type LoadoutShipEnum = typeof LoadoutShipEnum[keyof typeof LoadoutShipEnum];
export const LocationEnum = {
  Cave: 'CAVE',
  Ring: 'RING',
  Space: 'SPACE',
  Surface: 'SURFACE'
} as const;

export type LocationEnum = typeof LocationEnum[keyof typeof LocationEnum];
export type LookupData = {
  __typename: 'LookupData';
  CIG?: Maybe<CigLookups>;
  UEX?: Maybe<UexLookups>;
  loadout?: Maybe<Scalars['JSONObject']['output']>;
};

export const LookupTypeEnum = {
  Cig: 'CIG',
  Uex: 'UEX'
} as const;

export type LookupTypeEnum = typeof LookupTypeEnum[keyof typeof LookupTypeEnum];
export const MiningGadgetEnum = {
  Boremax: 'Boremax',
  Okunis: 'Okunis',
  Optimax: 'Optimax',
  Sabir: 'Sabir',
  Stalwart: 'Stalwart',
  Waveshift: 'Waveshift'
} as const;

export type MiningGadgetEnum = typeof MiningGadgetEnum[keyof typeof MiningGadgetEnum];
export const MiningLaserEnum = {
  ArborMh1: 'ArborMH1',
  ArborMh2: 'ArborMH2',
  HelixI: 'HelixI',
  HelixIi: 'HelixII',
  HofstedeS1: 'HofstedeS1',
  HofstedeS2: 'HofstedeS2',
  ImpactI: 'ImpactI',
  ImpactIi: 'ImpactII',
  KleinS1: 'KleinS1',
  KleinS2: 'KleinS2',
  LancetMh1: 'LancetMH1',
  LancetMh2: 'LancetMH2'
} as const;

export type MiningLaserEnum = typeof MiningLaserEnum[keyof typeof MiningLaserEnum];
export type MiningLoadout = {
  __typename: 'MiningLoadout';
  activeGadgetIndex?: Maybe<Scalars['Int']['output']>;
  activeLasers: Array<Maybe<ActiveMiningLaserLoadout>>;
  createdAt: Scalars['Timestamp']['output'];
  inventoryGadgets: Array<MiningGadgetEnum>;
  inventoryLasers: Array<MiningLaserEnum>;
  inventoryModules: Array<MiningModuleEnum>;
  loadoutId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner: User;
  ship: LoadoutShipEnum;
  updatedAt: Scalars['Timestamp']['output'];
};

export type MiningLoadoutInput = {
  activeGadgetIndex?: InputMaybe<Scalars['Int']['input']>;
  activeLasers: Array<InputMaybe<ActiveMiningLaserLoadoutInput>>;
  inventoryGadgets: Array<MiningGadgetEnum>;
  inventoryLasers: Array<MiningLaserEnum>;
  inventoryModules: Array<MiningModuleEnum>;
  name: Scalars['String']['input'];
  ship: LoadoutShipEnum;
};

export const MiningModuleEnum = {
  Brandt: 'Brandt',
  Fltr: 'FLTR',
  Fltrl: 'FLTRL',
  Fltrxl: 'FLTRXL',
  Focus: 'Focus',
  FocusIi: 'FocusII',
  FocusIii: 'FocusIII',
  Forel: 'Forel',
  Lifeline: 'Lifeline',
  Optimum: 'Optimum',
  Rieger: 'Rieger',
  RiegerC2: 'RiegerC2',
  RiegerC3: 'RiegerC3',
  Rime: 'Rime',
  Stampede: 'Stampede',
  Surge: 'Surge',
  Torpid: 'Torpid',
  Torrent: 'Torrent',
  TorrentIi: 'TorrentII',
  TorrentIii: 'TorrentIII',
  Vaux: 'Vaux',
  VauxC2: 'VauxC2',
  VauxC3: 'VauxC3',
  Xtr: 'XTR',
  Xtrl: 'XTRL',
  Xtrxl: 'XTRXL'
} as const;

export type MiningModuleEnum = typeof MiningModuleEnum[keyof typeof MiningModuleEnum];
export type Mutation = {
  __typename: 'Mutation';
  addFriends?: Maybe<UserProfile>;
  addScoutingFind?: Maybe<ScoutingFind>;
  /** We need this for users who cannot/will not use the app */
  addSessionMentions?: Maybe<Session>;
  blockProspector?: Maybe<UserProfile>;
  /** This is for when a user wants to claim a work order that has been delegated to them */
  claimWorkOrder?: Maybe<WorkOrder>;
  createLoadout?: Maybe<MiningLoadout>;
  createSession?: Maybe<Session>;
  createWorkOrder?: Maybe<WorkOrder>;
  deleteCrewShare?: Maybe<CrewShare>;
  deleteLoadout?: Maybe<MiningLoadout>;
  deleteScoutingFind?: Maybe<ScoutingFind>;
  deleteSession?: Maybe<Scalars['ID']['output']>;
  deleteUserProfile?: Maybe<Scalars['ID']['output']>;
  deleteWorkOrder?: Maybe<WorkOrder>;
  deliverWorkOrder?: Maybe<WorkOrder>;
  failWorkOrder?: Maybe<WorkOrder>;
  joinScoutingFind?: Maybe<ScoutingFind>;
  joinSession?: Maybe<SessionUser>;
  leaveScoutingFind?: Maybe<ScoutingFind>;
  leaveSession?: Maybe<Scalars['ID']['output']>;
  markCrewSharePaid?: Maybe<CrewShare>;
  mergeAccount?: Maybe<UserProfile>;
  mergeAccountAdmin?: Maybe<UserProfile>;
  refreshAvatar?: Maybe<UserProfile>;
  removeFriends?: Maybe<UserProfile>;
  removeSessionCrew?: Maybe<Session>;
  removeSessionMentions?: Maybe<Session>;
  requestVerifyUserProfile?: Maybe<Scalars['String']['output']>;
  rotateShareId?: Maybe<Session>;
  setLookupData?: Maybe<Scalars['Boolean']['output']>;
  setUserPlan?: Maybe<UserProfile>;
  updateLoadout?: Maybe<MiningLoadout>;
  updatePendingUsers?: Maybe<Session>;
  updateScoutingFind?: Maybe<ScoutingFind>;
  updateSession?: Maybe<Session>;
  updateSessionUser?: Maybe<SessionUser>;
  updateUserProfile?: Maybe<UserProfile>;
  updateWorkOrder?: Maybe<WorkOrder>;
  upsertCrewShare?: Maybe<CrewShare>;
  upsertSessionUser?: Maybe<SessionUser>;
  userAPIKey?: Maybe<UserProfile>;
  verifyUserProfile?: Maybe<UserProfile>;
};


export type MutationAddFriendsArgs = {
  friends: Array<InputMaybe<Scalars['String']['input']>>;
};


export type MutationAddScoutingFindArgs = {
  scoutingFind: ScoutingFindInput;
  sessionId: Scalars['ID']['input'];
  shipRocks?: InputMaybe<Array<ShipRockInput>>;
  vehicleRocks?: InputMaybe<Array<VehicleRockInput>>;
  wrecks?: InputMaybe<Array<SalvageWreckInput>>;
};


export type MutationAddSessionMentionsArgs = {
  scNames: Array<InputMaybe<Scalars['String']['input']>>;
  sessionId: Scalars['ID']['input'];
};


export type MutationBlockProspectorArgs = {
  block: Scalars['Boolean']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationClaimWorkOrderArgs = {
  orderId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationCreateLoadoutArgs = {
  shipLoadout: MiningLoadoutInput;
};


export type MutationCreateSessionArgs = {
  crewSharesDefaults?: InputMaybe<Array<CrewShareTemplateInput>>;
  salvageOreDefaults?: InputMaybe<Array<SalvageOreEnum>>;
  session: SessionInput;
  sessionSettings?: InputMaybe<SessionSettingsInput>;
  shipOreDefaults?: InputMaybe<Array<ShipOreEnum>>;
  vehicleOreDefaults?: InputMaybe<Array<VehicleOreEnum>>;
  workOrderDefaults?: InputMaybe<WorkOrderDefaultsInput>;
};


export type MutationCreateWorkOrderArgs = {
  salvageOres?: InputMaybe<Array<SalvageRowInput>>;
  sessionId: Scalars['ID']['input'];
  shares: Array<CrewShareInput>;
  shipOres?: InputMaybe<Array<RefineryRowInput>>;
  vehicleOres?: InputMaybe<Array<VehicleMiningRowInput>>;
  workOrder: WorkOrderInput;
};


export type MutationDeleteCrewShareArgs = {
  orderId: Scalars['ID']['input'];
  payeeScName: Scalars['String']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationDeleteLoadoutArgs = {
  loadoutId: Scalars['String']['input'];
};


export type MutationDeleteScoutingFindArgs = {
  scoutingFindId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationDeleteSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationDeleteUserProfileArgs = {
  leaveData?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteWorkOrderArgs = {
  orderId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationDeliverWorkOrderArgs = {
  isSold: Scalars['Boolean']['input'];
  orderId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationFailWorkOrderArgs = {
  orderId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  sessionId: Scalars['ID']['input'];
};


export type MutationJoinScoutingFindArgs = {
  enRoute?: InputMaybe<Scalars['Boolean']['input']>;
  scoutingFindId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationJoinSessionArgs = {
  joinId: Scalars['ID']['input'];
};


export type MutationLeaveScoutingFindArgs = {
  scoutingFindId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationLeaveSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationMarkCrewSharePaidArgs = {
  isPaid: Scalars['Boolean']['input'];
  orderId: Scalars['ID']['input'];
  payeeScName: Scalars['String']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationMergeAccountArgs = {
  authToken: Scalars['String']['input'];
  authType: AuthTypeEnum;
};


export type MutationMergeAccountAdminArgs = {
  primaryUserId: Scalars['String']['input'];
  secondaryUserId: Scalars['String']['input'];
};


export type MutationRefreshAvatarArgs = {
  remove?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationRemoveFriendsArgs = {
  friends: Array<InputMaybe<Scalars['String']['input']>>;
};


export type MutationRemoveSessionCrewArgs = {
  scNames: Array<InputMaybe<Scalars['String']['input']>>;
  sessionId: Scalars['ID']['input'];
};


export type MutationRemoveSessionMentionsArgs = {
  scNames: Array<InputMaybe<Scalars['String']['input']>>;
  sessionId: Scalars['ID']['input'];
};


export type MutationRotateShareIdArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationSetLookupDataArgs = {
  data: Scalars['JSONObject']['input'];
  key: Scalars['String']['input'];
  lookupType: LookupTypeEnum;
};


export type MutationSetUserPlanArgs = {
  plan: UserPlanEnum;
  userId: Scalars['ID']['input'];
};


export type MutationUpdateLoadoutArgs = {
  loadoutId: Scalars['String']['input'];
  shipLoadout: MiningLoadoutInput;
};


export type MutationUpdatePendingUsersArgs = {
  pendingUsers: Array<PendingUserInput>;
  sessionId: Scalars['ID']['input'];
};


export type MutationUpdateScoutingFindArgs = {
  scoutingFind: ScoutingFindInput;
  scoutingFindId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
  shipRocks?: InputMaybe<Array<ShipRockInput>>;
  vehicleRocks?: InputMaybe<Array<VehicleRockInput>>;
  wrecks?: InputMaybe<Array<SalvageWreckInput>>;
};


export type MutationUpdateSessionArgs = {
  crewSharesDefaults?: InputMaybe<Array<CrewShareTemplateInput>>;
  salvageOreDefaults?: InputMaybe<Array<SalvageOreEnum>>;
  session: SessionInput;
  sessionId: Scalars['ID']['input'];
  sessionSettings?: InputMaybe<SessionSettingsInput>;
  shipOreDefaults?: InputMaybe<Array<ShipOreEnum>>;
  vehicleOreDefaults?: InputMaybe<Array<VehicleOreEnum>>;
  workOrderDefaults?: InputMaybe<WorkOrderDefaultsInput>;
};


export type MutationUpdateSessionUserArgs = {
  sessionId: Scalars['ID']['input'];
  sessionUser: SessionUserUpdate;
  userId: Scalars['ID']['input'];
};


export type MutationUpdateUserProfileArgs = {
  crewSharesDefaults?: InputMaybe<Array<CrewShareTemplateInput>>;
  salvageOreDefaults?: InputMaybe<Array<SalvageOreEnum>>;
  sessionSettings?: InputMaybe<SessionSettingsInput>;
  shipOreDefaults?: InputMaybe<Array<ShipOreEnum>>;
  userProfile: UserProfileInput;
  vehicleOreDefaults?: InputMaybe<Array<VehicleOreEnum>>;
  workOrderDefaults?: InputMaybe<WorkOrderDefaultsInput>;
};


export type MutationUpdateWorkOrderArgs = {
  orderId: Scalars['ID']['input'];
  salvageOres?: InputMaybe<Array<SalvageRowInput>>;
  sessionId: Scalars['ID']['input'];
  shares?: InputMaybe<Array<CrewShareInput>>;
  shipOres?: InputMaybe<Array<RefineryRowInput>>;
  vehicleOres?: InputMaybe<Array<VehicleMiningRowInput>>;
  workOrder?: InputMaybe<WorkOrderInput>;
};


export type MutationUpsertCrewShareArgs = {
  crewShare: CrewShareInput;
  orderId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
};


export type MutationUpsertSessionUserArgs = {
  sessionId: Scalars['ID']['input'];
  workSessionUser?: InputMaybe<SessionUserInput>;
};


export type MutationUserApiKeyArgs = {
  revoke?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationVerifyUserProfileArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};

export type MyDiscordGuild = DiscordGuildInterface & {
  __typename: 'MyDiscordGuild';
  hasPermission?: Maybe<Scalars['Boolean']['output']>;
  iconUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type OtherOrder = WorkOrderInterface & {
  __typename: 'OtherOrder';
  createdAt: Scalars['Timestamp']['output'];
  crewShares?: Maybe<Array<CrewShare>>;
  expenses?: Maybe<Array<WorkOrderExpense>>;
  failReason?: Maybe<Scalars['String']['output']>;
  includeTransferFee?: Maybe<Scalars['Boolean']['output']>;
  isSold?: Maybe<Scalars['Boolean']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['ID']['output'];
  orderType: ActivityEnum;
  owner?: Maybe<User>;
  ownerId: Scalars['ID']['output'];
  sellStore?: Maybe<Scalars['String']['output']>;
  seller?: Maybe<User>;
  sellerUserId?: Maybe<Scalars['ID']['output']>;
  /**
   * This is the user that the work order is delegated to. It is optional and if not set,
   * the owner is assumed to be the delegate
   */
  sellerscName?: Maybe<Scalars['String']['output']>;
  session?: Maybe<Session>;
  sessionId: Scalars['ID']['output'];
  shareAmount?: Maybe<Scalars['Int']['output']>;
  state: WorkOrderStateEnum;
  updatedAt: Scalars['Timestamp']['output'];
  version: Scalars['String']['output'];
};

export type PaginatedCrewShares = {
  __typename: 'PaginatedCrewShares';
  items: Array<CrewShare>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type PaginatedScoutingFinds = {
  __typename: 'PaginatedScoutingFinds';
  items: Array<ScoutingFind>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type PaginatedSessionUsers = {
  __typename: 'PaginatedSessionUsers';
  items: Array<SessionUser>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type PaginatedSessions = {
  __typename: 'PaginatedSessions';
  items: Array<Session>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type PaginatedUsers = {
  __typename: 'PaginatedUsers';
  items: Array<User>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type PaginatedWorkOrders = {
  __typename: 'PaginatedWorkOrders';
  items: Array<WorkOrder>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type PendingUser = {
  __typename: 'PendingUser';
  captainId?: Maybe<Scalars['ID']['output']>;
  scName: Scalars['String']['output'];
  sessionRole?: Maybe<Scalars['String']['output']>;
  shipRole?: Maybe<Scalars['String']['output']>;
};

export type PendingUserInput = {
  captainId?: InputMaybe<Scalars['ID']['input']>;
  scName: Scalars['String']['input'];
  sessionRole?: InputMaybe<SessionRoleEnum>;
  shipRole?: InputMaybe<ShipRoleEnum>;
};

export type Query = {
  __typename: 'Query';
  captureRefineryOrder?: Maybe<ShipMiningOrderCapture>;
  captureShipRockScan?: Maybe<ShipRockCapture>;
  crewShares?: Maybe<PaginatedCrewShares>;
  lookups?: Maybe<LookupData>;
  profile?: Maybe<UserProfile>;
  scoutingFind?: Maybe<ScoutingFind>;
  session?: Maybe<Session>;
  sessionShare?: Maybe<SessionShare>;
  sessionUpdates?: Maybe<Array<Maybe<SessionUpdate>>>;
  sessionUser?: Maybe<SessionUser>;
  surveyData?: Maybe<SurveyData>;
  user?: Maybe<User>;
  workOrder?: Maybe<WorkOrder>;
};


export type QueryCaptureRefineryOrderArgs = {
  imgUrl: Scalars['String']['input'];
};


export type QueryCaptureShipRockScanArgs = {
  imgUrl: Scalars['String']['input'];
};


export type QueryCrewSharesArgs = {
  nextToken?: InputMaybe<Scalars['String']['input']>;
  orderId?: InputMaybe<Scalars['ID']['input']>;
  sessionId: Scalars['ID']['input'];
};


export type QueryScoutingFindArgs = {
  scoutingFindId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
};


export type QuerySessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type QuerySessionShareArgs = {
  joinId: Scalars['ID']['input'];
};


export type QuerySessionUpdatesArgs = {
  lastCheck?: InputMaybe<Scalars['String']['input']>;
  sessionId: Scalars['ID']['input'];
};


export type QuerySessionUserArgs = {
  sessionId: Scalars['ID']['input'];
};


export type QuerySurveyDataArgs = {
  dataName: Scalars['String']['input'];
  epoch: Scalars['String']['input'];
};


export type QueryUserArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryWorkOrderArgs = {
  orderId: Scalars['ID']['input'];
  sessionId: Scalars['ID']['input'];
};

export const RefineryEnum = {
  Arcl1: 'ARCL1',
  Arcl2: 'ARCL2',
  Arcl4: 'ARCL4',
  Crul1: 'CRUL1',
  Hurl1: 'HURL1',
  Hurl2: 'HURL2',
  Magng: 'MAGNG',
  Micl1: 'MICL1',
  Micl2: 'MICL2',
  Micl5: 'MICL5',
  Pyrog: 'PYROG',
  PyroCheckmate: 'PYRO_CHECKMATE',
  PyroOrbituary: 'PYRO_ORBITUARY',
  PyroRuin: 'PYRO_RUIN',
  PyroStantg: 'PYRO_STANTG',
  Terrg: 'TERRG'
} as const;

export type RefineryEnum = typeof RefineryEnum[keyof typeof RefineryEnum];
export const RefineryMethodEnum = {
  Cormack: 'CORMACK',
  DinyxSolventation: 'DINYX_SOLVENTATION',
  Electrostarolysis: 'ELECTROSTAROLYSIS',
  FerronExchange: 'FERRON_EXCHANGE',
  GaskinProcess: 'GASKIN_PROCESS',
  KazenWinnowing: 'KAZEN_WINNOWING',
  PyrometricChromalysis: 'PYROMETRIC_CHROMALYSIS',
  ThermonaticDeposition: 'THERMONATIC_DEPOSITION',
  XcrReaction: 'XCR_REACTION'
} as const;

export type RefineryMethodEnum = typeof RefineryMethodEnum[keyof typeof RefineryMethodEnum];
export type RefineryRow = {
  __typename: 'RefineryRow';
  amt: Scalars['Int']['output'];
  ore: ShipOreEnum;
  yield: Scalars['Int']['output'];
};

export type RefineryRowCapture = {
  __typename: 'RefineryRowCapture';
  amt?: Maybe<Scalars['Int']['output']>;
  ore: ShipOreEnum;
  yield?: Maybe<Scalars['Int']['output']>;
};

export type RefineryRowInput = {
  amt: Scalars['Int']['input'];
  ore: ShipOreEnum;
};

export const RockStateEnum = {
  Depleted: 'DEPLETED',
  Ignore: 'IGNORE',
  Ready: 'READY'
} as const;

export type RockStateEnum = typeof RockStateEnum[keyof typeof RockStateEnum];
export type SalvageFind = ScoutingFindInterface & {
  __typename: 'SalvageFind';
  attendance?: Maybe<Array<SessionUser>>;
  attendanceIds: Array<Scalars['ID']['output']>;
  clusterCount?: Maybe<Scalars['Int']['output']>;
  clusterType: ScoutingFindTypeEnum;
  createdAt: Scalars['Timestamp']['output'];
  gravityWell?: Maybe<Scalars['String']['output']>;
  includeInSurvey?: Maybe<Scalars['Boolean']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<User>;
  ownerId: Scalars['ID']['output'];
  rawScore?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
  scoutingFindId: Scalars['ID']['output'];
  sessionId: Scalars['ID']['output'];
  state: ScoutingFindStateEnum;
  surveyBonus?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
  version: Scalars['String']['output'];
  wrecks: Array<SalvageWreck>;
};

export type SalvageOrder = WorkOrderInterface & {
  __typename: 'SalvageOrder';
  createdAt: Scalars['Timestamp']['output'];
  crewShares?: Maybe<Array<CrewShare>>;
  expenses?: Maybe<Array<WorkOrderExpense>>;
  failReason?: Maybe<Scalars['String']['output']>;
  includeTransferFee?: Maybe<Scalars['Boolean']['output']>;
  isSold?: Maybe<Scalars['Boolean']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['ID']['output'];
  orderType: ActivityEnum;
  owner?: Maybe<User>;
  ownerId: Scalars['ID']['output'];
  salvageOres: Array<SalvageRow>;
  sellStore?: Maybe<Scalars['String']['output']>;
  seller?: Maybe<User>;
  sellerUserId?: Maybe<Scalars['ID']['output']>;
  /**
   * This is the user that the work order is delegated to. It is optional and if not set,
   * the owner is assumed to be the delegate
   */
  sellerscName?: Maybe<Scalars['String']['output']>;
  session?: Maybe<Session>;
  sessionId: Scalars['ID']['output'];
  shareAmount?: Maybe<Scalars['Int']['output']>;
  state: WorkOrderStateEnum;
  updatedAt: Scalars['Timestamp']['output'];
  version: Scalars['String']['output'];
};

export const SalvageOreEnum = {
  Cmat: 'CMAT',
  Rmc: 'RMC'
} as const;

export type SalvageOreEnum = typeof SalvageOreEnum[keyof typeof SalvageOreEnum];
export type SalvageRow = {
  __typename: 'SalvageRow';
  amt: Scalars['Int']['output'];
  ore: SalvageOreEnum;
};

export type SalvageRowInput = {
  amt: Scalars['Int']['input'];
  ore: SalvageOreEnum;
};

export type SalvageWreck = {
  __typename: 'SalvageWreck';
  isShip: Scalars['Boolean']['output'];
  salvageOres: Array<SalvageWreckOre>;
  sellableAUEC?: Maybe<Scalars['Int']['output']>;
  shipCode?: Maybe<Scalars['String']['output']>;
  state: WreckStateEnum;
};

export type SalvageWreckInput = {
  isShip: Scalars['Boolean']['input'];
  salvageOres: Array<SalvageWreckOreInput>;
  sellableAUEC?: InputMaybe<Scalars['Int']['input']>;
  shipCode?: InputMaybe<Scalars['String']['input']>;
  state: WreckStateEnum;
};

export type SalvageWreckOre = {
  __typename: 'SalvageWreckOre';
  ore: SalvageOreEnum;
  scu: Scalars['Int']['output'];
};

export type SalvageWreckOreInput = {
  ore: SalvageOreEnum;
  scu: Scalars['Int']['input'];
};

export type ScoutingFind = SalvageFind | ShipClusterFind | VehicleClusterFind;

export type ScoutingFindInput = {
  clusterCount?: InputMaybe<Scalars['Int']['input']>;
  gravityWell?: InputMaybe<Scalars['String']['input']>;
  includeInSurvey?: InputMaybe<Scalars['Boolean']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  state: ScoutingFindStateEnum;
};

export type ScoutingFindInterface = {
  attendance?: Maybe<Array<SessionUser>>;
  attendanceIds: Array<Scalars['ID']['output']>;
  clusterCount?: Maybe<Scalars['Int']['output']>;
  clusterType: ScoutingFindTypeEnum;
  createdAt: Scalars['Timestamp']['output'];
  gravityWell?: Maybe<Scalars['String']['output']>;
  includeInSurvey?: Maybe<Scalars['Boolean']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<User>;
  ownerId: Scalars['ID']['output'];
  rawScore?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
  scoutingFindId: Scalars['ID']['output'];
  sessionId: Scalars['ID']['output'];
  state: ScoutingFindStateEnum;
  surveyBonus?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
  version: Scalars['String']['output'];
};

/** The state of a cluster found by a scout */
export const ScoutingFindStateEnum = {
  Abandonned: 'ABANDONNED',
  Depleted: 'DEPLETED',
  Discovered: 'DISCOVERED',
  ReadyForWorkers: 'READY_FOR_WORKERS',
  Working: 'WORKING'
} as const;

export type ScoutingFindStateEnum = typeof ScoutingFindStateEnum[keyof typeof ScoutingFindStateEnum];
export const ScoutingFindTypeEnum = {
  Salvage: 'SALVAGE',
  Ship: 'SHIP',
  Vehicle: 'VEHICLE'
} as const;

export type ScoutingFindTypeEnum = typeof ScoutingFindTypeEnum[keyof typeof ScoutingFindTypeEnum];
export type SellStores = {
  __typename: 'SellStores';
  gem?: Maybe<Scalars['String']['output']>;
  oreRaw?: Maybe<Scalars['String']['output']>;
  oreRefined?: Maybe<Scalars['String']['output']>;
  salvage?: Maybe<Scalars['String']['output']>;
};

export type Session = {
  __typename: 'Session';
  activeMemberIds?: Maybe<Array<Scalars['String']['output']>>;
  activeMembers?: Maybe<PaginatedSessionUsers>;
  createdAt: Scalars['Timestamp']['output'];
  finishedAt?: Maybe<Scalars['Timestamp']['output']>;
  joinId: Scalars['ID']['output'];
  mentionedUsers: Array<PendingUser>;
  name?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  onTheList?: Maybe<Scalars['Boolean']['output']>;
  owner?: Maybe<User>;
  ownerId: Scalars['ID']['output'];
  scouting?: Maybe<PaginatedScoutingFinds>;
  sessionId: Scalars['ID']['output'];
  sessionSettings: SessionSettings;
  state: SessionStateEnum;
  summary?: Maybe<SessionSummary>;
  updatedAt: Scalars['Timestamp']['output'];
  version?: Maybe<Scalars['String']['output']>;
  workOrders?: Maybe<PaginatedWorkOrders>;
};


export type SessionActiveMembersArgs = {
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type SessionScoutingArgs = {
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type SessionWorkOrdersArgs = {
  nextToken?: InputMaybe<Scalars['String']['input']>;
};

export type SessionInput = {
  mentionedUsers?: InputMaybe<Array<PendingUserInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<SessionStateEnum>;
};

export const SessionRoleEnum = {
  Logistics: 'LOGISTICS',
  Manager: 'MANAGER',
  Medical: 'MEDICAL',
  Scout: 'SCOUT',
  Security: 'SECURITY',
  Transport: 'TRANSPORT'
} as const;

export type SessionRoleEnum = typeof SessionRoleEnum[keyof typeof SessionRoleEnum];
export type SessionSettings = {
  __typename: 'SessionSettings';
  activity?: Maybe<ActivityEnum>;
  allowUnverifiedUsers?: Maybe<Scalars['Boolean']['output']>;
  controlledSessionRole?: Maybe<Scalars['Boolean']['output']>;
  controlledShipRole?: Maybe<Scalars['Boolean']['output']>;
  gravityWell?: Maybe<Scalars['String']['output']>;
  location?: Maybe<LocationEnum>;
  lockToDiscordGuild?: Maybe<DiscordGuild>;
  lockedFields?: Maybe<Array<Scalars['String']['output']>>;
  specifyUsers?: Maybe<Scalars['Boolean']['output']>;
  systemFilter?: Maybe<SystemEnum>;
  usersCanAddUsers?: Maybe<Scalars['Boolean']['output']>;
  usersCanInviteUsers?: Maybe<Scalars['Boolean']['output']>;
  workOrderDefaults?: Maybe<WorkOrderDefaults>;
};

export type SessionSettingsInput = {
  activity?: InputMaybe<ActivityEnum>;
  allowUnverifiedUsers?: InputMaybe<Scalars['Boolean']['input']>;
  controlledSessionRole?: InputMaybe<Scalars['Boolean']['input']>;
  controlledShipRole?: InputMaybe<Scalars['Boolean']['input']>;
  gravityWell?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<LocationEnum>;
  lockToDiscordGuild?: InputMaybe<DiscordGuildInput>;
  lockedFields?: InputMaybe<Array<Scalars['String']['input']>>;
  specifyUsers?: InputMaybe<Scalars['Boolean']['input']>;
  systemFilter?: InputMaybe<SystemEnum>;
  usersCanAddUsers?: InputMaybe<Scalars['Boolean']['input']>;
  usersCanInviteUsers?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SessionShare = {
  __typename: 'SessionShare';
  activity?: Maybe<ActivityEnum>;
  allowUnverifiedUsers?: Maybe<Scalars['Boolean']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  finishedAt?: Maybe<Scalars['Timestamp']['output']>;
  lockToDiscordGuild?: Maybe<DiscordGuild>;
  name?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  onTheList: Scalars['Boolean']['output'];
  sessionId: Scalars['ID']['output'];
  specifyUsers?: Maybe<Scalars['Boolean']['output']>;
  state: SessionStateEnum;
  updatedAt: Scalars['Timestamp']['output'];
  version?: Maybe<Scalars['String']['output']>;
};

export const SessionStateEnum = {
  Active: 'ACTIVE',
  Closed: 'CLOSED'
} as const;

export type SessionStateEnum = typeof SessionStateEnum[keyof typeof SessionStateEnum];
export type SessionSummary = {
  __typename: 'SessionSummary';
  aUEC?: Maybe<Scalars['Int']['output']>;
  activeMembers?: Maybe<Scalars['Int']['output']>;
  allPaid?: Maybe<Scalars['Boolean']['output']>;
  collectedSCU?: Maybe<Scalars['Float']['output']>;
  lastJobDone?: Maybe<Scalars['Timestamp']['output']>;
  refineries: Array<RefineryEnum>;
  scoutingFindsByType?: Maybe<SessionSummaryTotals>;
  totalMembers?: Maybe<Scalars['Int']['output']>;
  workOrderSummaries: Array<SessionSummaryWorkOrder>;
  workOrdersByType?: Maybe<SessionSummaryTotals>;
  yieldSCU?: Maybe<Scalars['Float']['output']>;
};

export type SessionSummaryTotals = {
  __typename: 'SessionSummaryTotals';
  other?: Maybe<Scalars['Int']['output']>;
  salvage?: Maybe<Scalars['Int']['output']>;
  ship?: Maybe<Scalars['Int']['output']>;
  vehicle?: Maybe<Scalars['Int']['output']>;
};

export type SessionSummaryWorkOrder = {
  __typename: 'SessionSummaryWorkOrder';
  isFailed?: Maybe<Scalars['Boolean']['output']>;
  isSold?: Maybe<Scalars['Boolean']['output']>;
  orderType: ActivityEnum;
  paidShares?: Maybe<Scalars['Int']['output']>;
  unpaidShares?: Maybe<Scalars['Int']['output']>;
};

export type SessionUpdate = {
  __typename: 'SessionUpdate';
  data?: Maybe<SessionUpdateUnion>;
  eventDate: Scalars['Timestamp']['output'];
  eventName?: Maybe<EventNameEnum>;
  sessionId: Scalars['ID']['output'];
};

export type SessionUpdateUnion = CrewShare | OtherOrder | SalvageFind | SalvageOrder | Session | SessionUser | ShipClusterFind | ShipMiningOrder | VehicleClusterFind | VehicleMiningOrder;

/**
 * SessionUser is the type we use to link users who are not the owner to the
 * session
 */
export type SessionUser = {
  __typename: 'SessionUser';
  captainId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  isPilot: Scalars['Boolean']['output'];
  loadout?: Maybe<MiningLoadout>;
  owner?: Maybe<User>;
  ownerId: Scalars['ID']['output'];
  sessionId: Scalars['ID']['output'];
  sessionRole?: Maybe<Scalars['String']['output']>;
  shipName?: Maybe<Scalars['String']['output']>;
  shipRole?: Maybe<Scalars['String']['output']>;
  state: SessionUserStateEnum;
  updatedAt: Scalars['Timestamp']['output'];
  vehicleCode?: Maybe<Scalars['String']['output']>;
};

export type SessionUserInput = {
  captainId?: InputMaybe<Scalars['ID']['input']>;
  isPilot?: InputMaybe<Scalars['Boolean']['input']>;
  loadoutId?: InputMaybe<Scalars['String']['input']>;
  sessionRole?: InputMaybe<Scalars['String']['input']>;
  shipName?: InputMaybe<Scalars['String']['input']>;
  shipRole?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<SessionUserStateEnum>;
  vehicleCode?: InputMaybe<Scalars['String']['input']>;
};

export const SessionUserStateEnum = {
  Afk: 'AFK',
  OnSite: 'ON_SITE',
  RefineryRun: 'REFINERY_RUN',
  Scouting: 'SCOUTING',
  Travelling: 'TRAVELLING',
  Unknown: 'UNKNOWN'
} as const;

export type SessionUserStateEnum = typeof SessionUserStateEnum[keyof typeof SessionUserStateEnum];
export type SessionUserUpdate = {
  captainId?: InputMaybe<Scalars['ID']['input']>;
  sessionRole?: InputMaybe<Scalars['String']['input']>;
  shipRole?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<SessionUserStateEnum>;
};

export const ShareTypeEnum = {
  Amount: 'AMOUNT',
  Percent: 'PERCENT',
  Share: 'SHARE'
} as const;

export type ShareTypeEnum = typeof ShareTypeEnum[keyof typeof ShareTypeEnum];
export type ShipClusterFind = ScoutingFindInterface & {
  __typename: 'ShipClusterFind';
  attendance?: Maybe<Array<SessionUser>>;
  attendanceIds: Array<Scalars['ID']['output']>;
  clusterCount?: Maybe<Scalars['Int']['output']>;
  clusterType: ScoutingFindTypeEnum;
  createdAt: Scalars['Timestamp']['output'];
  gravityWell?: Maybe<Scalars['String']['output']>;
  includeInSurvey?: Maybe<Scalars['Boolean']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<User>;
  ownerId: Scalars['ID']['output'];
  rawScore?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
  scoutingFindId: Scalars['ID']['output'];
  sessionId: Scalars['ID']['output'];
  shipRocks: Array<ShipRock>;
  state: ScoutingFindStateEnum;
  surveyBonus?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
  version: Scalars['String']['output'];
};

export const ShipManufacturerEnum = {
  Aegs: 'AEGS',
  Anvl: 'ANVL',
  Argo: 'ARGO',
  Cnou: 'CNOU',
  Crus: 'CRUS',
  Drak: 'DRAK',
  Grin: 'GRIN',
  Mira: 'MIRA',
  Misc: 'MISC',
  Rsin: 'RSIN',
  Tumbril: 'TUMBRIL'
} as const;

export type ShipManufacturerEnum = typeof ShipManufacturerEnum[keyof typeof ShipManufacturerEnum];
export type ShipMiningOrder = WorkOrderInterface & {
  __typename: 'ShipMiningOrder';
  createdAt: Scalars['Timestamp']['output'];
  crewShares?: Maybe<Array<CrewShare>>;
  expenses?: Maybe<Array<WorkOrderExpense>>;
  failReason?: Maybe<Scalars['String']['output']>;
  includeTransferFee?: Maybe<Scalars['Boolean']['output']>;
  isRefined?: Maybe<Scalars['Boolean']['output']>;
  isSold?: Maybe<Scalars['Boolean']['output']>;
  method?: Maybe<RefineryMethodEnum>;
  note?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['ID']['output'];
  orderType: ActivityEnum;
  owner?: Maybe<User>;
  ownerId: Scalars['ID']['output'];
  processDurationS?: Maybe<Scalars['Int']['output']>;
  processEndTime?: Maybe<Scalars['Timestamp']['output']>;
  processStartTime?: Maybe<Scalars['Timestamp']['output']>;
  refinery?: Maybe<RefineryEnum>;
  sellStore?: Maybe<Scalars['String']['output']>;
  seller?: Maybe<User>;
  sellerUserId?: Maybe<Scalars['ID']['output']>;
  /**
   * This is the user that the work order is delegated to. It is optional and if not set,
   * the owner is assumed to be the delegate
   */
  sellerscName?: Maybe<Scalars['String']['output']>;
  session?: Maybe<Session>;
  sessionId: Scalars['ID']['output'];
  shareAmount?: Maybe<Scalars['Int']['output']>;
  shareRefinedValue?: Maybe<Scalars['Boolean']['output']>;
  shipOres: Array<RefineryRow>;
  state: WorkOrderStateEnum;
  updatedAt: Scalars['Timestamp']['output'];
  version: Scalars['String']['output'];
};

export type ShipMiningOrderCapture = {
  __typename: 'ShipMiningOrderCapture';
  expenses?: Maybe<Array<WorkOrderExpense>>;
  method?: Maybe<RefineryMethodEnum>;
  processDurationS?: Maybe<Scalars['Int']['output']>;
  refinery?: Maybe<RefineryEnum>;
  shipOres: Array<RefineryRowCapture>;
};

export const ShipOreEnum = {
  Agricium: 'AGRICIUM',
  Aluminum: 'ALUMINUM',
  Beryl: 'BERYL',
  Bexalite: 'BEXALITE',
  Borase: 'BORASE',
  Copper: 'COPPER',
  Corundum: 'CORUNDUM',
  Diamond: 'DIAMOND',
  Gold: 'GOLD',
  Hephaestanite: 'HEPHAESTANITE',
  Ice: 'ICE',
  Inertmaterial: 'INERTMATERIAL',
  Iron: 'IRON',
  Laranite: 'LARANITE',
  Quantanium: 'QUANTANIUM',
  Quartz: 'QUARTZ',
  Riccite: 'RICCITE',
  Silicon: 'SILICON',
  Stileron: 'STILERON',
  Taranite: 'TARANITE',
  Tin: 'TIN',
  Titanium: 'TITANIUM',
  Tungsten: 'TUNGSTEN'
} as const;

export type ShipOreEnum = typeof ShipOreEnum[keyof typeof ShipOreEnum];
export type ShipRock = {
  __typename: 'ShipRock';
  inst?: Maybe<Scalars['Float']['output']>;
  mass: Scalars['Float']['output'];
  ores: Array<ShipRockOre>;
  res?: Maybe<Scalars['Float']['output']>;
  rockType?: Maybe<Scalars['RockType']['output']>;
  state: RockStateEnum;
};

export type ShipRockCapture = {
  __typename: 'ShipRockCapture';
  inst?: Maybe<Scalars['Float']['output']>;
  mass: Scalars['Float']['output'];
  ores: Array<ShipRockOre>;
  res?: Maybe<Scalars['Float']['output']>;
  rockType?: Maybe<Scalars['RockType']['output']>;
};

export type ShipRockInput = {
  inst?: InputMaybe<Scalars['Float']['input']>;
  mass: Scalars['Float']['input'];
  ores: Array<ShipRockOreInput>;
  res?: InputMaybe<Scalars['Float']['input']>;
  rockType?: InputMaybe<Scalars['RockType']['input']>;
  state: RockStateEnum;
};

export type ShipRockOre = {
  __typename: 'ShipRockOre';
  ore: ShipOreEnum;
  percent: Scalars['Float']['output'];
};

export type ShipRockOreInput = {
  ore: ShipOreEnum;
  percent: Scalars['Float']['input'];
};

export const ShipRoleEnum = {
  Copilot: 'COPILOT',
  Engineer: 'ENGINEER',
  LaserOperator: 'LASER_OPERATOR',
  Medic: 'MEDIC',
  Pilot: 'PILOT',
  Security: 'SECURITY',
  Stevedore: 'STEVEDORE',
  Turret: 'TURRET'
} as const;

export type ShipRoleEnum = typeof ShipRoleEnum[keyof typeof ShipRoleEnum];
export type Subscription = {
  __typename: 'Subscription';
  apiSubscription?: Maybe<ApiEvent>;
};

export type SurveyData = {
  __typename: 'SurveyData';
  data?: Maybe<Scalars['JSONObject']['output']>;
  dataName: Scalars['String']['output'];
  epoch: Scalars['String']['output'];
  lastUpdated?: Maybe<Scalars['Timestamp']['output']>;
};

export const SystemEnum = {
  Pyro: 'PYRO',
  Stanton: 'STANTON'
} as const;

export type SystemEnum = typeof SystemEnum[keyof typeof SystemEnum];
export type UexLookups = {
  __typename: 'UEXLookups';
  bodies?: Maybe<Scalars['JSONObject']['output']>;
  maxPrices?: Maybe<Scalars['JSONObject']['output']>;
  ships?: Maybe<Scalars['JSONObject']['output']>;
  tradeports?: Maybe<Scalars['JSONObject']['output']>;
};

export type User = UserInterface & {
  __typename: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  scName: Scalars['String']['output'];
  state: UserStateEnum;
  updatedAt: Scalars['Timestamp']['output'];
  userId: Scalars['ID']['output'];
};

export type UserInterface = {
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  scName: Scalars['String']['output'];
  state: UserStateEnum;
  updatedAt: Scalars['Timestamp']['output'];
  userId: Scalars['ID']['output'];
};

export const UserPlanEnum = {
  Admin: 'ADMIN',
  EternalGratitude: 'ETERNAL_GRATITUDE',
  Free: 'FREE',
  GrizzledProspector: 'GRIZZLED_PROSPECTOR'
} as const;

export type UserPlanEnum = typeof UserPlanEnum[keyof typeof UserPlanEnum];
export type UserProfile = UserInterface & {
  __typename: 'UserProfile';
  apiKey?: Maybe<Scalars['String']['output']>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Timestamp']['output'];
  deliveryShipCode?: Maybe<Scalars['String']['output']>;
  discordGuilds: Array<MyDiscordGuild>;
  friends: Array<Scalars['String']['output']>;
  isSurveyor?: Maybe<Scalars['Boolean']['output']>;
  isSurveyorBanned?: Maybe<Scalars['Boolean']['output']>;
  joinedSessions?: Maybe<PaginatedSessions>;
  lastActive: Scalars['Timestamp']['output'];
  loadouts: Array<MiningLoadout>;
  mySessions?: Maybe<PaginatedSessions>;
  plan: UserPlanEnum;
  scName: Scalars['String']['output'];
  sessionSettings: SessionSettings;
  sessionShipCode?: Maybe<Scalars['String']['output']>;
  state: UserStateEnum;
  surveyorGuild?: Maybe<DiscordGuild>;
  surveyorName?: Maybe<Scalars['String']['output']>;
  surveyorScore?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
  userId: Scalars['ID']['output'];
  userSettings?: Maybe<Scalars['JSONObject']['output']>;
  verifyCode?: Maybe<Scalars['String']['output']>;
  workOrders?: Maybe<PaginatedWorkOrders>;
};


export type UserProfileDiscordGuildsArgs = {
  refresh?: InputMaybe<Scalars['Boolean']['input']>;
};


export type UserProfileJoinedSessionsArgs = {
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type UserProfileMySessionsArgs = {
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type UserProfileWorkOrdersArgs = {
  nextToken?: InputMaybe<Scalars['String']['input']>;
  stateFilter?: InputMaybe<WorkOrderStateEnum>;
};

export type UserProfileInput = {
  deliveryShipCode?: InputMaybe<Scalars['String']['input']>;
  isSurveyor?: InputMaybe<Scalars['Boolean']['input']>;
  scName?: InputMaybe<Scalars['String']['input']>;
  sessionShipCode?: InputMaybe<Scalars['String']['input']>;
  surveyorGuildId?: InputMaybe<Scalars['ID']['input']>;
  surveyorName?: InputMaybe<Scalars['String']['input']>;
  userSettings?: InputMaybe<Scalars['JSONObject']['input']>;
};

export const UserStateEnum = {
  Unverified: 'UNVERIFIED',
  Verified: 'VERIFIED'
} as const;

export type UserStateEnum = typeof UserStateEnum[keyof typeof UserStateEnum];
export type Vehicle = {
  __typename: 'Vehicle';
  UEXID: Scalars['ID']['output'];
  cargo?: Maybe<Scalars['Int']['output']>;
  maker: Scalars['String']['output'];
  miningHold?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  role: VehicleRoleEnum;
};

export type VehicleClusterFind = ScoutingFindInterface & {
  __typename: 'VehicleClusterFind';
  attendance?: Maybe<Array<SessionUser>>;
  attendanceIds: Array<Scalars['ID']['output']>;
  clusterCount?: Maybe<Scalars['Int']['output']>;
  clusterType: ScoutingFindTypeEnum;
  createdAt: Scalars['Timestamp']['output'];
  gravityWell?: Maybe<Scalars['String']['output']>;
  includeInSurvey?: Maybe<Scalars['Boolean']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<User>;
  ownerId: Scalars['ID']['output'];
  rawScore?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
  scoutingFindId: Scalars['ID']['output'];
  sessionId: Scalars['ID']['output'];
  state: ScoutingFindStateEnum;
  surveyBonus?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
  vehicleRocks: Array<VehicleRock>;
  version: Scalars['String']['output'];
};

export type VehicleMiningOrder = WorkOrderInterface & {
  __typename: 'VehicleMiningOrder';
  createdAt: Scalars['Timestamp']['output'];
  crewShares?: Maybe<Array<CrewShare>>;
  expenses?: Maybe<Array<WorkOrderExpense>>;
  failReason?: Maybe<Scalars['String']['output']>;
  includeTransferFee?: Maybe<Scalars['Boolean']['output']>;
  isSold?: Maybe<Scalars['Boolean']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['ID']['output'];
  orderType: ActivityEnum;
  owner?: Maybe<User>;
  ownerId: Scalars['ID']['output'];
  sellStore?: Maybe<Scalars['String']['output']>;
  seller?: Maybe<User>;
  sellerUserId?: Maybe<Scalars['ID']['output']>;
  /**
   * This is the user that the work order is delegated to. It is optional and if not set,
   * the owner is assumed to be the delegate
   */
  sellerscName?: Maybe<Scalars['String']['output']>;
  session?: Maybe<Session>;
  sessionId: Scalars['ID']['output'];
  shareAmount?: Maybe<Scalars['Int']['output']>;
  state: WorkOrderStateEnum;
  updatedAt: Scalars['Timestamp']['output'];
  vehicleOres: Array<VehicleMiningRow>;
  version: Scalars['String']['output'];
};

export type VehicleMiningRow = {
  __typename: 'VehicleMiningRow';
  amt: Scalars['Int']['output'];
  ore: VehicleOreEnum;
};

export type VehicleMiningRowInput = {
  amt: Scalars['Int']['input'];
  ore: VehicleOreEnum;
};

export const VehicleOreEnum = {
  Aphorite: 'APHORITE',
  Dolivine: 'DOLIVINE',
  Hadanite: 'HADANITE',
  Janalite: 'JANALITE'
} as const;

export type VehicleOreEnum = typeof VehicleOreEnum[keyof typeof VehicleOreEnum];
export type VehicleRock = {
  __typename: 'VehicleRock';
  inst?: Maybe<Scalars['Float']['output']>;
  mass: Scalars['Float']['output'];
  ores: Array<VehicleRockOre>;
  res?: Maybe<Scalars['Float']['output']>;
};

export type VehicleRockInput = {
  inst?: InputMaybe<Scalars['Float']['input']>;
  mass: Scalars['Float']['input'];
  ores: Array<VehicleRockOreInput>;
  res?: InputMaybe<Scalars['Float']['input']>;
};

export type VehicleRockOre = {
  __typename: 'VehicleRockOre';
  ore: VehicleOreEnum;
  percent: Scalars['Float']['output'];
};

export type VehicleRockOreInput = {
  ore: VehicleOreEnum;
  percent: Scalars['Float']['input'];
};

export const VehicleRoleEnum = {
  Fighter: 'FIGHTER',
  Freight: 'FREIGHT',
  Mining: 'MINING',
  Other: 'OTHER'
} as const;

export type VehicleRoleEnum = typeof VehicleRoleEnum[keyof typeof VehicleRoleEnum];
export type WorkOrder = OtherOrder | SalvageOrder | ShipMiningOrder | VehicleMiningOrder;

export type WorkOrderDefaults = {
  __typename: 'WorkOrderDefaults';
  crewShares?: Maybe<Array<CrewShareTemplate>>;
  includeTransferFee?: Maybe<Scalars['Boolean']['output']>;
  isRefined?: Maybe<Scalars['Boolean']['output']>;
  lockedFields?: Maybe<Array<Scalars['String']['output']>>;
  method?: Maybe<RefineryMethodEnum>;
  refinery?: Maybe<RefineryEnum>;
  salvageOres?: Maybe<Array<SalvageOreEnum>>;
  sellStores?: Maybe<SellStores>;
  shareRefinedValue?: Maybe<Scalars['Boolean']['output']>;
  shipOres?: Maybe<Array<ShipOreEnum>>;
  vehicleOres?: Maybe<Array<VehicleOreEnum>>;
};

export type WorkOrderDefaultsInput = {
  includeTransferFee?: InputMaybe<Scalars['Boolean']['input']>;
  isRefined?: InputMaybe<Scalars['Boolean']['input']>;
  lockedFields?: InputMaybe<Array<Scalars['String']['input']>>;
  method?: InputMaybe<RefineryMethodEnum>;
  refinery?: InputMaybe<RefineryEnum>;
  sellStore?: InputMaybe<Scalars['String']['input']>;
  shareAmount?: InputMaybe<Scalars['Int']['input']>;
  shareRefinedValue?: InputMaybe<Scalars['Boolean']['input']>;
};

export type WorkOrderExpense = {
  __typename: 'WorkOrderExpense';
  amount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type WorkOrderExpenseInput = {
  amount: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type WorkOrderInput = {
  expenses?: InputMaybe<Array<WorkOrderExpenseInput>>;
  includeTransferFee?: InputMaybe<Scalars['Boolean']['input']>;
  isRefined?: InputMaybe<Scalars['Boolean']['input']>;
  isSold?: InputMaybe<Scalars['Boolean']['input']>;
  method?: InputMaybe<RefineryMethodEnum>;
  note?: InputMaybe<Scalars['String']['input']>;
  processDurationS?: InputMaybe<Scalars['Int']['input']>;
  processStartTime?: InputMaybe<Scalars['Timestamp']['input']>;
  profit?: InputMaybe<Scalars['Int']['input']>;
  refinery?: InputMaybe<RefineryEnum>;
  sellStore?: InputMaybe<Scalars['String']['input']>;
  sellerUserId?: InputMaybe<Scalars['ID']['input']>;
  /**
   * This is the user that the work order is delegated to. It is optional and if not set,
   * the owner is assumed to be the delegate
   */
  sellerscName?: InputMaybe<Scalars['String']['input']>;
  shareAmount?: InputMaybe<Scalars['Int']['input']>;
  shareRefinedValue?: InputMaybe<Scalars['Boolean']['input']>;
};

export type WorkOrderInterface = {
  createdAt: Scalars['Timestamp']['output'];
  crewShares?: Maybe<Array<CrewShare>>;
  expenses?: Maybe<Array<WorkOrderExpense>>;
  failReason?: Maybe<Scalars['String']['output']>;
  includeTransferFee?: Maybe<Scalars['Boolean']['output']>;
  isSold?: Maybe<Scalars['Boolean']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['ID']['output'];
  orderType: ActivityEnum;
  owner?: Maybe<User>;
  ownerId: Scalars['ID']['output'];
  sellStore?: Maybe<Scalars['String']['output']>;
  seller?: Maybe<User>;
  sellerUserId?: Maybe<Scalars['ID']['output']>;
  /**
   * This is the user that the work order is delegated to. It is optional and if not set,
   * the owner is assumed to be the delegate
   */
  sellerscName?: Maybe<Scalars['String']['output']>;
  session?: Maybe<Session>;
  sessionId: Scalars['ID']['output'];
  shareAmount?: Maybe<Scalars['Int']['output']>;
  state: WorkOrderStateEnum;
  updatedAt: Scalars['Timestamp']['output'];
  version: Scalars['String']['output'];
};

export const WorkOrderStateEnum = {
  Done: 'DONE',
  Failed: 'FAILED',
  RefiningComplete: 'REFINING_COMPLETE',
  RefiningStarted: 'REFINING_STARTED',
  Unknown: 'UNKNOWN'
} as const;

export type WorkOrderStateEnum = typeof WorkOrderStateEnum[keyof typeof WorkOrderStateEnum];
export const WreckStateEnum = {
  Depleted: 'DEPLETED',
  Ignore: 'IGNORE',
  Ready: 'READY'
} as const;

export type WreckStateEnum = typeof WreckStateEnum[keyof typeof WreckStateEnum];