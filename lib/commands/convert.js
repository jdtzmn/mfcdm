const axios = require('axios')

const fetchTableData = require('../format/fetchTableData')
const { formId } = require('../../form.config')
const handleEdits = require('../edit/handleEdits')

const instance = axios.create({
  baseURL: `https://docs.google.com/forms/d/e/${formId}`
})

const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const main = async (term) => {
  const entries = await fetchTableData(instance)
  const entriesLength = Object.keys(entries).length

  // Make sure the form looks correct
  console.log(entries)

  const delay = 5 * entriesLength
  await timeout(delay)

  term.green.bold('The data has been saved ').defaultColor(`- ${entriesLength} entries\n`)
  const { promise } = term.singleColumnMenu(['Edit Data', 'Quit'])
  const { selectedText } = await promise

  switch (selectedText) {
    case 'Edit Data':
      await handleEdits()
      return main(term) // run the program again with the updated values
    default:
      process.exit()
  }
}

module.exports = main
