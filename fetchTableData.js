const crypto = require('crypto')
const fs = require('fs')
const tableData = require('./getTableData')
const substitute = require('./runSubstitutions')
const { cache } = require('./form.config')

const sha1 = (string) => {
  if (typeof string === 'object') string = JSON.stringify(string)
  const hash = crypto.createHash('sha1')
  hash.update(string)
  return hash.digest('hex')
}

const fetchTableData = async (instance) => {
  let data

  const cacheFile = `${cache}${sha1(tableData)}`
  if (fs.existsSync(cacheFile)) {
    const contents = fs.readFileSync(cacheFile)
    data = JSON.parse(contents)
  } else {
    data = await substitute(instance)
    fs.writeFileSync(cacheFile, JSON.stringify(data, undefined, 2))
  }

  return data
}

module.exports = fetchTableData
