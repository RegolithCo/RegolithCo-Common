import { mockDataStore as ds } from './__mocks__/dataStoreMock'
import {
  getRefiningCost,
  clusterCalc,
  yieldCalc,
  oreAmtCalc,
  getRefiningTime,
  crewSharePayouts,
  calculateShipOrder,
} from './equations'
import { ShipOreEnum, RefineryEnum, RefineryMethodEnum, CrewShare, ShareTypeEnum } from './gen/schema.types'
import {
  fakeShipClusterFind,
  fakeVehicleClusterFind,
  fakeSalvageFind,
  fakeCrewShare,
  fakeUser,
  fakeShipMiningOrder,
} from './__mocks__/index'

describe('equations', () => {
  it('SHOULD IMPLEMENT NEW TESTS FOR EQUATIONS', async () => {
    expect(true).toBeTruthy()
  })
  it('should calculate cluster summaries correctly', async () => {
    const shipFind = fakeShipClusterFind()
    await clusterCalc(ds, shipFind)
    const vehicleFind = fakeVehicleClusterFind()
    await clusterCalc(ds, vehicleFind)
    const salvageFind = fakeSalvageFind()
    await clusterCalc(ds, salvageFind)
  })
  it('should calculate yieldCalc', async () => {
    expect(
      await yieldCalc(ds, 100, ShipOreEnum.Gold, RefineryEnum.Arcl1, RefineryMethodEnum.DinyxSolventation)
    ).toBeCloseTo(85, 10)
    expect(
      await yieldCalc(ds, 100, ShipOreEnum.Quantanium, RefineryEnum.Crul1, RefineryMethodEnum.Cormack)
    ).toBeCloseTo(59.5, 10)
  })
  it('should calculate oreAmtCalc', async () => {
    expect(
      await oreAmtCalc(ds, 89.3, ShipOreEnum.Gold, RefineryEnum.Arcl1, RefineryMethodEnum.DinyxSolventation)
    ).toBeCloseTo(105, 0)
    expect(
      await oreAmtCalc(ds, 68.495, ShipOreEnum.Quantanium, RefineryEnum.Crul1, RefineryMethodEnum.Cormack)
    ).toBeCloseTo(115, 0)
  })
  it('should calculate mining costs correctly', async () => {
    const refineCost = await getRefiningCost(
      ds,
      5641,
      ShipOreEnum.Bexalite,
      RefineryEnum.Crul1,
      RefineryMethodEnum.FerronExchange
    )
    // From youtube 3.21
    expect(refineCost).toEqual(39656.23)
    // From youtube 3.21
    expect(
      [
        await getRefiningCost(ds, 2139, ShipOreEnum.Quantanium, RefineryEnum.Crul1, RefineryMethodEnum.FerronExchange),
        await getRefiningCost(ds, 1572, ShipOreEnum.Gold, RefineryEnum.Crul1, RefineryMethodEnum.FerronExchange),
      ].reduce((acc, ore) => acc + ore, 0)
    ).toEqual(41400.7356)
    // From youtube 3.21
    expect(
      [
        await getRefiningCost(ds, 1487, ShipOreEnum.Quantanium, RefineryEnum.Crul1, RefineryMethodEnum.FerronExchange),
        await getRefiningCost(ds, 194, ShipOreEnum.Gold, RefineryEnum.Crul1, RefineryMethodEnum.FerronExchange),
        await getRefiningCost(ds, 1857, ShipOreEnum.Taranite, RefineryEnum.Crul1, RefineryMethodEnum.FerronExchange),
      ].reduce((acc, ore) => acc + ore, 0)
    ).toEqual(50125.35280000001)
    // expect(getRefiningCost(100, ShipOreEnum.Gold, RefineryEnum.Arcl1, RefineryMethodEnum.DinyxSolventation)).toEqual(15)
    // expect(getRefiningCost(100, ShipOreEnum.Quantanium, RefineryEnum.Crul1, RefineryMethodEnum.Cormack)).toEqual(400)
    // User submitted for 3.21
    const ores: number[] = await Promise.all([
      getRefiningCost(ds, 956, ShipOreEnum.Titanium, RefineryEnum.Micl5, RefineryMethodEnum.DinyxSolventation),
      getRefiningCost(ds, 1361, ShipOreEnum.Laranite, RefineryEnum.Micl5, RefineryMethodEnum.DinyxSolventation),
      getRefiningCost(ds, 2081, ShipOreEnum.Quartz, RefineryEnum.Micl5, RefineryMethodEnum.DinyxSolventation),
      getRefiningCost(ds, 2158, ShipOreEnum.Taranite, RefineryEnum.Micl5, RefineryMethodEnum.DinyxSolventation),
      getRefiningCost(ds, 1520, ShipOreEnum.Copper, RefineryEnum.Micl5, RefineryMethodEnum.DinyxSolventation),
    ])
    expect(ores.reduce((acc, ore) => acc + ore, 0)).toEqual(20181.144800000002)
  })
  it('should calculate mining times correctly', async () => {
    expect(
      await getRefiningTime(ds, 100, ShipOreEnum.Gold, RefineryEnum.Arcl1, RefineryMethodEnum.DinyxSolventation)
    ).toEqual(6720000)
    expect(
      await getRefiningTime(ds, 100, ShipOreEnum.Quantanium, RefineryEnum.Crul1, RefineryMethodEnum.Cormack)
    ).toEqual(98000)
  })
  it('should return the correct payouts', () => {
    const netProfit = 100000n
    const crewShares: CrewShare[] = [
      // 50% of 100
      fakeCrewShare({ payeeScName: 'sc0', shareType: ShareTypeEnum.Amount, share: 50000 }),
      fakeCrewShare({ payeeScName: 'sc1', shareType: ShareTypeEnum.Amount, share: 20000 }),
      fakeCrewShare({ payeeScName: 'sc2', shareType: ShareTypeEnum.Percent, share: 0.1 }),
      fakeCrewShare({ payeeScName: 'sc3', shareType: ShareTypeEnum.Percent, share: 0.15 }),
      fakeCrewShare({ payeeScName: 'sc4', shareType: ShareTypeEnum.Share, share: 1 }),
      fakeCrewShare({ payeeScName: 'sc5', shareType: ShareTypeEnum.Share, share: 0.5 }),
      fakeCrewShare({ payeeScName: 'sc6', shareType: ShareTypeEnum.Share, share: 2 }),
    ]
    const result = crewSharePayouts('sc0', netProfit, crewShares, [])
    // Expect the [0] element of the pay share (before transfer fees) to be the net profit
    expect(result.payouts.reduce((acc, shr) => acc + shr[1] + shr[2], 0n) + (result.remainder ?? 0n)).toEqual(netProfit)
    // Expect the [1] element of the pay share (after transfer fees) to be the net profit - transfer fees
    expect(result.payouts.reduce((acc, shr) => acc + shr[1], 0n) + (result.remainder ?? 0n)).toEqual(
      netProfit - result.transferFees
    )
    expect(result.payouts[0][1]).toEqual(50000n)
    expect(result.payouts[1][1]).toEqual(20000n) // direct payouts don't have transfer fees applied
    expect(Number(result.payouts[2][1])).toEqual(2976)
    expect(Number(result.payouts[3][1])).toEqual(4463)
    expect(Number(result.payouts[4][1])).toBeCloseTo(6375, 0)
    expect(Number(result.payouts[5][1])).toBeCloseTo(3187, 0)
    expect(Number(result.payouts[6][1])).toBeCloseTo(12750, 0)
    // Just a couple of sanity tests on shares
    expect(Number(result.payouts[4][0])).toBeCloseTo(6407, 0)
    expect(Number(result.payouts[6][0])).toBeCloseTo(12814, 0)
  })
  it('should return the correct payouts without transfer fees', () => {
    const netProfit = 100000n
    const crewShares: CrewShare[] = [
      // 50% of 100
      fakeCrewShare({ payeeScName: 'sc0', shareType: ShareTypeEnum.Amount, share: 50000 }),
      fakeCrewShare({ payeeScName: 'sc1', shareType: ShareTypeEnum.Amount, share: 20000 }),
      fakeCrewShare({ payeeScName: 'sc2', shareType: ShareTypeEnum.Percent, share: 0.1 }),
      fakeCrewShare({ payeeScName: 'sc3', shareType: ShareTypeEnum.Percent, share: 0.15 }),
      fakeCrewShare({ payeeScName: 'sc4', shareType: ShareTypeEnum.Share, share: 1 }),
      fakeCrewShare({ payeeScName: 'sc5', shareType: ShareTypeEnum.Share, share: 0.5 }),
      fakeCrewShare({ payeeScName: 'sc6', shareType: ShareTypeEnum.Share, share: 2 }),
    ]
    const result = crewSharePayouts('sc0', netProfit, crewShares, [], false)
    // Expect the [0] element of the pay share (before transfer fees) to be the net profit
    expect(result.payouts.reduce((acc, shr) => acc + shr[1] + shr[2], 0n) + (result.remainder ?? 0n)).toEqual(netProfit)
    // Expect the [1] element of the pay share (after transfer fees) to be the net profit - transfer fees
    expect(result.payouts.reduce((acc, shr) => acc + shr[1], 0n) + (result.remainder ?? 0n)).toEqual(
      netProfit - result.transferFees
    )
    expect(result.transferFees).toEqual(0n)
    expect(result.payouts[0][1]).toEqual(50000n)
    expect(result.payouts[1][1]).toEqual(20000n)
    expect(Number(result.payouts[2][1])).toEqual(3000)
    expect(Number(result.payouts[3][1])).toEqual(4500)
    expect(Number(result.payouts[4][1])).toBeCloseTo(6428, 0)
    expect(Number(result.payouts[5][1])).toBeCloseTo(3214, 0)
    expect(Number(result.payouts[6][1])).toBeCloseTo(12857, 0)
    // Just a couple of sanity tests on shares
    expect(Number(result.payouts[4][0])).toBeCloseTo(Number(result.payouts[5][0]) * 2, 0)
    expect(Number(result.payouts[6][0])).toBeCloseTo(12857, 0)
  })
  it('should return the correct payouts with transfer fees for calculateShipOrder', async () => {
    const crewNames = ['sc1', 'sc2', 'sc3', 'sc4', 'sc5']
    // const crew = crewNames.map((scName) => fakeUserProfile({ scName }))
    const crewShares: CrewShare[] = [
      // 50% of 100
      fakeCrewShare({ payeeScName: crewNames[0], shareType: ShareTypeEnum.Percent, share: 0.1 }),
      fakeCrewShare({ payeeScName: crewNames[1], shareType: ShareTypeEnum.Percent, share: 0.15 }),
      fakeCrewShare({ payeeScName: crewNames[2], shareType: ShareTypeEnum.Share, share: 1 }),
      fakeCrewShare({ payeeScName: crewNames[3], shareType: ShareTypeEnum.Share, share: 0.5 }),
      fakeCrewShare({ payeeScName: crewNames[4], shareType: ShareTypeEnum.Share, share: 2 }),
    ]
    // Note that the owner is not included in the crewShares
    const orderOwner = fakeUser({ scName: 'sc6' })
    const order = await fakeShipMiningOrder(
      ds,
      {
        includeTransferFee: true,
        shareRefinedValue: false,
        isRefined: true,
        ownerId: orderOwner.userId,
        owner: orderOwner,
      },
      crewShares
    )
    const result = await calculateShipOrder(ds, order)
    expect(result.payoutsTotal).toEqual(
      Object.values(result.payoutSummary).reduce((acc, payout) => acc + payout[0], 0n)
    )
    expect(Number(result.transferFees)).toBeCloseTo(
      Number(Object.values(result.payoutSummary).reduce((acc, payout) => acc - payout[1] + payout[0], 0n)),
      0
    )
    // Manually calculate the transfer fees for sanity
    // expect(Number(result.transferFees)).toBeCloseTo(258, 0)
  })
})
