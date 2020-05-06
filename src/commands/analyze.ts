import Mfcdm from '..'
import { statisticsExcelName } from '../../config'
import { default as exportData, ExportData } from './exportData'
import { pickSheetData } from '../helpers'

/* ============================== */
/* ======= ANALYZE COMMAND ====== */
/* ============================== */

const analyze = async (mfcdm: Mfcdm) => {
  const middleware = mfcdm.analyzers

  /* ====== CHOOSE SHEETS ======= */
  const sheetData = await pickSheetData()

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
