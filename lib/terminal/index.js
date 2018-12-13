const { terminal: term } = require('terminal-kit')

const terminate = () => {
  term.grabInput(false)
  term.applicationKeypad(false)
  term.beep()
  term.fullscreen(false)

  // Add a 100ms delay, so the terminal will be ready when the process effectively exit, preventing bad escape sequences drop
  setTimeout(() => process.exit(), 100)
}

// setup CTRL+C
term.on('key', (name) => {
  if (name === 'CTRL_C') {
    terminate()
  }
})

module.exports = { term, terminate }
