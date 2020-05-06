import convert from './convert'
import analyze from './analyze'
import Mfcdm from '..'

export default (command: string, mfcdm: Mfcdm) => {
  switch (command) {
    case 'convert':
      return convert(mfcdm)
    case 'verify':
      console.log('verify command is still in progress')
      break
    case 'analyze':
      return analyze(mfcdm)
    default:
      process.exit(0)
  }
}
