import * as xlsx from 'xlsx'
import { exportWorkbook } from '../helpers'

export interface AnalyzerDataObj {
  [key: string]: any
}

export type AnalyzerDataArr = AnalyzerDataObj[]
export type AnalyzerData = AnalyzerDataObj | AnalyzerDataArr

const arrayify = (analyzerData: AnalyzerData) => {
  if (!Array.isArray(analyzerData)) return [analyzerData]
  return analyzerData
}

const calculateColumnData = (analyzerData: AnalyzerData) => {
  return calculateColumnDataFromArr(arrayify(analyzerData))
}

const calculateColumnDataFromArr = (analyzerDataArr: AnalyzerDataArr) => {
  const wscols = []

  for (const analyzerData of analyzerDataArr) {
    let colMaxLength = 0

    for (const key in analyzerData) {
      const keyLength = key.length
      const value = analyzerData[key]
      let valueLength = 0

      if (typeof value === 'number') {
        valueLength = 10
      } else if (typeof value === 'string') {
        valueLength = value.length
      }

      const maxLength = Math.max(keyLength, valueLength)
      if (maxLength > colMaxLength) colMaxLength = maxLength
    }

    wscols.push({ width: colMaxLength })
  }

  return wscols
}

export interface ExportData {
  [key: string]: AnalyzerData
}

// Export the canvas
const exportData = async (outputData: ExportData, fileName: string) => {
  const outputWorkbook = xlsx.utils.book_new()

  for (let analyzerName in outputData) {
    const analyzerData = outputData[analyzerName]
    const worksheet = xlsx.utils.json_to_sheet(arrayify(analyzerData))
    worksheet['!cols'] = calculateColumnData(analyzerData)
    xlsx.utils.book_append_sheet(outputWorkbook, worksheet, analyzerName)
  }

  await exportWorkbook(outputWorkbook, fileName)
}

export default exportData
