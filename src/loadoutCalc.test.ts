// import {
//   ActiveMiningLaserLoadout,
//   LoadoutShipEnum,
//   MiningLaserEnum,
//   MiningLoadout,
//   MiningModuleEnum,
// } from './gen/schema.types'
// import { baseStats, calcLaserStats, sanitizeStats } from './loadoutCalc'
// import { lookups } from './lookups'
// import { fakeActiveLaser, fakeLoadout } from './mock'
// import { AllStats, MiningLaser, MiningModule } from './types'
// import { roundFloat } from './util'

// const LASERS = lookups.loadout.lasers
// const MODULES = lookups.loadout.modules
// const GADGETS = lookups.loadout.gadgets

// describe('Mining Loadout Functions', () => {
//   const mockEmptyActiveLaser: ActiveMiningLaserLoadout = fakeActiveLaser({
//     modules: [],
//     laserActive: false,
//     laser: MiningLaserEnum.ArborMh1,
//     modulesActive: [],
//   })
//   const mockEmptyMiningLoadout: MiningLoadout = fakeLoadout({
//     activeLasers: [mockEmptyActiveLaser],
//     activeGadgetIndex: null,
//     ship: LoadoutShipEnum.Mole,
//     inventoryGadgets: [],
//     inventoryLasers: [],
//     inventoryModules: [],
//   })
//   const mockEmptyReturn: AllStats = {
//     maxRange: 0,
//     optimumRange: 0,
//     maxPower: 0,
//     minPower: 0,
//     extrPower: 0,
//     // Just a simple add up
//     resistance: 0,
//     instability: 0,
//     shatterDamage: 0,
//     optimalChargeRate: 0,
//     optimalChargeWindow: 0,
//     inertMaterials: 0,
//     clusterMod: 0,
//     extrPowerMod: 0,
//     minPowerPct: 0,
//     overchargeRate: 0,
//     powerMod: 0,
//     // Just a simple add up
//     price: 0,
//     priceNoStock: 0,
//   }
//   // describe('multiplyReduceMod', () => {
//   //   it('should return 1 when no modules are passed in', () => {
//   //     const result = multiplyReduceMod([], 'maxPower')
//   //     expect(result).toEqual(1)
//   //   })
//   // })

//   // describe('calcLoadoutStats', () => {
//   //   it('should return correct loadout stats for an empty loadout', () => {
//   //     const loadoutStats = calcLoadoutStats(mockEmptyMiningLoadout)
//   //     expect(loadoutStats).toEqual(mockEmptyReturn)
//   //   })
//   // })

//   describe('calcLaserStats', () => {
//     it('should return correct loadout stats for a base Arbor laser that is off, even with modules', () => {
//       const loadoutStats = calcLaserStats({
//         ...mockEmptyActiveLaser,
//         laser: MiningLaserEnum.ArborMh1,
//         modules: [MiningModuleEnum.Fltrxl],
//         modulesActive: [false],
//         laserActive: false,
//       })
//       const laserPrice = LASERS[MiningLaserEnum.ArborMh1]?.price || 0
//       const modulePrice = MODULES[MiningModuleEnum.Fltrxl]?.price || 0
//       expect(loadoutStats).toMatchObject(
//         sanitizeStats({
//           ...baseStats,
//           minPowerPct: 0,
//           price: laserPrice + modulePrice,
//           priceNoStock: modulePrice,
//         })
//       )
//     })
//     it('should return correct loadout stats for a base Arbor laser with no modules', () => {
//       const loadoutStats = calcLaserStats({
//         ...mockEmptyActiveLaser,
//         laser: MiningLaserEnum.ArborMh1,
//         laserActive: true,
//       })
//       const {
//         maxPower,
//         minPower,
//         extrPower,
//         maxRange,
//         optimumRange,
//         minPowerPct,
//         resistance,
//         instability,
//         inertMaterials,
//         optimalChargeRate,
//         optimalChargeWindow,
//       } = LASERS[MiningLaserEnum.ArborMh1].stats
//       expect(loadoutStats).toMatchObject(
//         sanitizeStats({
//           maxPower,
//           minPower,
//           extrPower,
//           maxRange,
//           optimumRange,
//           minPowerPct: 0,
//           price: LASERS[MiningLaserEnum.ArborMh1].price,
//           priceNoStock: 0,
//           resistance,
//           instability,
//           inertMaterials,
//           optimalChargeRate,
//           optimalChargeWindow,
//         })
//       )
//     })
//     it('should return correct loadout stats for a base Arbor laser with no modules', () => {
//       const laser = LASERS[MiningLaserEnum.HelixIi] as MiningLaser
//       const module1 = MODULES[MiningModuleEnum.Lifeline] as MiningModule
//       const module2 = MODULES[MiningModuleEnum.Fltrxl] as MiningModule

