class LineupService {
  determineTeam (matchData, playerId) {
    const homeTeam = matchData.match['home-team']
    const awayTeam = matchData.match['away-team']

    if (this._isPlayerInLineup(homeTeam['line-up'], playerId)) {
      return homeTeam.name
    }

    if (this._isPlayerInLineup(awayTeam['line-up'], playerId)) {
      return awayTeam.name
    }

    return 'Unknown'
  }

  _isPlayerInLineup (lineup, playerId) {
    return lineup.some(teamPlayer => teamPlayer.player.id === playerId)
  }
}

module.exports = LineupService
