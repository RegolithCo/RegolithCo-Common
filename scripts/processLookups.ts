import { RefineryMethodEnum, MethodsBonusLookup } from '@regolithco/common'
import fs from 'fs'
import path from 'path'
import * as Papa from 'papaparse'
import log from 'loglevel'

log.enableAll()

// TODO: Switch to lookup up using Xpaths in the actual XML files
// This CSV middleman stuff is a hacky workaround
async function parseCSV(csvFile: string): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(csvFile, 'utf8', (error, data) => {
      if (error) {
        return reject(error)
      }

      Papa.parse(data, {
        complete: (results) => {
          resolve(results.data)
        },
        error: (error) => {
          reject(error)
        },
      })
    })
  })
}

async function getMethodsBonusLookup(): Promise<MethodsBonusLookup> {
  // Load CSV file from './data/methods-bonuses.csv'
  const csvArr = await parseCSV(path.join(__dirname, '../data/refineryMethods.csv'))
  // Parse CSV file into MethodsBonusLookup
  const bonusLookup = csvArr.reduce<MethodsBonusLookup>((acc, row) => {
    const method = String(row[0]).toUpperCase() as RefineryMethodEnum
    const yldMod = Number(row[1])
    const timeMod = Number(row[2])
    const costMod = Number(row[3])
    acc[method] = [yldMod, timeMod, costMod]
    return acc
  }, {} as MethodsBonusLookup)
  return bonusLookup
}

async function main() {
  const methods = await getMethodsBonusLookup()
  fs.writeFileSync(path.join(__dirname, '../src/gen/CIG/methods.json'), JSON.stringify(methods, null, 2))
  log.debug('done')
}

if (require.main === module) {
  main()
}
