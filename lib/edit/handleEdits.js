const fs = require('fs')
const question = require('./substitutionHelpers')
const { sha1 } = require('../cache/cacheHelpers')
const { cache, formId } = require('../../form.config')

const getCacheData = () => {
  const cacheFile = `${cache}${sha1(formId)}`
  const contents = fs.readFileSync(cacheFile)
  const data = JSON.parse(contents)
  return data
}

const getResource = (hash, key) => {
  const data = getCacheData()

  const resource = data[hash]
  if (resource === undefined) return undefined
  if (resource[key] === undefined) return null

  return {
    key,
    value: resource[key]
  }
}

const saveResource = (hash, key, value) => {
  const updated = getCacheData()
  updated[hash][key] = value

  const cacheFile = `${cache}${sha1(formId)}`
  fs.writeFileSync(cacheFile, JSON.stringify(updated, undefined, 2))
}

const handleEdits = async (hash) => {
  let keyName
  let resource

  if (hash) {
    resource = await question('What key should be updated? Use the form `[key]` to select. Use `Quit` to quit editing.')
  } else {
    resource = await question('What key should be updated? Use the form `[hash] [key]` to select. Use `Quit` to quit editing.')
  }

  // Offer a way out
  if (resource === 'Quit') return

  if (hash) {
    keyName = resource
  } else {
    const indexOfFirstSpace = resource.indexOf(' ')
    if (indexOfFirstSpace === -1) {
      console.log('Invalid format, try again.')
      return handleEdits()
    }

    hash = resource.slice(0, indexOfFirstSpace)
    keyName = resource.slice(indexOfFirstSpace + 1)
  }

  const resourceData = getResource(hash, keyName)

  if (resourceData === undefined) {
    console.log('Hash does not exist in the cache, try again.')
    return handleEdits()
  } else if (resourceData === null) {
    console.log('Key does not exist on the hash.')
    const value = await question('What should the value be of the created property?')

    return saveResource(hash, keyName, value)
  }

  const { key, value } = resourceData

  console.log(`The current value for key [${key}] is: ${value}`)
  const newValue = await question('What should the new value for it be?')

  saveResource(hash, key, newValue)
}

module.exports = handleEdits
