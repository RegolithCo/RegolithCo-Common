import { ActiveMiningLaserLoadout, MiningGadgetEnum, MiningLaserEnum, MiningModuleEnum } from './gen/schema.types'
import {
  baseStats,
  calcLaserStats,
  calcLoadoutStats,
  getMinLoadoutPrice,
  multiplyReduceModules,
  sanitizeStats,
} from './loadoutCalc'
import { mockEmptyActiveLaser, mockEmptyMiningLoadout } from './__mocks__/'
import { mockDataStore } from './__mocks__/dataStoreMock'
import { MiningGadget, MiningLaser, MiningModule } from './types'
import { roundFloat } from './util'

let LASERS: Record<MiningLaserEnum, MiningLaser>
let MODULES: Record<MiningModuleEnum, MiningModule>
let GADGETS: Record<MiningGadgetEnum, MiningGadget>

describe('Mining Loadout Functions', () => {
  beforeAll(async () => {
    const loadout = await mockDataStore.getLookup('loadout')
    LASERS = loadout.lasers
    MODULES = loadout.modules
    GADGETS = loadout.gadgets
  })

  describe('multiplyReduceMod', () => {
    it('should return 1 when no modules are passed in', () => {
      const result = multiplyReduceModules([], 'maxPower')
      expect(result).toEqual(1)
    })
  })

  describe('calcLoadoutStats', () => {
    it('should return correct loadout stats for an empty loadout', async () => {
      const emptyLoadout = mockEmptyMiningLoadout()
      const loadoutStats = await calcLoadoutStats(mockDataStore, emptyLoadout)
      expect(loadoutStats).toEqual(baseStats)
    })
  })

  describe('calcLaserStats', () => {
    it('should return correct loadout stats for a base Arbor laser that is off, even with modules', async () => {
      const emptyActiveLaser = await mockEmptyActiveLaser(mockDataStore)

      const loadoutStats = await calcLaserStats(mockDataStore, {
        ...emptyActiveLaser,
        laser: MiningLaserEnum.ArborMh1,
        modules: [MiningModuleEnum.Fltrxl],
        modulesActive: [false],
        laserActive: false,
      })

      const minLaserPrice = getMinLoadoutPrice(LASERS[MiningLaserEnum.ArborMh1])
      const minModulePrice = getMinLoadoutPrice(MODULES[MiningModuleEnum.Fltrxl])

      const laserPrice = minLaserPrice || 0
      const modulePrice = minModulePrice || 0

      const sanitized = sanitizeStats({
        ...baseStats,
        minPowerPct: 0,
        price: laserPrice + modulePrice,
        priceNoStock: modulePrice,
      })
      expect(loadoutStats).toMatchObject(sanitized)
    })
    it('should return correct loadout stats for a base Arbor laser with no modules', async () => {
      const emptyActiveLaser = await mockEmptyActiveLaser(mockDataStore)
      const laserCode = MiningLaserEnum.ArborMh1
      const laser = LASERS[laserCode] as MiningLaser

      // HERE Is the test
      const loadoutStats = await calcLaserStats(mockDataStore, {
        ...emptyActiveLaser,
        laser: laserCode,
        laserActive: true,
      })

      const minLaserPrice = getMinLoadoutPrice(laser)

      const {
        maxPower,
        minPower,
        extrPower,
        maxRange,
        optimumRange,
        resistance,
        instability,
        inertMaterials,
        optimalChargeRate,
        optimalChargeWindow,
      } = LASERS[MiningLaserEnum.ArborMh1].stats
      expect(loadoutStats).toMatchObject(
        sanitizeStats({
          maxPower,
          minPower,
          extrPower,
          maxRange,
          optimumRange,
          minPowerPct: 0,
          price: minLaserPrice,
          priceNoStock: 0,
          resistance,
          instability,
          inertMaterials,
          optimalChargeRate,
          optimalChargeWindow,
        })
      )
    })
    it('should return correct loadout stats for a Helix II laser with Lifeline and Fltrxl modules', async () => {
      const laser = LASERS[MiningLaserEnum.HelixIi] as MiningLaser
      const module1 = MODULES[MiningModuleEnum.Lifeline] as MiningModule
      const module2 = MODULES[MiningModuleEnum.Fltrxl] as MiningModule

      const emptyActiveLaser = await mockEmptyActiveLaser(mockDataStore)
      const laserStats = await calcLaserStats(mockDataStore, {
        ...emptyActiveLaser,
        laser: MiningLaserEnum.HelixIi,
        modules: [MiningModuleEnum.Lifeline, MiningModuleEnum.Fltrxl],
        modulesActive: [true, true],
        laserActive: true,
      })

      const allLaserPrices = (Object.values(laser.prices) as number[]) || [0]
      const minLaserPrice = Math.min(...allLaserPrices)

      const allModule1Prices = (Object.values(module1.prices) as number[]) || [0]
      const minModule1Price = Math.min(...allModule1Prices)
      const allModule2Prices = (Object.values(module2.prices) as number[]) || [0]
      const minModule2Price = Math.min(...allModule2Prices)

      const loadoutStats = sanitizeStats(laserStats)
      const { maxRange, optimumRange } = laser.stats
      const laserPrice = minLaserPrice || 0
      const modulePrice = (minModule1Price || 0) + (minModule2Price || 0)
      const expectedStats = sanitizeStats({
        maxPower: laser.stats.maxPower * (module1.stats.powerMod || 1) * (module2.stats.powerMod || 1),
        minPower: laser.stats.minPower * (module1.stats.powerMod || 1) * (module2.stats.powerMod || 1),
        extrPower: laser.stats.extrPower * (module1.stats.extrPowerMod || 1) * (module2.stats.extrPowerMod || 1),
        maxRange,
        optimumRange,
        minPowerPct: 0,
        extrPowerMod: (module1.stats.extrPowerMod || 1) * (module2.stats.extrPowerMod || 1),
        price: laserPrice + modulePrice,
        priceNoStock: laserPrice + modulePrice,
        resistance: roundFloat(1 * 0.85 * 0.7, 2) || 0,
        instability: 1 - 0.2,
        inertMaterials: 0.46,
        optimalChargeRate: (module1.stats.optimalChargeRate || 1) * (module2.stats.optimalChargeRate || 1),
        optimalChargeWindow:
          (laser.stats.optimalChargeWindow || 1) *
          (module1.stats.optimalChargeWindow || 1) *
          (module2.stats.optimalChargeWindow || 1),
        overchargeRate: (module1.stats.overchargeRate || 1) * (module2.stats.overchargeRate || 1),
      })

      expect(loadoutStats).toMatchObject(expectedStats)
    })
  })
  it('should return correct laser stats when laser and modules are active', async () => {
    const laser = {
      laser: MiningLaserEnum.HelixIi,
      // modules: [MiningModuleEnum.Lifeline, MiningModuleEnum.Fltrxl],
      // modulesActive: [true, true],
      modules: [],
      modulesActive: [],
      laserActive: true,
      __typename: 'ActiveMiningLaserLoadout',
    }
    const laserStats = await calcLaserStats(mockDataStore, laser as ActiveMiningLaserLoadout)
    expect(laserStats).toEqual({
      ...baseStats,
      ...LASERS[laser.laser as MiningLaserEnum].stats,
      minPowerPct: 0,
      price: 108000,
      priceNoStock: 108000,
    })
  })

  it('should return default laser stats when laser is not active', async () => {
    const inactiveLaser: ActiveMiningLaserLoadout = {
      laser: MiningLaserEnum.ArborMh1,
      modules: [],
      modulesActive: [false],
      laserActive: false,
      __typename: 'ActiveMiningLaserLoadout',
    }
    const laserStats = await calcLaserStats(mockDataStore, inactiveLaser)

    const laser = LASERS[MiningLaserEnum.ArborMh1]
    const minLaserPrice = getMinLoadoutPrice(laser)

    expect(laserStats).toEqual({
      ...baseStats,
      price: minLaserPrice,
      priceNoStock: 0,
    })
  })

  describe('Edge Cases', () => {
    it('should handle a loadout with no active lasers', async () => {
      const loadout = mockEmptyMiningLoadout()
      loadout.activeLasers = []
      const loadoutStats = await calcLoadoutStats(mockDataStore, loadout)
      expect(loadoutStats).toEqual(baseStats)
    })

    it('should handle a loadout with null active lasers', async () => {
      const loadout = mockEmptyMiningLoadout()
      loadout.activeLasers = [null]
      const loadoutStats = await calcLoadoutStats(mockDataStore, loadout)
      expect(loadoutStats).toEqual(baseStats)
    })

    it('should handle a loadout with null active lasers', async () => {
      const loadout = mockEmptyMiningLoadout()
      loadout.activeLasers = [null]
      const loadoutStats = await calcLoadoutStats(mockDataStore, loadout)
      expect(loadoutStats).toEqual(baseStats)
    })

    it('should handle a loadout with an active gadget but no lasers', async () => {
      const loadout = mockEmptyMiningLoadout()
      loadout.activeLasers = []
      loadout.inventoryGadgets = [MiningGadgetEnum.Boremax]
      loadout.activeGadgetIndex = 0

      const loadoutStats = await calcLoadoutStats(mockDataStore, loadout)

      // Gadget stats should be applied to base stats where applicable (multipliers)
      // But since base stats are 0 for power/range etc, they remain 0.
      // Multipliers start at 1, so they should reflect the gadget's multipliers.

      const gadget = GADGETS[MiningGadgetEnum.Boremax]
      const expectedStats = sanitizeStats({
        ...baseStats,
        price: getMinLoadoutPrice(gadget),
        priceNoStock: getMinLoadoutPrice(gadget),
        // Gadget stats
        clusterMod: gadget.stats.clusterMod || 1,
        inertMaterials: gadget.stats.inertMaterials || 1,
        instability: gadget.stats.instability || 1,
        resistance: gadget.stats.resistance || 1,
        optimalChargeRate: gadget.stats.optimalChargeRate || 1,
        optimalChargeWindow: gadget.stats.optimalChargeWindow || 1,
        overchargeRate: gadget.stats.overchargeRate || 1,
        shatterDamage: gadget.stats.shatterDamage || 1,
      })

      expect(loadoutStats).toMatchObject(expectedStats)
    })

    it('should handle a loadout with an invalid gadget index', async () => {
      const loadout = mockEmptyMiningLoadout()
      loadout.inventoryGadgets = [MiningGadgetEnum.Boremax]
      loadout.activeGadgetIndex = 5 // Invalid index

      const loadoutStats = await calcLoadoutStats(mockDataStore, loadout)

      // Should be base stats + inventory price of the gadget
      const gadget = GADGETS[MiningGadgetEnum.Boremax]
      const expectedStats = sanitizeStats({
        ...baseStats,
        price: getMinLoadoutPrice(gadget),
        priceNoStock: getMinLoadoutPrice(gadget),
      })

      expect(loadoutStats).toEqual(expectedStats)
    })

    it('should handle calcLaserStats with a laser that does not exist in lookup', async () => {
      const activeLaser: ActiveMiningLaserLoadout = {
        // @ts-expect-error Testing invalid laser enum
        laser: 'NonExistentLaser',
        modules: [],
        modulesActive: [],
        laserActive: true,
        __typename: 'ActiveMiningLaserLoadout',
      }
      const stats = await calcLaserStats(mockDataStore, activeLaser)
      expect(stats).toEqual(baseStats)
    })

    it('should handle calcLaserStats with modules that do not exist in lookup', async () => {
      const activeLaser: ActiveMiningLaserLoadout = {
        laser: MiningLaserEnum.ArborMh1,
        // @ts-expect-error Testing invalid module enum
        modules: ['NonExistentModule'],
        modulesActive: [true],
        laserActive: true,
        __typename: 'ActiveMiningLaserLoadout',
      }

      // Should behave like the laser has no modules
      const laser = LASERS[MiningLaserEnum.ArborMh1]
      const minLaserPrice = getMinLoadoutPrice(laser)

      const stats = await calcLaserStats(mockDataStore, activeLaser)

      // We expect it to match the base laser stats
      expect(stats.maxPower).toBe(laser.stats.maxPower)
      expect(stats.price).toBe(minLaserPrice)
    })

    it('should handle a loadout with an invalid laser ID', async () => {
      const loadout = mockEmptyMiningLoadout()
      loadout.activeLasers = [
        {
          // @ts-expect-error Testing invalid laser enum
          laser: 'InvalidLaserID',
          laserActive: true,
          modules: [],
          modulesActive: [],
          __typename: 'ActiveMiningLaserLoadout',
        },
      ]

      const loadoutStats = await calcLoadoutStats(mockDataStore, loadout)
      expect(loadoutStats).toEqual(baseStats)
    })
  })
})
