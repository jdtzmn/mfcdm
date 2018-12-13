const { term } = require('./lib/terminal')

// commands
const submitCommand = require('./lib/commands/submit')

term.clear()

term('What would you like to do?\n')
const { promise } = term.singleColumnMenu(['Submit Form', 'Convert Data', 'Analyze Data'])
promise.then((command) => {
  switch (command.selectedText) {
    case 'Submit Form':
      submitCommand()
      break
  }
})
