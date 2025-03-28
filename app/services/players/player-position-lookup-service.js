// player-position-lookup-service.js
const ExcelReader = require('../utils/excel-reader-service')
const PlayerMatchingService = require('./player-matching-service')

class PlayerPositionLookupService {
  constructor () {
    this.excelReader = new ExcelReader()
    this.playerMatchingService = new PlayerMatchingService()
  }

  findPlayerPosition (firstName, surname, team, workbook) {
    const sheet = this.excelReader.getSheet(workbook, 'ALL')
    if (!sheet) {
      return null
    }

    const data = this.excelReader.convertToJson(sheet)
    return this.playerMatchingService.findBestMatch(data, firstName, surname, team)
  }
}

module.exports = PlayerPositionLookupService
