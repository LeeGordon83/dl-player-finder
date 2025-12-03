const ExcelJS = require('exceljs')
const PlayerPositionLookupService = require('./player-position-lookup-service')

class AddPlayerPositionsService {
  constructor () {
    this.playerPositionLookupService = new PlayerPositionLookupService()
    this.playersList = 'app/sheets/PlayersList_25_26.xlsx'
  }

  async addPlayerPositions (playersWithTeams) {
    // Load workbook with exceljs
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(this.playersList)

    for (const player of playersWithTeams) {
      const result = await this.playerPositionLookupService.findPlayerPosition(
        player['first-name'],
        player['last-name'],
        player.team,
        workbook
      )

      if (result) {
        player.teamFromPlayersList = result.sheetTeam
        player.position = result.position
        player.positionConfidence = result.confidence
      } else {
        player.teamFromPlayersList = null
        player.position = 'Unknown'
      }
    }

    return playersWithTeams
  }
}

module.exports = AddPlayerPositionsService
