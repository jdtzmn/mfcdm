import convert from './convert'
import analyze from './analyze'
import Mfcdm from '..'

export default (command: string, mfcdm: Mfcdm) => {
  switch (command) {
    case 'convert':
      convert(mfcdm)
      break
    case 'verify':
      console.log('verify command is still in progress')
      break
    case 'analyze':
      analyze(mfcdm)
      break
    default:
      process.exit(0)
  }
}
