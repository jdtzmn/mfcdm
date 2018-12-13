const fs = require('fs')
const { createFormSubmitter } = require('./formSubmission')
const { cache, formId } = require('../../form.config')
const { sha1 } = require('../cache/cacheHelpers')

const constructPromises = (entries, instance) => {
  const sendFormSubmission = createFormSubmitter(instance)
  return new FormPromises(entries, sendFormSubmission)
}

class FormPromises {
  constructor (entries, sendFormSubmission) {
    this.entriesKeys = Object.keys(entries)
    this.entriesVals = Object.values(entries)

    // Create write stream
    const cacheFile = `${cache}${sha1(formId)}:status`
    this.writeStream = fs.createWriteStream(cacheFile)

    // Create promises
    const { entriesVals, entriesKeys } = this
    this.promises = entriesVals
      .map((entry, index) => sendFormSubmission(entry)
        .then(this.cacheSuccess(entriesKeys[index]))
        .catch(this.cacheFailure(entriesKeys[index])))
  }

  cacheSuccess (hash) {
    return () => {
      this.writeStream.write(`${hash}:true\n`)
    }
  }

  cacheFailure (hash) {
    return (error) => {
      console.log(error)
      this.writeStream.write(`${hash}:false:${error.message}\n`)
    }
  }

  writeFile () {
    this.writeStream.end()
  }
}

module.exports = constructPromises
