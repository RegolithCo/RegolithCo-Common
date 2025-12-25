import { yieldCalc } from './equations'
import { ShipOreEnum, RefineryEnum, RefineryMethodEnum } from './gen/schema.types'

describe('yieldCalc', () => {
  const mockDataStore = {
    getLookup: jest.fn(async (name) => {
      if (name === 'oreProcessingLookup') return { [ShipOreEnum.Bexalite]: [1.1, 2, 3] }
      if (name === 'refineryBonuses') return { [RefineryEnum.Arcl1]: { [ShipOreEnum.Bexalite]: 1.2 } }
      if (name === 'methodsBonusLookup') return { [RefineryMethodEnum.DinyxSolventation]: [1.3, 2, 3] }
      return {}
    }),
  }

  it('calculates yield with all valid numbers', async () => {
    const result = await yieldCalc(
      mockDataStore as any,
      100,
      ShipOreEnum.Bexalite,
      RefineryEnum.Arcl1,
      RefineryMethodEnum.DinyxSolventation
    )
    expect(result).toBeCloseTo(100 * 1.1 * 1.2 * 1.3)
  })

  it('returns 0 if oreAmt is NaN', async () => {
    const result = await yieldCalc(
      mockDataStore as any,
      NaN,
      ShipOreEnum.Bexalite,
      RefineryEnum.Arcl1,
      RefineryMethodEnum.DinyxSolventation
    )
    expect(result).toBe(0)
  })

  it('defaults bonuses to 1 if not numeric', async () => {
    const badStore = {
      getLookup: jest.fn(async (name) => {
        if (name === 'oreProcessingLookup') return { [ShipOreEnum.Bexalite]: [null, 2, 3] }
        if (name === 'refineryBonuses') return { [RefineryEnum.Arcl1]: { [ShipOreEnum.Bexalite]: undefined } }
        if (name === 'methodsBonusLookup') return { [RefineryMethodEnum.DinyxSolventation]: [NaN, 2, 3] }
        return {}
      }),
    }
    const result = await yieldCalc(
      badStore as any,
      100,
      ShipOreEnum.Bexalite,
      RefineryEnum.Arcl1,
      RefineryMethodEnum.DinyxSolventation
    )
    expect(result).toBe(100)
  })

  it('returns 0 if result is NaN or not finite', async () => {
    const nanStore = {
      getLookup: jest.fn(async (name) => {
        if (name === 'oreProcessingLookup') return { [ShipOreEnum.Bexalite]: [Infinity, 2, 3] }
        if (name === 'refineryBonuses') return { [RefineryEnum.Arcl1]: { [ShipOreEnum.Bexalite]: 1 } }
        if (name === 'methodsBonusLookup') return { [RefineryMethodEnum.DinyxSolventation]: [1, 2, 3] }
        return {}
      }),
    }
    const result = await yieldCalc(
      nanStore as any,
      100,
      ShipOreEnum.Bexalite,
      RefineryEnum.Arcl1,
      RefineryMethodEnum.DinyxSolventation
    )
    expect(result).toBe(0)
  })
})
