import { RefineryEnum, RefineryMethodEnum, SalvageOreEnum, ShipOreEnum, VehicleOreEnum } from './gen/schema.types'
import { DestructuredSettings } from './util'

export function SessionSystemDefaults(): DestructuredSettings {
  return {
    sessionSettings: {
      allowUnverifiedUsers: true,
      specifyUsers: false,
      lockedFields: [],
      activity: null,
      gravityWell: null,
      location: null,
    },
    workOrderDefaults: {
      includeTransferFee: true,
      shareRefinedValue: true,
      isRefined: true,
      lockedFields: [],
      method: RefineryMethodEnum.DinyxSolventation,
      refinery: RefineryEnum.Arcl1,
      shareAmount: null,
    },
    crewSharesDefaults: [],
    salvageOreDefaults: [SalvageOreEnum.Rmc, SalvageOreEnum.Cmat],
    shipOreDefaults: [ShipOreEnum.Quantanium],
    vehicleOreDefaults: [VehicleOreEnum.Hadanite],
  }
}
