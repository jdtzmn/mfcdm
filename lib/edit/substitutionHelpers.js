const readline = require('readline')

const askQuestion = (question, options) => new Promise(resolve => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdin
  })

  rl.on('line', (input) => {
    if (!options || options.includes(input)) {
      resolve(input)
      rl.close()
    } else {
      prompt(rl, `Please choose one of the options: [${options}]`)
    }
  })

  prompt(rl, question)
})

const prompt = (rl, msg) => {
  console.log(msg)
  rl.prompt()
}

module.exports = askQuestion
