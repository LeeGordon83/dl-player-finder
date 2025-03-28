// utils/excel-reader.js
const xlsx = require('xlsx')

class ExcelReader {
  getSheet (workbook, sheetName) {
    const sheet = workbook.Sheets[sheetName]
    if (!sheet) {
      console.error(`Sheet named '${sheetName}' not found in the workbook.`)
      return null
    }
    return sheet
  }

  convertToJson (sheet) {
    return xlsx.utils.sheet_to_json(sheet, { header: 1 })
  }
}

module.exports = ExcelReader
