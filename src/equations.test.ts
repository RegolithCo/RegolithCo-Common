/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculateOtherOrder } from './equations'
import { DataStore } from './types'
import { ActivityEnum, WorkOrderStateEnum } from './gen/schema.types'

const mockDataStore: DataStore = {
  loading: false,
  error: null,
  ready: true,
  isLocal: false,
  getLookup: jest.fn(),
}

describe('equations', () => {
  describe('calculateOtherOrder', () => {
    it('should handle shareAmount as a number (JSON deserialization issue)', async () => {
      const order: any = {
        orderType: ActivityEnum.Other,
        state: WorkOrderStateEnum.Done,
        shareAmount: 1000, // number instead of bigint
        owner: { scName: 'Owner' },
        crewShares: [],
        expenses: [],
      }

      const result = await calculateOtherOrder(mockDataStore, order)
      expect(result.shareAmount).toBe(1000n)
    })

    it('should handle shareAmount as a string (JSON deserialization issue)', async () => {
      const order: any = {
        orderType: ActivityEnum.Other,
        state: WorkOrderStateEnum.Done,
        shareAmount: '1000', // string instead of bigint
        owner: { scName: 'Owner' },
        crewShares: [],
        expenses: [],
      }

      const result = await calculateOtherOrder(mockDataStore, order)
      expect(result.shareAmount).toBe(1000n)
    })

    it('should handle expenses amount as number', async () => {
      const order: any = {
        orderType: ActivityEnum.Other,
        state: WorkOrderStateEnum.Done,
        shareAmount: 1000n,
        owner: { scName: 'Owner' },
        crewShares: [],
        expenses: [{ amount: 100, name: 'Exp', ownerScName: 'Owner' }],
      }
      const result = await calculateOtherOrder(mockDataStore, order)
      // 1000 - 100 = 900
      expect(result.shareAmount).toBe(900n)
    })
  })
})
