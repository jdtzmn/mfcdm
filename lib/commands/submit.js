const axios = require('axios')

const fetchTableData = require('../format/fetchTableData')
const question = require('../edit/substitutionHelpers')
const { formId } = require('../../form.config')
const handleEdits = require('../edit/handleEdits')
const constructPromises = require('../submit/constructPromises')

const instance = axios.create({
  baseURL: `https://docs.google.com/forms/d/e/${formId}`
})

const main = async () => {
  const entries = await fetchTableData(instance)

  // Make sure the form looks correct
  console.log(entries)
  console.log(`There are ${Object.keys(entries).length} entries`)
  const response = await question('Does this look right? Should the form be submitted? If it needs edits, type `Edit`.', ['Yes', 'No', 'Edit'])

  switch (response) {
    case 'No':
      console.log('The form was not submitted.')
      return
    case 'Edit':
      await handleEdits()
      return main() // run the program again with the updated values
    case 'Yes':
  }

  console.log('Submitting the form...')
  const formPromises = constructPromises(entries, instance)
  const responses = await Promise.all(formPromises.promises)
  formPromises.writeFile() // save the responses
  console.log('Submitted!')
  console.log(responses.filter((x) => x))
}

module.exports = main
