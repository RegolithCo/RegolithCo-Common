import { mockDataStore as ds } from './__mocks__/dataStoreMock'
import {
  getRefiningCost,
  yieldCalc,
  oreAmtCalc,
  getRefiningTime,
  crewSharePayouts,
  shipRockVolumeCalc,
} from './equations'
import {
  ShipOreEnum,
  RefineryEnum,
  RefineryMethodEnum,
  CrewShare,
  ShareTypeEnum,
  ShipRock,
  RockStateEnum,
} from './gen/schema.types'
import { fakeCrewShare } from './__mocks__/index'

describe('equations edge cases', () => {
  describe('shipRockVolumeCalc', () => {
    it('should handle zero density gracefully', () => {
      const densityLookup = { [ShipOreEnum.Gold]: 0 } as Record<ShipOreEnum, number>
      const rock: ShipRock = {
        ores: [{ ore: ShipOreEnum.Gold, percent: 1, __typename: 'ShipRockOre' }],
        mass: 100,
        state: RockStateEnum.Ready,
        __typename: 'ShipRock',
      }
      // This might throw or return Infinity
      const result = shipRockVolumeCalc(densityLookup, rock)
      console.log('shipRockVolumeCalc result:', result.byOre[ShipOreEnum.Gold])
      expect(result.byOre[ShipOreEnum.Gold]).not.toBe(Infinity)
      expect(result.byOre[ShipOreEnum.Gold]).not.toBeNaN()
    })
  })

  describe('yieldCalc', () => {
    it('should handle missing lookups gracefully', async () => {
      // Assuming 'Unknown' is not in the mock data store
      const result = await yieldCalc(
        ds,
        100,
        'Unknown' as ShipOreEnum,
        RefineryEnum.Arcl1,
        RefineryMethodEnum.DinyxSolventation
      )
      expect(result).not.toBeNaN()
    })
  })

  describe('crewSharePayouts', () => {
    it('should handle zero total shares', () => {
      const netProfit = 100000n
      const crewShares: CrewShare[] = [fakeCrewShare({ payeeScName: 'sc0', shareType: ShareTypeEnum.Share, share: 0 })]
      const result = crewSharePayouts('sc0', netProfit, crewShares, [])
      expect(result.payouts[0][1]).toEqual(0n)
    })
  })
})
