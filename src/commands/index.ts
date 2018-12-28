import convert from './convert'
import { Converters } from '..'

export default (command: string, middleware: Converters) => {
  switch (command) {
    case 'convert':
      convert(middleware)
      break
    case 'verify':
      console.log('yay')
      break
    case 'analyze':
      console.log('yay2')
      break
    default:
      process.exit(0)
  }
}