//       const loadoutStats = sanitizeStats(
//         calcLaserStats({
//           ...mockEmptyActiveLaser,
//           laser: MiningLaserEnum.HelixIi,
//           modules: [MiningModuleEnum.Lifeline, MiningModuleEnum.Fltrxl],
//           modulesActive: [true, true],
//           laserActive: true,
//         })
//       )
//       const { maxRange, optimumRange } = laser.stats
//       const laserPrice = laser.price || 0
//       const modulePrice = (module1.price || 0) + (module2.price || 0)
//       const expectedStats = sanitizeStats({
//         maxPower: laser.stats.maxPower * (module1.stats.powerMod || 1) * (module2.stats.powerMod || 1),
//         minPower: laser.stats.minPower * (module1.stats.powerMod || 1) * (module2.stats.powerMod || 1),
//         extrPower: laser.stats.extrPower * (module1.stats.extrPowerMod || 1) * (module2.stats.extrPowerMod || 1),
//         maxRange,
//         optimumRange,
//         minPowerPct: 0,
//         extrPowerMod: (module1.stats.extrPowerMod || 1) * (module2.stats.extrPowerMod || 1),
//         price: laserPrice + modulePrice,
//         priceNoStock: laserPrice + modulePrice,
//         resistance: roundFloat(1 * 0.85 * 0.7, 2),
//         instability: 1 - 0.2,
//         inertMaterials: 0.53,
//         optimalChargeRate: (module1.stats.optimalChargeRate || 1) * (module2.stats.optimalChargeRate || 1),
//         optimalChargeWindow:
//           (laser.stats.optimalChargeWindow || 1) *
//           (module1.stats.optimalChargeWindow || 1) *
//           (module2.stats.optimalChargeWindow || 1),
//         overchargeRate: (module1.stats.overchargeRate || 1) * (module2.stats.overchargeRate || 1),
//       })

//       expect(loadoutStats).toMatchObject(expectedStats)
//     })
//   })
//   //   it('should return correct laser stats when laser and modules are active', () => {
//   //     const laserStats = calcLaserStats(mockMiningLoadout?.activeLasers[0] as ActiveMiningLaserLoadout)
//   //     expect(laserStats).toEqual({
//   //       ...LASERS[mockMiningLoadout?.activeLasers[0]?.laser as MiningLaserEnum].stats,
//   //     })
//   //   })

//   //   it('should return default laser stats when laser is not active', () => {
//   //     const inactiveLaser: ActiveMiningLaserLoadout = {
//   //       laser: mockMiningLoadout?.activeLasers[0]?.laser as MiningLaserEnum,
//   //       modules: [],
//   //       modulesActive: [false],
//   //       laserActive: false,
//   //       __typename: 'ActiveMiningLaserLoadout',
//   //     }
//   //     const laserStats = calcLaserStats(inactiveLaser)
//   //     expect(laserStats).toEqual({
//   //       ...LASERS[mockMiningLoadout?.activeLasers[0]?.laser as MiningLaserEnum].stats,
//   //       maxPower: 0,
//   //       minPower: 0,
//   //       extrPower: 0,
//   //       resistance: 0,
//   //       instability: 0,
//   //       shatterDamage: 0,
//   //       optimalChargeRate: 0,
//   //       optimalChargeWindow: 0,
//   //       inertMaterials: 0,
//   //       clusterMod: 0,
//   //       overchargeRate: 0,
//   //     })
//   //   })
//   // })
// })
