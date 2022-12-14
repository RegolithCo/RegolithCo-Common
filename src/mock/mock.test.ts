import { fakeScoutingFinds } from './index'
import { clusterCalc } from '../equations'

describe('equations', () => {
  it('Make sure we get reasonable objects', () => {
    const finds = fakeScoutingFinds(100)
    expect(finds.length).toBe(100)
    const oreCalc = finds.map((v) => clusterCalc(v))
    expect(oreCalc.length).toBe(100)
  })
})
