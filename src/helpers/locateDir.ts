import * as inquirer from 'inquirer'
inquirer.registerPrompt('directory', require('inquirer-directory'))

interface DirectoryQuestion extends inquirer.Question {
  basePath: string
}

const locateDir = (message: string) => {
  const questions: DirectoryQuestion[] = [{
    type: 'directory',
    name: 'dir',
    message,
    basePath: './'
  }]

  return inquirer.prompt(questions)
    .then((answers: inquirer.Answers) => answers.dir)
}

export default locateDir
