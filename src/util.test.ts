/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  defaultSessionName,
  makeHumanIds,
  obfuscateId,
  obfuscateUserId,
  roundFloat,
  jsRound,
  createSafeFileName,
  removeKeyRecursive,
  stripTypeNames,
  createScoutingFindId,
  createFriendlyWorkOrderId,
  jsonToBase64,
  base64ToJson,
  destructureSettings,
  reverseDestructured,
  mergeDestructured,
  mergeSessionSettings,
  mergeDestructuredSessionSettings,
  mergeSessionSettingsInplace,
  crewSharesToInput,
  createUserSuggest,
  scoutingFindDestructured,
  makeAvatar,
  formatCardNumber,
  jsonSerializeBigInt,
} from './util'
import {
  ActivityEnum,
  ScoutingFindTypeEnum,
  SessionSettings,
  CrewShare,
  ShareTypeEnum,
  Session,
  UserProfile,
  SessionUser,
  ShipClusterFind,
  VehicleClusterFind,
  SalvageFind,
  ScoutingFindStateEnum,
  AsteroidTypeEnum,
  ShipOreEnum,
  VehicleOreEnum,
  SalvageOreEnum,
  SessionStateEnum,
  SessionUserStateEnum,
  RockStateEnum,
  WreckStateEnum,
} from './gen/schema.types'
import { CrewHierarchy } from './types'

// Mock dayjs to return a fixed date
jest.mock('dayjs', () => {
  return () => ({
    format: () => 'Sunday, Jan 1, 12 PM',
  })
})

