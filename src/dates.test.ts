import { readableMilliseconds } from './dates'
describe('equations', () => {
  it('Our duration format is a little finicky', () => {
    //tslint:disable-next-line
    expect(readableMilliseconds(null)).toEqual('???')
    //tslint:disable-next-line
    expect(readableMilliseconds(undefined)).toEqual('???')

    expect(readableMilliseconds(-1)).toEqual('???')
    expect(readableMilliseconds(0)).toEqual('00s')
    expect(readableMilliseconds(1000)).toEqual('01s')
    expect(readableMilliseconds(10000)).toEqual('10s')
    expect(readableMilliseconds(100000)).toEqual('01m 40s')
    expect(readableMilliseconds(1000000)).toEqual('16m 40s')
    expect(readableMilliseconds(10000000)).toEqual('02h 46m 40s')
    expect(readableMilliseconds(100000000)).toEqual('01d 03h 46m 40s')
    expect(readableMilliseconds(1000000000)).toEqual('11d 13h 46m 40s')

    expect(readableMilliseconds(1000, false)).toEqual('01s')
    expect(readableMilliseconds(10000, false)).toEqual('10s')
    expect(readableMilliseconds(100000, false)).toEqual('01m')
    expect(readableMilliseconds(1000000, false)).toEqual('16m')
    expect(readableMilliseconds(10000000, false)).toEqual('02h 46m')
    expect(readableMilliseconds(100000000, false)).toEqual('01d 03h 46m')
    expect(readableMilliseconds(1000000000, false)).toEqual('11d 13h 46m')
  })
})
