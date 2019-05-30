import * as path from 'path'
import * as inquirer from 'inquirer'
import * as xlsx from 'xlsx'
import { default as Mfcdm, ChartConfiguration } from '..'
import { convertedTablePath } from '../../config'

import { locateFile, locateDir } from '../helpers'
import exportGraph from './exportGraph'

/* ============================== */
/* ======== HELPER METHODS ====== */
/* ============================== */

const askWhichSheet = async (sheetNames: string[]) => {
  const questions: inquirer.Questions = [{
    type: 'list',
    name: 'sheet',
    message: 'There are multiple sheets availabe. Which one should be analyzed?',
    choices: sheetNames
  }]

  return inquirer.prompt(questions)
    .then((answers: inquirer.Answers) => answers.sheet)
}

interface ExportData {
  [key: string]: ChartConfiguration
}

const exportGraphs = async (configurations: ExportData) => {
  /* ===== SPECIFY EXPORT DIR ===== */
  const directory = await locateDir(`Where should the graph files be put?`)
  const absolutePath = path.resolve(directory)

  /* ======== EXPORT GRAPHS ======= */
  for (let name in configurations) {
    const config = configurations[name]

    const fullPath = path.join(absolutePath, `${name}.png`)
    await exportGraph(config, fullPath)
  }
}

/* ============================== */
/* ======= ANALYZE COMMAND ====== */
/* ============================== */

const analyze = async (mfcdm: Mfcdm) => {
  const middleware = mfcdm.analyzers

  /* ======= GET TABLE PATH ======= */
  const tablePath = await locateFile(convertedTablePath)

  /* ======= GET TABLE DATA ====== */
  const workbook: xlsx.WorkBook = xlsx.readFile(tablePath, {
    cellDates: true
  })
  const sheetNames = workbook.SheetNames
  let sheetToAnalyze = sheetNames[0]

  /* ====== ASK WHICH SHEET ===== */
  if (sheetNames.length > 1) {
    sheetToAnalyze = await askWhichSheet(sheetNames)
  }

  /* ===== ACCESS SHEET DATA ==== */
  const sheet = workbook.Sheets[sheetToAnalyze]
  const sheetData = xlsx.utils.sheet_to_json(sheet)

  /* ======= ANALYZE DATA ======= */
  let configurations: ExportData = {}

  for (let analyzerName in middleware) {
    const analyzer = middleware[analyzerName]
    const configuration = await analyzer(analyzerName, sheetData)
    configurations[analyzerName] = configuration
  }

  /* ======== EXPORT DATA ======= */
  exportGraphs(configurations)
}

export default analyze