describe('util.ts', () => {
  describe('defaultSessionName', () => {
    it('returns formatted date string', () => {
      expect(defaultSessionName()).toBe('Session: Sunday, Jan 1, 12 PM')
    })
  })

  describe('makeHumanIds', () => {
    it('generates ID with default values', () => {
      expect(makeHumanIds()).toBe('NEW-000000')
    })

    it('generates ID with provided values', () => {
      expect(makeHumanIds('MyOrg', '123456_uuid')).toBe('MYO-123456')
    })
  })

  describe('obfuscateId', () => {
    it('obfuscates a GUID', () => {
      expect(obfuscateId('some-guid')).toMatch(/^\d{3}$/)
    })

    it('is deterministic', () => {
      expect(obfuscateId('same-guid')).toBe(obfuscateId('same-guid'))
    })
  })

  describe('obfuscateUserId', () => {
    it('prefixes obfuscated ID with USER-', () => {
      expect(obfuscateUserId('some-guid')).toMatch(/^USER-\d{3}$/)
    })
  })

  describe('roundFloat', () => {
    it('rounds number to default precision (0)', () => {
      expect(roundFloat(123.456)).toBe(123)
    })

    it('rounds number to specified precision', () => {
      expect(roundFloat(123.456, 2)).toBe(123.46)
    })

    it('returns null for invalid input', () => {
      expect(roundFloat('not a number')).toBeNull()
      expect(roundFloat(NaN)).toBeNull()
    })

    it('returns null for invalid precision', () => {
      expect(roundFloat(123.456, -1)).toBeNull()
      expect(roundFloat(123.456, 1.5)).toBeNull()
    })

    it('returns null for non-finite numbers', () => {
      expect(roundFloat(Infinity)).toBeNull()
    })
  })

  describe('jsRound', () => {
    it('rounds correctly', () => {
      expect(jsRound(1.005, 2)).toBe(1.01)
    })

    it('returns non-number input as is', () => {
      expect(jsRound('string' as any, 2)).toBe('string')
    })
  })

  describe('createSafeFileName', () => {
    it('removes unwanted characters and appends GUID', () => {
      expect(createSafeFileName('File Name!@#', 'guid')).toBe('FileName-guid')
    })
  })

  describe('removeKeyRecursive', () => {
    it('removes key from object recursively', () => {
      const obj = {
        keep: 'value',
        remove: 'value',
        nested: {
          keep: 'value',
          remove: 'value',
        },
        array: [{ remove: 'value' }],
      }
      const expected = {
        keep: 'value',
        nested: {
          keep: 'value',
        },
        array: [{}],
      }
      expect(removeKeyRecursive(obj, 'remove')).toEqual(expected)
    })

    it('handles null and undefined', () => {
      expect(removeKeyRecursive(null, 'key')).toBeNull()
      expect(removeKeyRecursive(undefined, 'key')).toBeUndefined()
    })

    it('handles bigint', () => {
      const bigIntVal = BigInt(123)
      expect(removeKeyRecursive(bigIntVal, 'key')).toBe('123')
    })
  })

  describe('stripTypeNames', () => {
    it('removes __typename recursively', () => {
      const obj = {
        __typename: 'Type',
        data: 'value',
        nested: {
          __typename: 'NestedType',
          val: 1,
        },
      }
      expect(stripTypeNames(obj)).toEqual({
        data: 'value',
        nested: { val: 1 },
      })
    })

    it('returns non-object input as is', () => {
      expect(stripTypeNames('string')).toBe('string')
    })
  })

  describe('createScoutingFindId', () => {
    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5)
    })
    afterEach(() => {
      jest.spyOn(Math, 'random').mockRestore()
    })

    it('creates ID for Ship', () => {
      const id = createScoutingFindId(ScoutingFindTypeEnum.Ship)
      expect(id).toMatch(/^S\d{3}_[a-z0-9]+$/)
    })

    it('creates ID for Vehicle', () => {
      const id = createScoutingFindId(ScoutingFindTypeEnum.Vehicle)
      expect(id).toMatch(/^V\d{3}_[a-z0-9]+$/)
    })

    it('creates ID for Salvage', () => {
      const id = createScoutingFindId(ScoutingFindTypeEnum.Salvage)
      expect(id).toMatch(/^W\d{3}_[a-z0-9]+$/)
    })
  })

  describe('createFriendlyWorkOrderId', () => {
    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5)
    })
    afterEach(() => {
      jest.spyOn(Math, 'random').mockRestore()
    })

    it('creates ID for ShipMining', () => {
      const id = createFriendlyWorkOrderId(ActivityEnum.ShipMining)
      expect(id).toMatch(/^SM\d+_[a-z0-9]+$/)
    })

    it('creates ID for VehicleMining', () => {
      const id = createFriendlyWorkOrderId(ActivityEnum.VehicleMining)
      expect(id).toMatch(/^VM\d+_[a-z0-9]+$/)
    })

    it('creates ID for Salvage', () => {
      const id = createFriendlyWorkOrderId(ActivityEnum.Salvage)
      expect(id).toMatch(/^SO\d+_[a-z0-9]+$/)
    })

    it('creates ID for Other', () => {
      const id = createFriendlyWorkOrderId(ActivityEnum.Other)
      expect(id).toMatch(/^PL\d+_[a-z0-9]+$/)
    })
  })

  describe('jsonToBase64 and base64ToJson', () => {
    it('encodes and decodes JSON', () => {
      const obj = { key: 'value' }
      const b64 = jsonToBase64(obj)
      expect(base64ToJson(b64)).toEqual(obj)
    })
  })

  describe('Settings Helpers', () => {
    const mockSettings: SessionSettings = {
      __typename: 'SessionSettings',
      workOrderDefaults: {
        __typename: 'WorkOrderDefaults',
        crewShares: [
          { __typename: 'CrewShareTemplate', payeeScName: 'Test', share: 10, shareType: ShareTypeEnum.Percent },
        ],
        salvageOres: [],
        shipOres: [],
        vehicleOres: [],
      },
      lockToDiscordGuild: { __typename: 'DiscordGuild', id: 'guild1', name: 'Guild' },
    }

    it('destructureSettings', () => {
      const destructured = destructureSettings(mockSettings)
      expect(destructured.sessionSettings).toEqual({
        lockToDiscordGuild: { id: 'guild1', name: 'Guild' },
      })
      expect(destructured.crewSharesDefaults).toHaveLength(1)
      expect(destructured.crewSharesDefaults![0]).not.toHaveProperty('__typename')
    })

    it('reverseDestructured', () => {
      const destructured = destructureSettings(mockSettings)
      const reversed = reverseDestructured(destructured)
      expect(reversed).toEqual(mockSettings)
    })

    it('reverseDestructured handles null lockToDiscordGuild', () => {
      const destructured = destructureSettings({ ...mockSettings, lockToDiscordGuild: null })
      const reversed = reverseDestructured(destructured)
      expect(reversed.lockToDiscordGuild).toBeNull()
    })

    it('mergeDestructured', () => {
      const destructured = destructureSettings(mockSettings)
      const merged = mergeDestructured(mockSettings, destructured)
      expect(merged).toEqual({
        ...mockSettings,
        lockToDiscordGuild: {
          id: 'guild1',
          name: 'Guild',
        },
      })
    })

    it('mergeSessionSettings', () => {
      const newSettings = { ...mockSettings, gravityWell: 'NewWell' }
      const merged = mergeSessionSettings(mockSettings, newSettings)
      expect(merged.sessionSettings?.gravityWell).toBe('NewWell')
    })

    it('mergeDestructuredSessionSettings', () => {
      const oldD = destructureSettings(mockSettings)
      const newD = destructureSettings({ ...mockSettings, gravityWell: 'NewWell' })
      const merged = mergeDestructuredSessionSettings(oldD, newD)
      expect(merged.sessionSettings?.gravityWell).toBe('NewWell')
    })

    it('mergeSessionSettingsInplace', () => {
      const newSettings = { ...mockSettings, gravityWell: 'NewWell' }
      const merged = mergeSessionSettingsInplace(mockSettings, newSettings)
      expect(merged.gravityWell).toBe('NewWell')
    })

    it('mergeSessionSettingsInplace handles missing crewSharesDefaults', () => {
      const oldWithShares = { ...mockSettings }
      const newWithoutShares = {
        ...mockSettings,
        workOrderDefaults: {
          ...mockSettings.workOrderDefaults!,
          crewShares: [],
          __typename: 'WorkOrderDefaults' as const,
        },
      }

      const merged = mergeSessionSettingsInplace(oldWithShares, newWithoutShares)
      expect(merged.workOrderDefaults?.crewShares).toHaveLength(1) // Should keep old
    })
  })

  describe('crewSharesToInput', () => {
    it('converts CrewShare to CrewShareInput', () => {
      const shares: CrewShare[] = [
        {
          orderId: 'o1',
          sessionId: 's1',
          createdAt: 0,
          updatedAt: 0,
          payeeUserId: 'user1',
          payeeScName: 'User1',
          share: 10,
          shareType: ShareTypeEnum.Percent,
          state: false,
          __typename: 'CrewShare',
        },
        {
          orderId: 'o2',
          sessionId: 's1',
          createdAt: 0,
          updatedAt: 0,
          payeeScName: 'User2',
          share: 20,
          shareType: ShareTypeEnum.Amount,
          state: true,
          __typename: 'CrewShare',
        },
      ]
      const input = crewSharesToInput(shares)
      expect(input).toHaveLength(2)
      expect(input[0]).toHaveProperty('payeeUserId', 'user1')
      expect(input[1]).toHaveProperty('payeeScName', 'User2')
    })
  })

  describe('createUserSuggest', () => {
    const mockSession: Session = {
      sessionId: 's1',
      joinId: 'j1',
      createdAt: 0,
      updatedAt: 0,
      state: SessionStateEnum.Active,
      sessionSettings: {} as any,
      mentionedUsers: [{ scName: 'Pending1', sessionRole: 'Miner', shipRole: 'Gunner', __typename: 'PendingUser' }],
      activeMembers: {
        items: [
          {
            owner: { scName: 'Active1', userId: 'u1', state: 'ACTIVE' } as any,
            ownerId: 'u1',
            sessionRole: 'Captain',
            shipRole: 'Pilot',
            state: SessionUserStateEnum.OnSite,
          } as any,
        ],
      } as any,
    } as any

    const mockProfile: UserProfile = {
      friends: ['Friend1'],
    } as any

    const mockSessionUser: SessionUser = {
      ownerId: 'u1',
    } as any

    const mockCrewHierarchy: CrewHierarchy = {
      u1: {
        activeIds: ['u1'],
        innactiveSCNames: ['Pending1'],
      },
    }

    it('creates user suggestions', () => {
      const suggestions = createUserSuggest(mockSession, mockProfile, mockSessionUser, mockCrewHierarchy)

      expect(suggestions['Active1']).toBeDefined()
      expect(suggestions['Active1'].session).toBe(true)
      expect(suggestions['Active1'].crew).toBe(true)

      expect(suggestions['Pending1']).toBeDefined()
      expect(suggestions['Pending1'].named).toBe(true)
      expect(suggestions['Pending1'].crew).toBe(true)

      expect(suggestions['Friend1']).toBeDefined()
      expect(suggestions['Friend1'].friend).toBe(true)
    })

    it('returns empty object if no session', () => {
      expect(createUserSuggest(undefined, mockProfile, mockSessionUser, mockCrewHierarchy)).toEqual({})
    })
  })

  describe('scoutingFindDestructured', () => {
    it('destructures ShipClusterFind', () => {
      const find: ShipClusterFind = {
        state: ScoutingFindStateEnum.Working,
        clusterCount: 1,
        note: 'note',
        gravityWell: 'AaronHalo',
        includeInSurvey: true,
        shipRocks: [
          {
            mass: 100,
            state: RockStateEnum.Ready,
            inst: 1,
            res: 1,
            rockType: AsteroidTypeEnum.Qtype,
            ores: [{ ore: ShipOreEnum.Quantanium, percent: 100 }],
          },
        ],
      } as any

      const result = scoutingFindDestructured(find)
      expect(result.shipRocks).toHaveLength(1)
      expect(result.shipRocks![0].ores).toHaveLength(1)
    })

    it('destructures VehicleClusterFind', () => {
      const find: VehicleClusterFind = {
        state: ScoutingFindStateEnum.Working,
        vehicleRocks: [
          {
            mass: 100,
            inst: 1,
            res: 1,
            ores: [{ ore: VehicleOreEnum.Hadanite, percent: 100 }],
          },
        ],
      } as any
      const result = scoutingFindDestructured(find)
      expect(result.vehicleRocks).toHaveLength(1)
    })

    it('destructures SalvageFind', () => {
      const find: SalvageFind = {
        state: ScoutingFindStateEnum.Working,
        wrecks: [
          {
            isShip: true,
            state: WreckStateEnum.Ready,
            salvageOres: [{ ore: SalvageOreEnum.Rmc, scu: 10 }],
            sellableAUEC: 1000,
            shipCode: 'ship',
          },
        ],
      } as any
      const result = scoutingFindDestructured(find)
      expect(result.wrecks).toHaveLength(1)
    })
  })

  describe('makeAvatar', () => {
    it('returns url as is if google or dummy', () => {
      expect(makeAvatar('https://google.com')).toBe('https://google.com')
      expect(makeAvatar('/assets/dummyAvatar.png')).toBe('/assets/dummyAvatar.png')
    })

    it('appends webp format if other url', () => {
      expect(makeAvatar('http://example.com/image')).toBe('http://example.com/image.webp?size=256')
    })

    it('returns input if invalid', () => {
      expect(makeAvatar('')).toBe('')
      expect(makeAvatar(undefined)).toBeUndefined()
    })
  })

  describe('formatCardNumber', () => {
    it('formats small numbers', () => {
      expect(formatCardNumber(1000)).toEqual(['1,000', ''])
    })

    it('formats thousands', () => {
      expect(formatCardNumber(15000)).toEqual(['15.00', 'thousand'])
    })

    it('formats millions', () => {
      expect(formatCardNumber(1500000)).toEqual(['1.50', 'million'])
    })

    it('formats billions', () => {
      expect(formatCardNumber(1500000000)).toEqual(['1.50', 'billion'])
    })

    it('formats trillions', () => {
      expect(formatCardNumber(1500000000000)).toEqual(['1.50', 'trillion'])
    })

    it('strips trailing zeros', () => {
      expect(formatCardNumber(1000000)).toEqual(['1.00', 'million'])
    })
  })

  describe('jsonSerializeBigInt', () => {
    it('should serialize BigInt to string', () => {
      const data = { value: BigInt('12345678901234567890') }
      const result = jsonSerializeBigInt(data)
      expect(result).toBe('{"value":"12345678901234567890"}')
    })

    it('should serialize nested BigInt to string', () => {
      const data = { nested: { value: BigInt('98765432109876543210') } }
      const result = jsonSerializeBigInt(data)
      expect(result).toBe('{"nested":{"value":"98765432109876543210"}}')
    })

    it('should handle mixed types correctly', () => {
      const data = {
        id: 1,
        name: 'test',
        big: BigInt(100),
        arr: [BigInt(1), 2, '3'],
      }
      const result = jsonSerializeBigInt(data)
      expect(result).toBe('{"id":1,"name":"test","big":"100","arr":["1",2,"3"]}')
    })

    it('should handle null and undefined', () => {
      expect(jsonSerializeBigInt(null)).toBe('null')
      expect(jsonSerializeBigInt(undefined)).toBeUndefined()
    })

    it('should handle empty objects and arrays', () => {
      expect(jsonSerializeBigInt({})).toBe('{}')
      expect(jsonSerializeBigInt([])).toBe('[]')
    })
  })
})
