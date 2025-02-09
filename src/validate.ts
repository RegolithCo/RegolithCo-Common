import {
  ActiveMiningLaserLoadout,
  LoadoutShipEnum,
  MiningLaserEnum,
  MiningLoadout,
  MiningLoadoutInput,
} from './gen/schema.types'
import { InvalidSCNames } from './names'
import { DataStore } from './types'
import log from 'loglevel'

export const validateSCName = (username: string): boolean => {
  if (InvalidSCNames.includes(username.toLowerCase())) {
    return false
  }

  try {
    const regex = /^[a-zA-Z0-9_-]{3,64}$/
    return regex.test(username)
  } catch (e) {
    log.error(e)
    return false
  }
}

/**
 * Just a little cleanup when we change the loadout
 */
export const sanitizeLoadout = async <T extends MiningLoadout | MiningLoadoutInput>(
  ds: DataStore,
  loadout: T
): Promise<T> => {
  const loadoutLookup = await ds.getLookup('loadout')
  const lasers = loadout.ship === LoadoutShipEnum.Mole ? 3 : 1
  const newLoadout: T = {
    ...loadout,
    // Check that there is a gadget to be on in the first place
    activeGadgetIndex:
      loadout.activeGadgetIndex !== null && loadout.inventoryGadgets.length > loadout.activeGadgetIndex
        ? loadout.activeGadgetIndex
        : null,
    // Laser checking is quite complicated
    activeLasers: Array.from({ length: lasers }).map((_, idx) => {
      const al = loadout.activeLasers[idx]
      if (!al || !al.laser) return null
      const numSlots = loadoutLookup.lasers[al.laser as MiningLaserEnum].slots
      const activeModulesOn = []
      return {
        ...al,
        modules: Array.from({ length: numSlots }).map((_, idx) => al.modules[idx] || null),
        modulesActive: Array.from({ length: numSlots }).map((_, idy) => {
          if (al.laserActive && al.modules[idy]) {
            const module = loadoutLookup.modules[al.modules[idy]]
            if (!module) return false
            // Passive modules are always on
            if (!module.active) return true
            // If the module is active set the flag so that only one can be on at a time per laser
            const value = Boolean(al.modulesActive[idy])
            if (value) activeModulesOn.push(module.code)
            return value
          }
          return false
        }),
      }
    }),
  }

  return newLoadout
}

export const validateMiningLoadout = async (
  ds: DataStore,
  loadout: MiningLoadout | MiningLoadoutInput
): Promise<boolean> => {
  const loadoutLookup = await ds.getLookup('loadout')
  try {
    const { activeLasers, inventoryGadgets, inventoryModules, inventoryLasers, name, ship } = loadout
    if (ship !== LoadoutShipEnum.Prospector && ship !== LoadoutShipEnum.Mole) {
      throw new Error('Invalid ship')
    }
    if (!name || name.trim().length < 3) {
      throw new Error('Invalid name')
    }
    inventoryModules.map((module) => {
      const moduleLookup = loadoutLookup.modules[module]
      if (!moduleLookup) {
        throw new Error(`Invalid module ${module}`)
      }
    })
    inventoryGadgets.map((gadget) => {
      const gadgetLookup = loadoutLookup.gadgets[gadget]
      if (!gadgetLookup) {
        throw new Error(`Invalid gadget ${gadget}`)
      }
    })
    activeLasers.map((activeLaser) => {
      if (!activeLaser) return
      const { laser, modules } = activeLaser as ActiveMiningLaserLoadout
      const laserLookup = loadoutLookup.lasers[laser]
      if (!laserLookup) {
        throw new Error(`Invalid laser ${laser}`)
      }
      if (modules.length > laserLookup.slots) {
        throw new Error(
          `Too many modules for ${laserLookup.name}. Expected ${laserLookup.slots} but got ${modules.length}`
        )
      }
    })
    inventoryLasers.map((laser) => {
      const expectedSize = ship === LoadoutShipEnum.Prospector ? 1 : 2
      const laserLookup = loadoutLookup.lasers[laser]
      if (laserLookup.size !== expectedSize) {
        throw new Error(
          `Invalid laser size for ${laserLookup.name}. Expected ${expectedSize} but got ${laserLookup.size}`
        )
      }
    })
    return true
  } catch {
    return false
  }
}
