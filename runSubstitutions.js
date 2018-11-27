const tableData = require('./getTableData')
const { convertEntries } = require('./formSubmission')
const getFormData = require('./getFormData')
const substitutions = require('./substitutions')

const runSubstitutions = async (instance) => {
  const { entries } = await getFormData(instance)
  const list = Object.keys(convertEntries(entries))

  const data = []

  for (const row of tableData) {
    const substituted = await substitute(row, list)
    data.push(substituted)
  }

  return data
}

const substitute = async (row, list) => {
  const emptyObject = list.reduce((obj, name) => {
    obj[name] = ''
    return obj
  }, {})

  for (const name of list) {
    if (substitutions[name]) {
      let value = substitutions[name]

      if (typeof value === 'function') {
        value = await Promise.resolve(value(row)) // handle values and promise returns from the func
      }

      emptyObject[name] = value
    } else {
      emptyObject[name] = row[name]
    }
  }

  return emptyObject
}

module.exports = runSubstitutions
