const querystring = require('querystring')

// ==============================
// =========== HELPERS ==========
// ==============================

const convertEntries = (entries) => {
  return entries.reduce((obj, entry) => {
    const { name, id, options, required } = entry
    if (name.includes('_year') || name.includes('_month') || name.includes('_day')) {
      const lastName_ = name.lastIndexOf('_')
      const regularName = name.slice(0, lastName_)
      const value = obj[regularName]
      if (!value) {
        const lastId_ = id.lastIndexOf('_')
        const regularId = id.slice(0, lastId_)
        obj[regularName] = { id: ['year', 'month', 'day'].map(interval => `${regularId}_${interval}`) }
      }
    } else {
      obj[name] = { id, options, required }
    }
    return obj
  }, {})
}

const constructFormData = (entries) => {
  return entries.reduce((obj, entry) => {
    obj[entry.id] = ''
    return obj
  }, {})
}

const mergeFormData = (entries, formData) => {
  const data = Object.assign({}, constructFormData(entries))
  const rules = convertEntries(entries)

  for (let key in formData) {
    const value = formData[key]
    const rule = rules[key]
    if (!rule) continue // end if there is no rule (do not merge)

    const { options } = rule

    if (Array.isArray(rule.id)) {
      const { year, month, day } = decodeDate(value)
      data[rule.id[0]] = year
      data[rule.id[1]] = month
      data[rule.id[2]] = day
    } else {
      if (typeof options !== 'undefined' && !options.includes(value)) {
        throw new Error(`Invalid option (${value}) for key: ${key} [Options: ${options}]`)
      }

      data[rule.id] = value
    }
  }

  for (let key in rules) {
    const rule = rules[key]
    const value = formData[key]
    if (rule && rule.required && typeof value === 'undefined') {
      throw new Error(`Key is required: ${key}`)
    }
  }

  return data
}

const decodeDate = (dateString) => {
  if (isNaN(Date.parse(dateString))) {
    throw new Error(`${dateString} is not a valid date`)
  }
  const date = new Date(dateString)

  let year = date.getFullYear().toString()

  let month = (date.getMonth() + 1).toString()
  month = month.length > 1 ? month : `0${month}`

  let day = date.getDate().toString()
  day = day.length > 1 ? day : `0${day}`

  return { year, month, day }
}

// ==============================
// ============ MAIN ============
// ==============================

const getFormData = require('../googleforms/getFormData')

const sendFormSubmission = async (formData, instance) => {
  const { entries, seed } = await getFormData(instance)
  const body = mergeFormData(entries, formData)
  const requestBody = {
    ...body,
    fvv: 1,
    draftResponse: `[null,null,"${seed}"]`,
    pageHistory: 0,
    fbzx: +seed
  }

  const data = querystring.stringify(requestBody)

  const config = {
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }

  return instance.post('/formResponse', data, config)
}

const createFormSubmitter = (instance) => (formData) => sendFormSubmission(formData, instance)

module.exports = { createFormSubmitter, convertEntries }
