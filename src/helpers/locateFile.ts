import * as util from 'util'
import * as fs from 'fs'
import * as path from 'path'
import * as inquirer from 'inquirer'

inquirer.registerPrompt('filePath', require('inquirer-file-path'))
const exists = util.promisify(fs.access) // convert fs.access to a promise

/* ============================== */
/* ======== HELPER METHODS ====== */
/* ============================== */

const testExistence = async (path: string) => {
  try {
    await exists(path)
    return true
  } catch (_e) {
    return false
  }
}

interface FilePathQuestion extends inquirer.Question {
  basePath: string
}

const askForPath = async (expectedPath: string, message?: string, basePath: string = './') => {
  if (message === undefined) {
    message = `${expectedPath} does not exist. What file should be used?`
  }

  const questions: FilePathQuestion[] = [{
    type: 'filePath',
    name: 'filePath',
    message,
    basePath
  }]

  return inquirer.prompt(questions)
    .then((answers: inquirer.Answers) => answers.filePath)
}

/* ============================== */
/* ========= MAIN METHOD ======== */
/* ============================== */

interface LocationOptions {
  basePath?: string,
  message?: string
}

const locateFile = async (expectedPath: string, options?: LocationOptions) => {
  if (!options) {
    options = {}
  }

  // check if command is run in project folder
  const projectDir = path.resolve(__dirname, '../')
  const scriptDir = path.resolve()

  if (projectDir === scriptDir) {
    expectedPath = path.join('./input', expectedPath)
  }

  // check if a file exists
  const fileExists = await testExistence(expectedPath)

  if (!fileExists) {
    expectedPath = `./${await askForPath(expectedPath, options.message, options.basePath)}`
  }

  return expectedPath
}

export default locateFile
