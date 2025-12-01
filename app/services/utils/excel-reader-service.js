const ExcelJS = require('exceljs')

class ExcelReader {
  async loadWorkbook (filePath) {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(filePath)
    return workbook
  }

  getSheet (workbook, sheetName) {
    const sheet = workbook.getWorksheet(sheetName)
    if (!sheet) {
      console.error(`Sheet named '${sheetName}' not found in the workbook.`)
      return null
    }
    return sheet
  }

  convertToJson (sheet) {
    const rows = []
    sheet.eachRow({ includeEmpty: true }, (row) => {
      rows.push(row.values.slice(1))
      // row.values index 0 is always null, slice removes that
    })
    return rows
  }
}

module.exports = ExcelReader
