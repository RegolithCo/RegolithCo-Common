import { PendingUser, SessionUser } from './gen/schema.types'
import { CrewHierarchy } from './types'

/**
 * Turn a flat list of session users into a hierarchy of captains and crew
 * the return values are all userIds.
 * @param sessionUsers
 * @returns
 */
export const crewHierarchyCalc = (sessionUsers: SessionUser[], pendingUsers: PendingUser[]): CrewHierarchy => {
  // First find the captains
  const userIds = sessionUsers.map((su) => su.owner.userId)
  const captains: SessionUser[] = sessionUsers.filter((su) => su.captainId === null || !userIds.includes(su.captainId))

  const potentialActiveCrew: SessionUser[] = sessionUsers.filter(
    (su) => su.captainId !== null && userIds.includes(su.captainId)
  )
  const potentialInnactiveCrew = pendingUsers.filter(
    ({ captainId }) => captainId !== null && userIds.includes(captainId)
  )

  const retVal = captains.reduce((acc, captObj) => {
    acc[captObj.owner.userId] = {
      activeIds: potentialActiveCrew
        .filter((potCrewMemb) => potCrewMemb.captainId === captObj.owner.userId)
        .map((c) => c.ownerId),
      // Innactive members we use scName instead of userId
      innactiveSCNames: potentialInnactiveCrew
        .filter((potCrewMemb) => potCrewMemb.captainId === captObj.owner.userId)
        .map((iu) => iu.scName),
    }
    return acc
  }, {} as CrewHierarchy)

  // Now remove anything where both activeIds and innactiveSCNames are empty
  return Object.entries(retVal).reduce((acc, [captainId, { activeIds, innactiveSCNames }]) => {
    if (activeIds.length > 0 || innactiveSCNames.length > 0) {
      acc[captainId] = { activeIds, innactiveSCNames }
    }
    return acc
  }, {} as CrewHierarchy)
}
