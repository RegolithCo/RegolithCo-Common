import { SystemEnum } from './gen/schema.types'
import { GravityWell, GravityWellTypeEnum } from './types'

type GravWellTsv = {
  code: string
  name: string
  wellType: GravityWellTypeEnum
  system: SystemEnum
  parent: string
  isSpace: boolean
  isSurface: boolean
  hasRocks: boolean
  hasGems: boolean
}

export const getGravityWells = (
  systemLookup: [string, string, string, string, string, string, string, string, string][]
): GravityWell[] => {
  if (!systemLookup || systemLookup.length === 0) return []

  const bodies = systemLookup.reduce(
    (acc, [code, name, well_type, system, parent, is_space, is_surface, has_rocks, has_gems]) => {
      const body: GravWellTsv = {
        code,
        name,
        wellType: well_type as GravityWellTypeEnum,
        system: system as SystemEnum,
        parent,
        isSpace: is_space === '1',
        isSurface: is_surface === '1',
        hasRocks: has_rocks === '1',
        hasGems: has_gems === '1',
      }
      acc.push(body)
      return acc
    },
    [] as GravWellTsv[]
  )

  const systems = bodies.filter(({ wellType }) => wellType === GravityWellTypeEnum.SYSTEM)
  //  Need to output all values in the format of { label: 'SYSTEMNAME - PLANETNAME - SATNAME', id: 'PY' }
  const planetOptions = systems.reduce((acc, system) => {
    acc.push({
      label: system.name,
      wellType: GravityWellTypeEnum.SYSTEM,
      id: system.code,
      system: system.code as SystemEnum,
      depth: 0,
      parent: null,
      parents: [],
      parentType: null,
      isSpace: system.isSpace,
      isSurface: system.isSpace,
      hasGems: system.hasGems,
      hasRocks: system.hasRocks,
    })
    bodies
      .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.BELT && parent === system.code)
      .forEach((belt) => {
        acc.push({
          label: belt.name,
          wellType: GravityWellTypeEnum.BELT,
          id: belt.code,
          system: belt.system as SystemEnum,
          depth: 1,
          parent: belt.parent,
          parents: [system.code],
          parentType: GravityWellTypeEnum.SYSTEM,
          isSpace: belt.isSpace,
          isSurface: belt.isSurface,
          hasGems: belt.hasGems,
          hasRocks: belt.hasRocks,
        })
      })

    // Now we descend into planets
    bodies
      .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.PLANET && parent === system.code)
      .forEach((planet) => {
        acc.push({
          label: planet.name,
          wellType: GravityWellTypeEnum.PLANET,
          id: planet.code,
          system: planet.system as SystemEnum,
          depth: 1,
          parent: planet.parent,
          parents: [system.code],
          parentType: GravityWellTypeEnum.SYSTEM,
          isSpace: planet.isSpace,
          isSurface: planet.isSurface,
          hasGems: planet.hasGems,
          hasRocks: planet.hasRocks,
        })
        bodies
          .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.CLUSTER && parent === planet.code)
          .forEach((cluster) => {
            acc.push({
              label: cluster.name,
              wellType: GravityWellTypeEnum.CLUSTER,
              id: cluster.code,
              system: cluster.system as SystemEnum,
              depth: 2,
              parent: cluster.parent,
              parents: [system.code, planet.code],
              parentType: GravityWellTypeEnum.PLANET,
              isSpace: cluster.isSpace,
              isSurface: cluster.isSurface,
              hasGems: cluster.hasGems,
              hasRocks: cluster.hasRocks,
            })
          })
        bodies
          .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.BELT && parent === planet.code)
          .forEach((belt) => {
            acc.push({
              label: belt.name,
              wellType: GravityWellTypeEnum.BELT,
              id: belt.code,
              system: belt.system as SystemEnum,
              depth: 2,
              parent: belt.parent,
              parents: [system.code, planet.code],
              parentType: GravityWellTypeEnum.PLANET,
              isSpace: belt.isSpace,
              isSurface: belt.isSurface,
              hasGems: belt.hasGems,
              hasRocks: belt.hasRocks,
            })
          })
        bodies
          .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.LAGRANGE && parent === planet.code)
          .forEach((lagrange) => {
            acc.push({
              label: lagrange.name,
              wellType: GravityWellTypeEnum.LAGRANGE,
              id: lagrange.code,
              system: lagrange.system as SystemEnum,
              depth: 2,
              parent: lagrange.parent,
              parents: [system.code, planet.code],
              parentType: GravityWellTypeEnum.PLANET,
              isSpace: lagrange.isSpace,
              isSurface: lagrange.isSurface,
              hasGems: lagrange.hasGems,
              hasRocks: lagrange.hasRocks,
            })
            bodies
              .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.CLUSTER && parent === lagrange.code)
              .forEach((cluster) => {
                acc.push({
                  label: cluster.name,
                  wellType: GravityWellTypeEnum.CLUSTER,
                  id: cluster.code,
                  system: cluster.system as SystemEnum,
                  depth: 3,
                  parent: cluster.parent,
                  parents: [system.code, planet.code, lagrange.code],
                  parentType: GravityWellTypeEnum.PLANET,
                  isSpace: cluster.isSpace,
                  isSurface: cluster.isSurface,
                  hasGems: cluster.hasGems,
                  hasRocks: cluster.hasRocks,
                })
              })
          })
        bodies
          .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.SATELLITE && parent === planet.code)
          .forEach((sat) => {
            acc.push({
              label: sat.name,
              wellType: GravityWellTypeEnum.SATELLITE,
              id: sat.code,
              system: sat.system as SystemEnum,
              depth: 2,
              parent: sat.parent,
              parents: [system.code, planet.code],
              parentType: GravityWellTypeEnum.PLANET,
              isSpace: sat.isSpace,
              isSurface: sat.isSurface,
              hasGems: sat.hasGems,
              hasRocks: sat.hasRocks,
            })
            bodies
              .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.BELT && parent === sat.code)
              .forEach((belt) => {
                acc.push({
                  label: belt.name,
                  wellType: GravityWellTypeEnum.BELT,
                  id: belt.code,
                  depth: 3,
                  parent: belt.parent,
                  system: belt.system as SystemEnum,
                  parents: [system.code, planet.code, sat.code],
                  parentType: GravityWellTypeEnum.SATELLITE,
                  isSpace: belt.isSpace,
                  isSurface: belt.isSurface,
                  hasGems: belt.hasGems,
                  hasRocks: belt.hasRocks,
                })
              })
            bodies
              .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.CLUSTER && parent === sat.code)
              .forEach((cluster) => {
                acc.push({
                  label: cluster.name,
                  wellType: GravityWellTypeEnum.CLUSTER,
                  id: cluster.code,
                  system: cluster.system as SystemEnum,
                  depth: 3,
                  parent: cluster.parent,
                  parents: [system.code, planet.code, sat.code],
                  parentType: GravityWellTypeEnum.SATELLITE,
                  isSpace: cluster.isSpace,
                  isSurface: cluster.isSurface,
                  hasGems: cluster.hasGems,
                  hasRocks: cluster.hasRocks,
                })
              })
          })
      })

    // Finally we put the CLUSTERS that are system level
    bodies
      .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.CLUSTER && parent === system.code)
      .forEach((cluster) => {
        acc.push({
          label: cluster.name,
          wellType: GravityWellTypeEnum.CLUSTER,
          id: cluster.code,
          system: cluster.system as SystemEnum,
          depth: 1,
          parent: cluster.parent,
          parents: [system.code],
          parentType: GravityWellTypeEnum.SYSTEM,
          isSpace: cluster.isSpace,
          isSurface: cluster.isSurface,
          hasGems: cluster.hasGems,
          hasRocks: cluster.hasRocks,
        })
        bodies
          .filter(({ wellType, parent }) => wellType === GravityWellTypeEnum.CLUSTER && parent === cluster.code)
          .forEach((clusterInner) => {
            acc.push({
              label: clusterInner.name,
              wellType: GravityWellTypeEnum.CLUSTER,
              id: clusterInner.code,
              system: clusterInner.system as SystemEnum,
              depth: 2,
              parent: clusterInner.parent,
              parents: [system.code, cluster.code],
              parentType: GravityWellTypeEnum.CLUSTER,
              isSpace: clusterInner.isSpace,
              isSurface: clusterInner.isSurface,
              hasGems: clusterInner.hasGems,
              hasRocks: clusterInner.hasRocks,
            })
          })
      })

    return acc
  }, [] as GravityWell[])
  return planetOptions
}
