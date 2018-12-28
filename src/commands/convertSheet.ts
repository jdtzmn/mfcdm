import { ConverterFunction } from '..'

export default async (sheetName: string, sheetData: {}[], converter: ConverterFunction) => {
  const convertedData = []

  for (let sheetRow of sheetData) {
    const convertedRow = await converter(sheetName, sheetRow)
    convertedData.push(convertedRow)
  }

  return convertedData
}
