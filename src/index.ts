import * as inquirer from 'inquirer'
import { WorkSheet } from 'xlsx'

import handleCommand from './commands'

/* ============================== */
/* ========= MFCDM CLASS ======== */
/* ============================== */

export type ConverterFunction = (sheetName: string, sheetRow: object) => Promise<{} | false>
export interface Converters {
  [key: string]: ConverterFunction
}

export type AnalyzerFunction = (title: string, sheet: WorkSheet) => Promise<any>

export interface Analyzers {
  [key: string]: AnalyzerFunction
}

export default class Mfcdm {
  converters: Converters
  analyzers: Analyzers

  public static prompt = inquirer.createPromptModule()

  constructor () {
    this.converters = {}
    this.analyzers = {}
  }

  public setConverter (sheetName: string, fn: ConverterFunction) {
    this.converters[sheetName] = fn
  }

  public setAnalyzer (title: string, fn: AnalyzerFunction) {
    this.analyzers[title] = fn
  }

  start () {
    return askForInput(this)
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

function askForInput (mfcdm: Mfcdm) {
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

  return inquirer.prompt(questions)
    .then((answers: inquirer.Answers) => {
      const choice: Choice = answers.command

      const choices: Choices = {
        'Convert Data': 'convert',
        'Verify Data': 'verify',
        'Analyze Data': 'analyze',
        'Quit': 'quit'
      }

      const command = choices[choice]
      handleCommand(command, mfcdm)
    })
}
