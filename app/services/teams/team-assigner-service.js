const MatchService = require('./match-service')
const LineupService = require('./lineup-service')

class TeamAssignerService {
  constructor () {
    this.matchService = new MatchService()
    this.lineupService = new LineupService()
  }

  async assignTeams (scorersData) {
    const playersWithTeams = []
    const playersToProcess = scorersData.goalscorers.players

    // Create an array of promises for fetching match data
    const assignmentPromises = playersToProcess.map(player =>
      this._assignTeamToPlayer(player)
    )

    // Wait for all promises to resolve
    const results = await Promise.all(assignmentPromises)
    playersWithTeams.push(...results)

    return playersWithTeams
  }

  async _assignTeamToPlayer (player) {
    try {
      const matchData = await this.matchService.fetchMatch(player.goals[0].match.id)
      const teamName = this.lineupService.determineTeam(matchData, player.id)

      return this._createPlayerData(player, teamName)
    } catch (error) {
      console.error(`Error processing player ${player.id}:`, error)
      return this._createPlayerData(player, 'Unknown')
    }
  }

  _createPlayerData (player, teamName) {
    return {
      id: player.id,
      'first-name': player['first-name'],
      'last-name': player['last-name'],
      team: teamName,
      goals: player.goals.length
    }
  }
}

module.exports = TeamAssignerService
