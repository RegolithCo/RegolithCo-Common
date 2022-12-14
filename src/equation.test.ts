import { getRefiningCost } from './equations'
import { ShipOreEnum, RefineryEnum, RefineryMethodEnum } from './gen/schema.types'

describe('equations', () => {
  // it('should calculate cluster summaries correctl', () => {
  //   const shipFind = fakeShipClusterFind()
  //   const shipCalc = clusterCalc(shipFind)

  //   const vehicleFind = fakeVehicleClusterFind()
  //   const vehicleCalc = clusterCalc(vehicleFind)

  //   const salvageFind = fakeSalvageFind()
  //   const salvageCalc = clusterCalc(salvageFind)
  // })
  // it('should calculate yieldCalc', () => {
  //   expect(yieldCalc(100, ShipOreEnum.Gold, RefineryEnum.Arcl1, RefineryMethodEnum.DinyxSolventation)).toBeCloseTo(
  //     89.3,
  //     10
  //   )
  //   expect(yieldCalc(100, ShipOreEnum.Quantanium, RefineryEnum.Crul1, RefineryMethodEnum.Cormack)).toBeCloseTo(
  //     68.495,
  //     10
  //   )
  // })
  // it('should calculate oreAmtCalc', () => {
  //   expect(oreAmtCalc(89.3, ShipOreEnum.Gold, RefineryEnum.Arcl1, RefineryMethodEnum.DinyxSolventation)).toBeCloseTo(
  //     100,
  //     10
  //   )
  //   expect(oreAmtCalc(68.495, ShipOreEnum.Quantanium, RefineryEnum.Crul1, RefineryMethodEnum.Cormack)).toBeCloseTo(
  //     100,
  //     10
  //   )
  // })
  it('should calculate mining costs correctly', () => {
    // From youtube 3.21
    expect(getRefiningCost(5641, ShipOreEnum.Bexalite, RefineryEnum.Crul1, RefineryMethodEnum.FerronExchange)).toEqual(
      42101
    )
    // From youtube 3.21
    expect(
      [
        getRefiningCost(2139, ShipOreEnum.Quantanium, RefineryEnum.Crul1, RefineryMethodEnum.FerronExchange),
        getRefiningCost(1572, ShipOreEnum.Gold, RefineryEnum.Crul1, RefineryMethodEnum.FerronExchange),
      ].reduce((acc, ore) => acc + ore, 0)
    ).toEqual(44222)
    // From youtube 3.21
    expect(
      [
        getRefiningCost(1487, ShipOreEnum.Quantanium, RefineryEnum.Crul1, RefineryMethodEnum.FerronExchange),
        getRefiningCost(194, ShipOreEnum.Gold, RefineryEnum.Crul1, RefineryMethodEnum.FerronExchange),
        getRefiningCost(1857, ShipOreEnum.Taranite, RefineryEnum.Crul1, RefineryMethodEnum.FerronExchange),
      ].reduce((acc, ore) => acc + ore, 0)
    ).toEqual(37656)

    // expect(getRefiningCost(100, ShipOreEnum.Gold, RefineryEnum.Arcl1, RefineryMethodEnum.DinyxSolventation)).toEqual(15)
    // expect(getRefiningCost(100, ShipOreEnum.Quantanium, RefineryEnum.Crul1, RefineryMethodEnum.Cormack)).toEqual(400)
    // User submitted for 3.21
    const ores: number[] = [
      getRefiningCost(956, ShipOreEnum.Titanium, RefineryEnum.Micl5, RefineryMethodEnum.DinyxSolventation),
      getRefiningCost(1361, ShipOreEnum.Laranite, RefineryEnum.Micl5, RefineryMethodEnum.DinyxSolventation),
      getRefiningCost(2081, ShipOreEnum.Quartz, RefineryEnum.Micl5, RefineryMethodEnum.DinyxSolventation),
      getRefiningCost(2158, ShipOreEnum.Taranite, RefineryEnum.Micl5, RefineryMethodEnum.DinyxSolventation),
      getRefiningCost(1520, ShipOreEnum.Copper, RefineryEnum.Micl5, RefineryMethodEnum.DinyxSolventation),
    ]
    expect(ores.reduce((acc, ore) => acc + ore, 0)).toEqual(100)
  })
  // it('should calculate mining times correctly', () => {
  //   expect(getRefiningTime(100, ShipOreEnum.Gold, RefineryEnum.Arcl1, RefineryMethodEnum.DinyxSolventation)).toEqual(
  //     50 * 60 * 1000
  //   )
  //   expect(getRefiningTime(100, ShipOreEnum.Quantanium, RefineryEnum.Crul1, RefineryMethodEnum.Cormack)).toEqual(
  //     100 * 1000
  //   )
  // })
  // it('should return the correct payouts', () => {
  //   const netProfit = 100000
  //   const crewShares: CrewShare[] = [
  //     // 50% of 100
  //     fakeCrewShare({ scName: 'sc0', shareType: ShareTypeEnum.Amount, share: 50000 }),
  //     fakeCrewShare({ scName: 'sc1', shareType: ShareTypeEnum.Amount, share: 20000 }),
  //     fakeCrewShare({ scName: 'sc2', shareType: ShareTypeEnum.Percent, share: 0.1 }),
  //     fakeCrewShare({ scName: 'sc3', shareType: ShareTypeEnum.Percent, share: 0.15 }),
  //     fakeCrewShare({ scName: 'sc4', shareType: ShareTypeEnum.Share, share: 1 }),
  //     fakeCrewShare({ scName: 'sc5', shareType: ShareTypeEnum.Share, share: 0.5 }),
  //     fakeCrewShare({ scName: 'sc6', shareType: ShareTypeEnum.Share, share: 2 }),
  //   ]
  //   const result = crewSharePayouts('sc0', netProfit, crewShares)

  //   // Expect the [0] element of the pay share (before transfer fees) to be the net profit
  //   expect(result.payouts.reduce((acc, shr) => acc + shr[1] + shr[2], 0)).toEqual(netProfit)

  //   // Expect the [1] element of the pay share (after transfer fees) to be the net profit - transfer fees
  //   expect(result.payouts.reduce((acc, shr) => acc + shr[1], 0)).toEqual(netProfit - result.transferFees)

  //   expect(result.payouts[0][1]).toEqual(50000)
  //   expect(result.payouts[1][1]).toEqual(20000) // direct payouts don't have transfer fees applied
  //   expect(result.payouts[2][1]).toEqual(2755)
  //   expect(result.payouts[3][1]).toEqual(4132.5)
  //   expect(result.payouts[4][1]).toBeCloseTo(5903.571429, 4)
  //   expect(result.payouts[5][1]).toBeCloseTo(2951.785714, 4)
  //   expect(result.payouts[6][1]).toBeCloseTo(11807.14286, 4)
  //   // Just a couple of sanity tests on shares
  //   expect(result.payouts[4][0]).toBeCloseTo(result.payouts[5][0] * 2, 4)
  //   expect(result.payouts[6][0]).toBeCloseTo(result.payouts[5][0] * 4, 4)
  // })
  // it('should return the correct payouts without transfer fees', () => {
  //   const netProfit = 100000
  //   const crewShares: CrewShare[] = [
  //     // 50% of 100
  //     fakeCrewShare({ scName: 'sc0', shareType: ShareTypeEnum.Amount, share: 50000 }),
  //     fakeCrewShare({ scName: 'sc1', shareType: ShareTypeEnum.Amount, share: 20000 }),
  //     fakeCrewShare({ scName: 'sc2', shareType: ShareTypeEnum.Percent, share: 0.1 }),
  //     fakeCrewShare({ scName: 'sc3', shareType: ShareTypeEnum.Percent, share: 0.15 }),
  //     fakeCrewShare({ scName: 'sc4', shareType: ShareTypeEnum.Share, share: 1 }),
  //     fakeCrewShare({ scName: 'sc5', shareType: ShareTypeEnum.Share, share: 0.5 }),
  //     fakeCrewShare({ scName: 'sc6', shareType: ShareTypeEnum.Share, share: 2 }),
  //   ]
  //   const result = crewSharePayouts('sc0', netProfit, crewShares, false)

  //   // Expect the [0] element of the pay share (before transfer fees) to be the net profit
  //   expect(result.payouts.reduce((acc, shr) => acc + shr[1] + shr[2], 0)).toEqual(netProfit)

  //   // Expect the [1] element of the pay share (after transfer fees) to be the net profit - transfer fees
  //   expect(result.payouts.reduce((acc, shr) => acc + shr[1], 0)).toEqual(netProfit - result.transferFees)

  //   expect(result.transferFees).toEqual(0)
  //   expect(result.payouts[0][1]).toEqual(50000)
  //   expect(result.payouts[1][1]).toEqual(20000)
  //   expect(result.payouts[2][1]).toEqual(3000)
  //   expect(result.payouts[3][1]).toEqual(4500)
  //   expect(result.payouts[4][1]).toBeCloseTo(6428.571428571428, 4)
  //   expect(result.payouts[5][1]).toBeCloseTo(3214.285714285714, 4)
  //   expect(result.payouts[6][1]).toBeCloseTo(12857.142857142857, 4)
  //   // Just a couple of sanity tests on shares
  //   expect(result.payouts[4][0]).toBeCloseTo(result.payouts[5][0] * 2, 4)
  //   expect(result.payouts[6][0]).toBeCloseTo(result.payouts[5][0] * 4, 4)
  // })
  // it('should return the correct payouts with transfer fees for calculateShipOrder', () => {
  //   const netProfit = 100000
  //   const crewNames = ['sc1', 'sc2', 'sc3', 'sc4', 'sc5']
  //   // const crew = crewNames.map((scName) => fakeUserProfile({ scName }))

  //   const crewShares: CrewShare[] = [
  //     // 50% of 100
  //     fakeCrewShare({ scName: crewNames[0], shareType: ShareTypeEnum.Percent, share: 0.1 }),
  //     fakeCrewShare({ scName: crewNames[1], shareType: ShareTypeEnum.Percent, share: 0.15 }),
  //     fakeCrewShare({ scName: crewNames[2], shareType: ShareTypeEnum.Share, share: 1 }),
  //     fakeCrewShare({ scName: crewNames[3], shareType: ShareTypeEnum.Share, share: 0.5 }),
  //     fakeCrewShare({ scName: crewNames[4], shareType: ShareTypeEnum.Share, share: 2 }),
  //   ]
  //   // Note that the owner is not included in the crewShares
  //   const orderOwner = fakeUser({ scName: 'sc6' })
  //   const order = fakeShipMiningOrder(
  //     {
  //       includeTransferFee: true,
  //       shareRefinedValue: false,
  //       isRefined: true,
  //       ownerId: orderOwner.userId,
  //       owner: orderOwner,
  //     },
  //     crewShares
  //   )
  //   const result = calculateShipOrder(order)
  //   expect(result.payoutsTotal).toEqual(Object.values(result.payoutSummary).reduce((acc, payout) => acc + payout[0], 0))
  //   expect(result.transferFees).toBeCloseTo(
  //     Object.values(result.payoutSummary).reduce((acc, payout) => acc - payout[1] + payout[0], 0),
  //     4
  //   )
  //   // Manually calculate the transfer fees for sanity
  //   expect(result.transferFees).toBeCloseTo(
  //     Object.entries(result.payoutSummary).reduce(
  //       (acc, [scName, payout]) => (scName === orderOwner.scName ? acc : acc + payout[0]),
  //       0
  //     ) * TRANSFER_FEES,
  //     4 //4 decimal places
  //   )
  // })
})
