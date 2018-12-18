const { term, terminate } = require('./lib/terminal')

// commands
const submitCommand = require('./lib/commands/submit')
const verifyCommand = require('./lib/commands/verify')
const analyzeCommand = require('./lib/commands/analyze')
const convertCommand = require('./lib/commands/convert')

term.clear()

term('What would you like to do?\n')
const { promise } = term.singleColumnMenu([
  'Convert Data',
  'Verify Data',
  'Analyze Data',
  'Submit Form',
  'Quit'
])
promise.then(({ selectedText }) => {
  switch (selectedText) {
    case 'Submit Form':
      submitCommand(term)
      break
    case 'Verify Data':
      verifyCommand(term)
      break
    case 'Analyze Data':
      analyzeCommand(term)
      break
    case 'Convert Data':
      convertCommand(term)
      break
    default:
      terminate()
  }
})
