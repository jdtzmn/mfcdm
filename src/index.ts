import * as inquirer from 'inquirer'

import handleCommand from './commands'

/* ============================== */
/* ========= MFCDM CLASS ======== */
/* ============================== */

export type ConverterFunction = (sheetName: string, sheetRow: object) => Promise<any>
export interface Converters {
  [key: string]: ConverterFunction
}

export default class Mfcdm {
  private converters: Converters

  public static prompt = inquirer.createPromptModule()

  constructor () {
    this.converters = {}
  }

  middleware (sheetName: string, fn: ConverterFunction) {
    this.converters[sheetName] = fn
  }

  start () {
    askForInput(this.converters)
  }
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

function askForInput (middleware: Converters) {
  const questions: inquirer.Questions = [{
    type: 'list',
    name: 'command',
    message: 'What would you like to do?',
    choices: [
      'Convert Data',
      'Verify Data',
      'Analyze Data',
      'Quit'
    ]
  }]

  inquirer.prompt(questions)
    .then((answers: inquirer.Answers) => {
      const choice: Choice = answers.command

      const choices: Choices = {
        'Convert Data': 'convert',
        'Verify Data': 'verify',
        'Analyze Data': 'analyze',
        'Quit': 'quit'
      }

      const command = choices[choice]
      handleCommand(command, middleware)
    })
}
