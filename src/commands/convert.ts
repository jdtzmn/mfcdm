import * as path from 'path'
import * as inquirer from 'inquirer'
import * as xlsx from 'xlsx'
import { defaultTablePath, convertedExcelName } from '../../config'

import { locateFile, locateDir } from '../helpers'
import convertSheet from './convertSheet'
import Mfcdm from '..'

/* ============================== */
/* ======== HELPER METHODS ====== */
/* ============================== */

const askWhichSheets = async (sheetNames: string[]) => {
  const questions: inquirer.Questions = [{
    type: 'checkbox',
    name: 'sheets',
    message: 'There are multiple sheets availabe. Which ones should be converted?',
    choices: sheetNames,
    default: sheetNames
  }]

  return inquirer.prompt(questions)
    .then((answers: inquirer.Answers) => answers.sheets)
}

const exportWorkbook = async (workbook: xlsx.WorkBook) => {
  const directory = await locateDir(`Where should the ${convertedExcelName} file be put?`)
  const absolute = path.resolve(directory)
  const fullPath = path.join(absolute, convertedExcelName)
  xlsx.writeFile(workbook, fullPath)
}

/* ============================== */
/* ======= CONVERT COMMAND ====== */
/* ============================== */

const convert = async (mfcdm: Mfcdm) => {
  const middleware = mfcdm.converters
  /* ======= GET TABLE PATH ======= */

  const tablePath = await locateFile(defaultTablePath)

  /* ======= GET TABLE DATA ====== */
  const workbook: xlsx.WorkBook = xlsx.readFile(tablePath, {
    cellDates: true
  })
  const sheetNames = workbook.SheetNames

  let sheetsToConvert = sheetNames

  // filter out available middleware
  const sheetConverters = Object.keys(middleware)
  sheetsToConvert = sheetsToConvert
    .filter(name => sheetConverters.indexOf(name) > -1)

  /* ====== ASK WHICH SHEETS ===== */
  if (sheetsToConvert.length > 1) {
    sheetsToConvert = await askWhichSheets(sheetNames)
  }

  const outputWorkbook = xlsx.utils.book_new()

  for (let sheetName of sheetsToConvert) {
    const sheet = workbook.Sheets[sheetName]
    const sheetData = xlsx.utils.sheet_to_json(sheet)
    const convertedSheetData = await convertSheet(sheetName, sheetData, middleware[sheetName])
    const worksheet = xlsx.utils.json_to_sheet(convertedSheetData)
    xlsx.utils.book_append_sheet(outputWorkbook, worksheet, sheetName)
  }

  exportWorkbook(outputWorkbook)
}

export default convert
