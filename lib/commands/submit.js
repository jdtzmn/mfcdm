const axios = require('axios')
const { existsSync } = require('fs')

const fetchTableData = require('../format/fetchTableData')
const question = require('../edit/substitutionHelpers')
const { cache, formId } = require('../../form.config')
const constructPromises = require('../submit/constructPromises')
const { sha1 } = require('../cache/cacheHelpers')

const instance = axios.create({
  baseURL: `https://docs.google.com/forms/d/e/${formId}`
})

const main = async () => {
  // check that the data has already been converted
  const cacheFile = `${cache}${sha1(formId)}`
  if (!existsSync(cacheFile)) {
    console.log(new Error('Data has not been converted yet. Convert data before submitting.'))
    return process.exit()
  }

  const entries = await fetchTableData(instance)

  // Make sure the form looks correct
  console.log(entries)
  console.log(`There are ${Object.keys(entries).length} entries`)
  const response = await question('Does this look right? Should the form be submitted?', ['Yes', 'No'])

  if (response === 'No') {
    console.log('The form was not submitted.')
    return
  }

  console.log('Submitting the form...')
  const formPromises = constructPromises(entries, instance)
  const responses = await Promise.all(formPromises.promises)
  formPromises.writeFile() // save the responses
  console.log('Submitted!')
  console.log(responses.filter((x) => x))
}

module.exports = main
