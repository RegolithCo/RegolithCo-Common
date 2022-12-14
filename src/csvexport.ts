/* eslint-disable @typescript-eslint/no-explicit-any */
import { omit } from 'lodash'
import { Session } from './gen/schema.types'
import { JSONObject } from './types'
import { makeHumanIds, removeKeyRecursive } from './util'

/**
 *
 * @param data
 * @returns
 */
export function toCSV(data: string[][]): string {
  const csv = []
  for (const row of data) {
    const cells = []
    for (const cell of row) {
      let formattedCell = cell
      if (!formattedCell) {
        formattedCell = ''
      } else {
        if (formattedCell.includes('"')) {
          formattedCell = formattedCell.replace(/"/g, '""')
        }
        if (formattedCell.includes(',')) {
          formattedCell = `"${formattedCell}"`
        }
      }
      cells.push(formattedCell)
    }
    csv.push(cells.join(','))
  }
  return csv.join('\n')
}

/**
 *
 * @param session
 * @returns
 */
export function session2Json(session: Session): JSONObject {
  const newObj = {
    ...omit(session, ['ownerId', 'owner', 'activeMemberIds', 'activeMembers']),
    activeMembers: session.activeMembers.items.map((m) => m.owner.scName),
    owner: session.owner.scName,
    scouting: [
      ...session.scouting.items.map((s) => ({
        ...omit(s, ['ownerId', 'owner', 'sessionId', 'scoutingFindId', 'attendance', 'attendanceIds']),
        scoutingFindId: makeHumanIds(s.owner.scName, s.scoutingFindId),
        owner: s.owner.scName,
        attendance: s.attendance.map((a) => `${a.owner.scName}:${a.state}`),
      })),
    ],
    workOrders: [
      ...session.workOrders.items.map((wo) => ({
        ...omit(wo, ['ownerId', 'sessionId', 'owner', 'sessionId', 'workOrderId']),
        orderId: makeHumanIds(wo.owner.scName, wo.orderId),
        crewShares: wo.crewShares.map((cs) => omit(cs, ['sessionId', 'orderId', 'ownerId', 'owner', 'workOrderId'])),
      })),
    ],
  }
  const stripped = removeKeyRecursive(newObj, '__typename')

  return stripped
}

/**
 *
 * @param session
 * @returns
 */
export function session2csv(session: Session): string {
  const retval: string[][] = [
    ['NOTE: THIS FORMAT IS NOT GUARANTEED TO BE STABLE BECAUSE CSV EXPORTING IS A REAL PAIN IN THE ASCII'],
    ['PLEASE USE THE JSON DOWNLOAD OR THE API DIRECTLY IF YOU NEED TO IMPORT THIS DATA OR SCRIPT AGAINST IT.'],
  ]
  // No sense re-doing our sanitization. downside is that it comes back untyped
  const jsonObj = session2Json(session)
  // First the session info
  const { mentionedUsers, scouting, workOrders, activeMembers, ...rest } = jsonObj as any

  // Here are the session details
  const rowPushObjHeaders = (obj: any): string[] => {
    if (!obj || !Array.isArray(obj)) return []
    const keyNames = Object.keys(obj)
    // Sort the keys alpahbetically but prioritize anything with "id" in it
    keyNames.sort((a, b) => {
      if (a.includes('Id') && !b.includes('id')) {
        return -1
      }
      if (!a.includes('Id') && b.includes('Id')) {
        return 1
      }
      return a.localeCompare(b)
    })
    retval.push(keyNames)
    return keyNames
  }
  const rowPushObj = (keyNames: string[], obj: any) => {
    if (!keyNames || !obj) return
    const row = keyNames.map((k) => (typeof obj[k] === 'string' ? obj[k] : JSON.stringify(obj[k])))
    retval.push(row)
  }

  rowPushObjHeaders(rest)
  rowPushObj(Object.keys(rest), rest)
  retval.push([])
  retval.push([])

  const usernames = { mentionedUsers, activeMembers }
  Object.keys(usernames).forEach((k) => {
    retval.push([k])
    usernames[k].forEach((obj: any) => {
      retval.push([obj])
    })
    retval.push([])
    retval.push([])
  })

  const foundOres = []
  const workOrderOres = []
  const shares = []

  const nested = { scouting, workOrders }
  Object.keys(nested).forEach((k) => {
    retval.push([k])
    const keyNames = rowPushObjHeaders(nested[k][0])
    nested[k].forEach((obj: any) => {
      if (k === 'scouting') {
        if (obj.attendance) {
          obj.attendance = obj.attendance.join(',')
        }
        if (obj.shipRocks) {
          foundOres.push(
            ...obj.shipRocks.map((sr) => ({
              ...sr,
              ores: (sr.ores || []).map(({ ore, percent }) => `${ore}:${percent}`).join(','),
            }))
          )
          obj.scoutingFindId = obj.shipRocks.length
        }
      }
      if (k === 'workOrders') {
        const orderId = obj.orderId
        if (obj.crewShares) {
          shares.push(...obj.crewShares.map((cs) => ({ orderId, ...cs })))
          obj.crewShares = obj.crewShares.length
        }
        if (obj.shipOres) {
          workOrderOres.push(...obj.shipOres.map((cs) => ({ orderId, ...cs })))
          obj.shipOres = obj.shipOres.length
        }
        if (obj.vehicleOres) {
          workOrderOres.push(...obj.vehicleOres.map((cs) => ({ orderId, ...cs })))
          obj.vehicleOres = obj.vehicleOres.length
        }
        if (obj.salvageOres) {
          workOrderOres.push(...obj.salvageOres.map((cs) => ({ orderId, ...cs })))
          obj.salvageOres = obj.salvageOres.length
        }
      }
      rowPushObj(keyNames, obj)
    })
    retval.push([])
    retval.push([])
  })

  const doubleNests = { foundOres, workOrderOres, shares }
  Object.keys(doubleNests).forEach((k) => {
    retval.push([k])
    const valObjArr = Object.values(doubleNests[k])

    if (Object.values(valObjArr).length === 0) return
    const keyNames = rowPushObjHeaders(Object.values(doubleNests[k])[0])
    Object.values(doubleNests[k]).forEach((obj: any) => {
      rowPushObj(keyNames, obj)
    })
    retval.push([])
    retval.push([])
  })

  return toCSV(retval)
}
