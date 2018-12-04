const { createHash } = require('crypto')

const sha1 = (string) => {
  if (typeof string === 'object') string = JSON.stringify(string)
  const hash = createHash('sha1')
  hash.update(string)
  return hash.digest('hex')
}

module.exports = { sha1 }
