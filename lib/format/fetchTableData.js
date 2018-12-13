const fs = require('fs')
const tableData = require('./getTableData')
const substitute = require('../edit/runSubstitutions')
const { cache, formId } = require('../../form.config')
const { sha1 } = require('../cache/cacheHelpers')
const question = require('../edit/substitutionHelpers')

const convertTableToHashObject = () => {
  let data = {}

  for (let row of tableData) {
    data[sha1(row)] = row
  }

  return data
}

const convertHashListToTableList = (hashes, hashObject) => hashes.map(hash => hashObject[hash])

const compareTableAndCache = (contents) => {
  let table = convertTableToHashObject() // clone the tableData
  let cache = JSON.parse(contents) // parse the cacheData

  const tableKeys = Object.keys(table)

  const newTableKeys = tableKeys.filter((hash) => (!cache[hash]))
  const newTableDataToBeMerged = convertHashListToTableList(newTableKeys, table)
  return newTableDataToBeMerged
}

const fetchTableData = async (instance) => {
  let data

  const cacheFile = `${cache}${sha1(formId)}`
  if (fs.existsSync(cacheFile)) {
    data = await handleExistingCacheFile(cacheFile, instance)
  } else {
    data = await substitute(instance, tableData)
    fs.writeFileSync(cacheFile, JSON.stringify(data, undefined, 2))
  }

  return data
}

const handleExistingCacheFile = async (cacheFile, instance) => {
  const contents = fs.readFileSync(cacheFile)
  const difference = compareTableAndCache(contents)
  const cacheData = JSON.parse(contents)

  if (difference.length > 0) {
    console.log('Items to be merged or overwritten:')
    console.log(difference)
    const answer = await question('A cache file exists, should the table data be merged with the cache file or overwritten?', ['Overwritten', 'Merged'])

    switch (answer) {
      case 'Overwritten':
        fs.unlinkSync(cacheFile) // delete the cache file
        return fetchTableData() // run fetchTableData so that the data is saved (now that the cache file is deleted)
      default:
        const substituted = await substitute(instance, difference)
        const combined = Object.assign(cacheData, substituted)
        fs.writeFileSync(cacheFile, JSON.stringify(combined, undefined, 2))
        return combined
    }
  } else {
    return cacheData
  }
}

module.exports = fetchTableData
