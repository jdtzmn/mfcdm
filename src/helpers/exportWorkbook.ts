import * as path from 'path'
import * as xlsx from 'xlsx'
import locateDir from './locateDir'

const exportWorkbook = async (workbook: xlsx.WorkBook, fileName: string) => {
  const directory = await locateDir(`Where should the ${fileName} file be put?`)
  const absolute = path.resolve(directory)
  const fullPath = path.join(absolute, fileName)
  xlsx.writeFile(workbook, fullPath)
}

export default exportWorkbook
