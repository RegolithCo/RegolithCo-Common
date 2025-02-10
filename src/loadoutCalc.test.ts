import { ActiveMiningLaserLoadout, MiningGadgetEnum, MiningLaserEnum, MiningModuleEnum } from './gen/schema.types'
import {
  baseStats,
  calcLaserStats,
  calcLoadoutStats,
  getMinLoadoutPrice,
  multiplyReduceModules,
  sanitizeStats,
} from './loadoutCalc'
import { fakeLoadout, mockEmptyActiveLaser, mockEmptyMiningLoadout } from './__mocks__/'
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
        minPowerPct,
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
    it('should return correct loadout stats for a base Arbor laser with no modules', async () => {
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
      const allModule2Prices = (Object.values(module1.prices) as number[]) || [0]
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
        resistance: roundFloat(1 * 0.85 * 0.7, 2),
        instability: 1 - 0.2,
        inertMaterials: 0.53,
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
    const loadout = fakeLoadout({
      activeLasers: [
        {
          laser: MiningLaserEnum.HelixIi,
          // modules: [MiningModuleEnum.Lifeline, MiningModuleEnum.Fltrxl],
          // modulesActive: [true, true],
          modules: [],
          modulesActive: [],
          laserActive: true,
          __typename: 'ActiveMiningLaserLoadout',
        },
      ],
    })
    const laserStats = await calcLaserStats(mockDataStore, loadout?.activeLasers[0] as ActiveMiningLaserLoadout)
    expect(laserStats).toEqual({
      ...LASERS[loadout?.activeLasers[0]?.laser as MiningLaserEnum].stats,
    })
  })

  it('should return default laser stats when laser is not active', async () => {
    const loadout = mockEmptyMiningLoadout()
    const inactiveLaser: ActiveMiningLaserLoadout = {
      laser: loadout?.activeLasers[0]?.laser as MiningLaserEnum,
      modules: [],
      modulesActive: [false],
      laserActive: false,
      __typename: 'ActiveMiningLaserLoadout',
    }
    const laserStats = await calcLaserStats(mockDataStore, inactiveLaser)
    expect(laserStats).toEqual({
      ...LASERS[loadout?.activeLasers[0]?.laser as MiningLaserEnum].stats,
      maxPower: 0,
      minPower: 0,
      extrPower: 0,
      resistance: 0,
      instability: 0,
      shatterDamage: 0,
      optimalChargeRate: 0,
      optimalChargeWindow: 0,
      inertMaterials: 0,
      clusterMod: 0,
      overchargeRate: 0,
    })
  })
})
