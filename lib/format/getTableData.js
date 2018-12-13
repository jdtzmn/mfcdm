const fs = require('fs')

const { tableFile } = require('../../form.config')

if (!fs.existsSync(tableFile)) {
  throw new Error(`${tableFile} doesn't exist`)
}

const file = fs.readFileSync(tableFile, 'utf8')
const lines = file.split('\n')
const rows = lines.map(line => line.split('\t'))
const header = rows[0]
const arrayData = rows.slice(1)

const tableData = arrayData.reduce((sum, row) => {
  const element = row.reduce((sum2, value, index) => {
    const key = header[index]
    sum2[key] = value
    return sum2
  }, {})

  sum.push(element)
  return sum
}, [])

module.exports = tableData
