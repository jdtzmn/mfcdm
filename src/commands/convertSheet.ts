import { ConverterFunction } from '..'

export default async (sheetName: string, sheetData: {}[], converter: ConverterFunction) => {
  const convertedData = []

  for (let sheetRow of sheetData) {
    const convertedRow = await converter(sheetName, sheetRow)

    // Only push the converted row if the response is not false
    if (convertedRow !== false) {
      convertedData.push(convertedRow)
    }
  }

  return convertedData
}
