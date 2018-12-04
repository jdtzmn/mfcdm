const axios = require('axios')

const fetchTableData = require('./fetchTableData')
const { createFormSubmitter } = require('./formSubmission')
const question = require('./substitutionHelpers')
const { formId } = require('./form.config')
const handleEdits = require('./handleEdits')

const instance = axios.create({
  baseURL: `https://docs.google.com/forms/d/e/${formId}`
})
const sendFormSubmission = createFormSubmitter(instance)

const main = async () => {
  const entries = await fetchTableData(instance)

  // Make sure the form looks correct
  console.log(entries)
  const response = await question('Does this look right? Should the form be submitted? If it needs edits, type `Edit`.', ['Yes', 'No', 'Edit'])

  switch (response) {
    case 'No':
      console.log('The form was not submitted.')
      return
    case 'Edit':
      await handleEdits()
      return main() // run the program again with the updated values
  }

  console.log('Submitting the form...')
  const promises = entries.map(sendFormSubmission)
  await Promise.all(promises)
  console.log('Submitted!')
}

main()
