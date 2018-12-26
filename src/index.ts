import * as program from 'commander'
import * as inquirer from 'inquirer'

import handleCommand from './commands'

/* ============================== */
/* ========= CLI OPTIONS ======== */
/* ============================== */

program
  .version('0.1.0')
  .option('-c, --convert', 'Convert Data')
  .option('-v, --verify', 'Verify Data')
  .option('-a --analyze', 'Analyze Data')
  .parse(process.argv)

// construct a list of possible options
const flags: string[] = program.options
  .map((option: program.Option) => option.long.slice(2))

// filter the arguments
const args = Object.keys(program)
  .filter(key => flags.indexOf(key) >= 0)

// handle a single argument
if (args.length === 1) {
  const command = args[0]
  handleCommand(command)
} else {
  askForInput()
}

/* ============================== */
/* ===== INTERACTIVE OPTIONS ==== */
/* ============================== */

interface Choices {
  'Convert Data': string,
  'Verify Data': string,
  'Analyze Data': string,
  'Quit': string,
  [key: string]: string
}

enum Choice {
  'Convert Data',
  'Verify Data',
  'Analyze Data',
  'Quit'
}

function askForInput () {
  const questions: inquirer.Question[] = [{
    name: 'command',
    message: 'What would you like to do?',
    type: 'list',
    choices: [
      'Convert Data',
      'Verify Data',
      'Analyze Data',
      'Quit'
    ]
  }]

  inquirer.prompt(questions)
    .then((answers: inquirer.Answers) => {
      const choice: Choice = answers['command']

      const choices: Choices = {
        'Convert Data': 'convert',
        'Verify Data': 'verify',
        'Analyze Data': 'analyze',
        'Quit': 'quit'
      }

      const command = choices[choice]
      handleCommand(command)
    })
}
