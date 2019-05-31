import * as inquirer from 'inquirer'
import * as xlsx from 'xlsx'
import Mfcdm from '..'
import { convertedTablePath, statisticsExcelName } from '../../config'
import { default as exportData, ExportData } from './exportData'

import { locateFile } from '../helpers'

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
  let outputData: ExportData = {}

  for (let analyzerName in middleware) {
    const analyzer = middleware[analyzerName]
    const statistics = await analyzer(analyzerName, sheetData)
    outputData[analyzerName] = statistics
  }

  /* ======== EXPORT DATA ======= */
  await exportData(outputData, statisticsExcelName)
}

export default analyze
