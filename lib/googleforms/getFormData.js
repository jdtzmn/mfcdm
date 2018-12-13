const fs = require('fs')
const { formId, cache } = require('../../form.config')

const parseEntries = (entriesArr) => {
  let entries = []

  for (let entry of entriesArr) {
    const id = `entry.${entry[4][0][0]}`
    const name = entry[1]
    const required = !!entry[4][0][2]
    const defaultData = { id, name, required }

    switch (entry[3]) {
      case 2:
        entries.push({
          ...defaultData,
          options: entry[4][0][1].map(arr => arr[0])
        })
        break
      case 9:
        entries = entries.concat(['year', 'month', 'day'].map(interval => ({
          name: `${name}_${interval}`,
          id: `${id}_${interval}`,
          required
        })))
        break
      default:
        entries.push(defaultData)
    }
  }
  return entries
}

const getSeedFromHtml = (html) => {
  const regex = /data-shuffle-seed="(-?\d*)"/gm
  const seed = regex.exec(html)
  return seed[1]
}

const getFormData = (instance) => {
  const file = `${cache}${formId}`
  if (fs.existsSync(file)) {
    const entries = JSON.parse(fs.readFileSync(file))
    return Promise.resolve(entries)
  } else {
    return instance.get('/viewform')
      .then(({ data: html }) => {
        const regex = /FB_PUBLIC_LOAD_DATA_ = ([^;]*)/gm
        const match = regex.exec(html)[1]
        const json = JSON.parse(match)

        const entriesArr = json[1][1]
        const entries = parseEntries(entriesArr)

        const seed = getSeedFromHtml(html)

        const dataToReturn = { entries, seed }

        fs.writeFileSync(file, JSON.stringify(dataToReturn, undefined, 2))
        return dataToReturn
      })
  }
}

module.exports = getFormData
