const xlsx = require('xlsx')
const PlayerPositionLookupService = require('./player-position-lookup-service')

class AddPlayerPositionsService {
  constructor () {
    this.playerPositionLookupService = new PlayerPositionLookupService()
    this.playersList = 'app/data/PlayersList_24_25.xlsx'
  }

  async addPlayerPositions (playersWithTeams) {
    const workbook = xlsx.readFile(this.playersList)

    for (const player of playersWithTeams) {
      const result = this.playerPositionLookupService.findPlayerPosition(
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
