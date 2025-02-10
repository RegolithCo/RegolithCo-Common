import { clusterCalc } from '.'
import { fakeScoutingFinds } from './__mocks__'
import { mockDataStore } from './__mocks__/dataStoreMock'

describe('Mocks', () => {
  it('Make sure we get reasonable objects', () => {
    const finds = fakeScoutingFinds(100)
    expect(finds.length).toBe(100)
    const oreCalc = finds.map((v) => clusterCalc(mockDataStore, v))
    expect(oreCalc.length).toBe(100)
  })
})
