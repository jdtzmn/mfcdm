import * as xlsx from 'xlsx'
import { exportWorkbook } from '../helpers'

export interface ExportData {
  [key: string]: {}
}

// Export the canvas
const exportData = async (outputData: ExportData, fileName: string) => {
  const outputWorkbook = xlsx.utils.book_new()

  for (let analyzerName in outputData) {
    const analyzerData = outputData[analyzerName]
    const worksheet = xlsx.utils.json_to_sheet([analyzerData])
    xlsx.utils.book_append_sheet(outputWorkbook, worksheet, analyzerName)
  }

  await exportWorkbook(outputWorkbook, fileName)
}

export default exportData
