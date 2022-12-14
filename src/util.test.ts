import { stripTypeNames } from './util'

describe('stripTypeNames', () => {
  it('stripTypeNames works', () => {
    //tslint:disable-next-line
    const obj = {
      somethingElse: 'test',
      __typename: 'test',
      a: {
        somethingElse: 'test',
        __typename: 'test',
        b: {
          somethingElse: 'test',
          __typename: 'test',
          c: {
            somethingElse: 'test',
            __typename: 'test',
          },
        },
      },
    }
    const result = stripTypeNames(obj)
    expect(result).toEqual({
      somethingElse: 'test',
      a: {
        somethingElse: 'test',
        b: {
          somethingElse: 'test',
          c: {
            somethingElse: 'test',
          },
        },
      },
    })
  })
})
