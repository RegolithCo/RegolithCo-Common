import { DataStore, Lookups } from '../types'
import * as lookupMocks from './lookupMocks.json'

const LOOKUP_MAP: Record<string, unknown> = {
  densitiesLookups: lookupMocks.data.lookups.CIG.densitiesLookups as Lookups['densitiesLookups'],
  methodsBonusLookup: lookupMocks.data.lookups.CIG.methodsBonusLookup as Lookups['methodsBonusLookup'],
  refineryBonusLookup: lookupMocks.data.lookups.CIG.refineryBonusLookup as Lookups['refineryBonusLookup'],
  oreProcessingLookup: lookupMocks.data.lookups.CIG.oreProcessingLookup as Lookups['oreProcessingLookup'],
  gravityWellLookups: lookupMocks.data.lookups.UEX.bodies as Lookups['gravityWellLookups'],
  priceStatsLookups: lookupMocks.data.lookups.UEX.maxPrices as Lookups['priceStatsLookups'],
  shipLookups: lookupMocks.data.lookups.UEX.ships as Lookups['shipLookups'],
  tradeportLookups: lookupMocks.data.lookups.UEX.tradeports as Lookups['tradeportLookups'],
  loadout: lookupMocks.data.lookups.loadout as unknown as Lookups['loadout'],
}

export const mockDataStore: DataStore = {
  loading: false,
  error: null,
  ready: true,
  isLocal: false,
  localPath: '/mock/path',
  getLookup: jest.fn().mockImplementation((key: keyof Lookups) => {
    return LOOKUP_MAP[key]
  }),
}
