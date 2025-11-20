import { RefineryEnum, SystemEnum } from './gen/schema.types'
import { ObjectValues } from './types'

/**
 * This is an enumeration of all the SC Refineries
 */
export const ScVersionEnum = {
  SC4_4: '4.4',
  SC4_3_2: '4.3.2',
  SC4_3_1: '4.3.1',
  SC4_3: '4.3',
  SC4_2_1: '4.2.1',
  SC4_1_1: '4.1.1',
  SC4_1: '4.1',
  SC4_0_1: '4.0.1',
  SC4_0: '4.0',
  SC4_0_PREVIEW: '4.0-Preview',
  SC3_24_4: '3.24.4',
  SC3_24_3: '3.24.3',
  SC3_24_2: '3.24.2',
  SC3_24_1: '3.24.1',
  SC3_23_1: '3.23.1',
  SC3_22_1: '3.22.1',
  SC3_22: '3.22.0',
  SC3_21_1: '3.21.1',
  SC3_21: '3.21',
  SC3_20: '3.20',
  SC3_19: '3.19',
  SC3_18_2: '3.18.2',
} as const
export type ScVersionEnum = ObjectValues<typeof ScVersionEnum>

// This is the current deployed version
export const scVersion: ScVersionEnum = ScVersionEnum.SC4_4

/**
 * A list of all the SC Versions ever supported by Regolith and their start dates. We use this to determine the epoch of a version.
 */
export const scVersionDates: Record<ScVersionEnum, Date> = {
  [ScVersionEnum.SC4_4]: new Date('2025-11-19'),
  [ScVersionEnum.SC4_3_2]: new Date('2025-10-17'),
  [ScVersionEnum.SC4_3_1]: new Date('2025-09-13'),
  [ScVersionEnum.SC4_3]: new Date('2025-08-22'),
  [ScVersionEnum.SC4_2_1]: new Date('2025-07-18'),
  [ScVersionEnum.SC4_1_1]: new Date('2025-05-13'),
  [ScVersionEnum.SC4_1]: new Date('2025-03-28'),
  [ScVersionEnum.SC4_0_1]: new Date('2025-01-29'),
  [ScVersionEnum.SC4_0_PREVIEW]: new Date('2024-12-19'),
  // NOTE: THESE ARE PROBABLY WRONG
  [ScVersionEnum.SC4_0]: new Date('2024-12-19'),

  [ScVersionEnum.SC3_24_4]: new Date('2024-11-22'),
  [ScVersionEnum.SC3_24_3]: new Date('2024-11-22'),
  [ScVersionEnum.SC3_24_2]: new Date('2024-09-29'),
  [ScVersionEnum.SC3_24_1]: new Date('2024-08-29'),

  [ScVersionEnum.SC3_23_1]: new Date('2024-05-24'),

  [ScVersionEnum.SC3_22_1]: new Date('2024-12-19'),
  [ScVersionEnum.SC3_22]: new Date('2024-12-19'),

  [ScVersionEnum.SC3_21_1]: new Date('2023-10-21'),
  [ScVersionEnum.SC3_21]: new Date('2023-10-21'),

  [ScVersionEnum.SC3_20]: new Date('2023-09-06'),

  [ScVersionEnum.SC3_19]: new Date('2023-05-01'),

  [ScVersionEnum.SC3_18_2]: new Date('2023-03-01'),
}

/**
 * Epochs are like geologic epochs. They group versions of the game together
 * When an epoch changes the Survey data resets and people have to re-collect it.
 */
export const ScVersionEpochEnum = {
  SC_EPOCH_4_4: '4.4',
  SC_EPOCH_4_1: '4.1',
  SC_EPOCH_4_0: '4.0',
} as const
export type ScVersionEpochEnum = ObjectValues<typeof ScVersionEpochEnum>

// This has to be chronological with the newest version at the top
export const EpochMap: Record<ScVersionEpochEnum, ScVersionEnum[]> = {
  [ScVersionEpochEnum.SC_EPOCH_4_4]: [
    //
    ScVersionEnum.SC4_4,
  ],
  [ScVersionEpochEnum.SC_EPOCH_4_1]: [
    //
    ScVersionEnum.SC4_1,
    ScVersionEnum.SC4_1_1,
    ScVersionEnum.SC4_2_1,
    ScVersionEnum.SC4_3,
    ScVersionEnum.SC4_3_1,
    ScVersionEnum.SC4_3_2,
  ],
  [ScVersionEpochEnum.SC_EPOCH_4_0]: [
    //
    ScVersionEnum.SC4_0_PREVIEW,
    ScVersionEnum.SC4_0_1,
  ],
}

// Note: this is also the order of appearance of the items
export const SystemRefineries: Record<SystemEnum, RefineryEnum[]> = {
  [SystemEnum.Stanton]: [
    RefineryEnum.Arcl1,
    RefineryEnum.Arcl2,
    RefineryEnum.Arcl4,
    RefineryEnum.Crul1,
    RefineryEnum.Hurl1,
    RefineryEnum.Hurl2,
    RefineryEnum.Magng,
    RefineryEnum.Micl1,
    RefineryEnum.Micl2,
    RefineryEnum.Micl5,
    RefineryEnum.Pyrog,
    RefineryEnum.Terrg,
  ],
  [SystemEnum.Pyro]: [
    RefineryEnum.PyroCheckmate,
    RefineryEnum.PyroOrbituary,
    RefineryEnum.PyroRuin,
    RefineryEnum.PyroStantg,
  ],
  [SystemEnum.Nyx]: [
    // NYX
    RefineryEnum.NyxLevski,
    RefineryEnum.NyxStantg,
  ],
}

export const getEpochFromVersion = (version: ScVersionEnum): ScVersionEpochEnum => {
  for (const epoch in EpochMap) {
    if (EpochMap[epoch].includes(version)) {
      return epoch as ScVersionEpochEnum
    }
  }
  throw new Error(`Version ${version} not found in any epoch`)
}

export const getEpochStartDate = (epoch: ScVersionEpochEnum): Date => scVersionDates[EpochMap[epoch][0]]
export const getEpochVersions = (epoch: ScVersionEpochEnum): ScVersionEnum[] => EpochMap[epoch]
export const getEpochEndDate = (epoch: ScVersionEpochEnum): Date => {
  // find the start dates of every epoch and put them in sorted order
  const startDates = Object.entries(EpochMap).map(([, versions]) => scVersionDates[versions[0]])
  startDates.sort((a, b) => a.getTime() - b.getTime())

  // find the index of the current epoch
  const index = startDates.findIndex((date) => date.getTime() === getEpochStartDate(epoch).getTime())
  // if we are at the end of the list then we are the last epoch
  if (index === startDates.length - 1) return new Date()
  else return startDates[index + 1]
}
