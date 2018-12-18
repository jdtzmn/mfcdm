const { existsSync } = require('fs')
const axios = require('axios')

const fetchTableData = require('../format/fetchTableData')
const getFormData = require('../googleforms/getFormData')
const handleEdits = require('../edit/handleEdits')
const { mergeFormData } = require('../submit/formSubmission')
const { cache, formId } = require('../../form.config')
const { sha1 } = require('../cache/cacheHelpers')

const instance = axios.create({
  baseURL: `https://docs.google.com/forms/d/e/${formId}`
})

// ==============================
// ========== HELPERS ===========
// ==============================

const fixWarningsInteractively = async (warnings, entries, term) => {
  for (let index in warnings) {
    const { err, hash } = warnings[index]
    term.clear()

    term.blue('Edit ', +index + 1, ' of ', warnings.length, '\n\n')
    term.error.red(err, '\n\n')
    console.log(entries[hash])
    term('\n')
    await handleEdits(hash)
  }
}

// ==============================
// ============ MAIN ============
// ==============================

const main = async (term) => {
  // check that the data has already been converted
  const cacheFile = `${cache}${sha1(formId)}`
  if (!existsSync(cacheFile)) {
    console.log(new Error('Data has not been converted yet. Convert data before verifying.'))
    return process.exit()
  }

  // ------------------------------
  //       VERIFY THE DATA
  // ------------------------------

  const entries = await fetchTableData()
  const entriesLength = Object.keys(entries).length
  const { entries: formEntries } = await getFormData(instance)

  let warnings = []

  for (let hash in entries) {
    const entry = entries[hash]

    try {
      mergeFormData(formEntries, entry)
    } catch (err) {
      term.error.yellow(`Warning [${hash}]: ${err.message}\n\n`)

      /* add to a list of warnings in case the data is fixed interactively */
      warnings.push({ err, hash })
    }
  }

  term.green.bold('The data has been verified ').defaultColor(`- ${entriesLength} entries\n`)

  // ------------------------------
  //       ASK TO EDIT DATA
  // ------------------------------

  const { promise } = term.singleColumnMenu(['Interactively', 'Manually'])
  const { selectedText } = await promise

  switch (selectedText) {
    case 'Interactively':
      return fixWarningsInteractively(warnings, entries, term)
    default:
      process.exit()
  }
}

module.exports = main
