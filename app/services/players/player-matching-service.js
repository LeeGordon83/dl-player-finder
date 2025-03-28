// player-matching-service.js
const PlayerConfidenceService = require('./player-confidence-service')

class PlayerMatchingService {
  constructor () {
    this.confidenceService = new PlayerConfidenceService()
  }

  findBestMatch (data, firstName, surname, team) {
    const matches = {
      high: null,
      medium: null,
      low: null
    }

    for (const row of data) {
      if (!this._isValidRow(row)) continue

      const [name, lastName, position, sheetTeam] = row
      const confidence = this.confidenceService.determineConfidence(
        name, firstName, lastName, surname, team, sheetTeam
      )

      if (this._shouldUpdateMatch(confidence, matches)) {
        matches[confidence.toLowerCase()] = {
          sheetTeam,
          position,
          confidence
        }

        if (confidence === 'High') break
      }
    }

    return matches.high || matches.medium || matches.low || null
  }

  _isValidRow (row) {
    return row.length >= 4
  }

  _shouldUpdateMatch (confidence, matches) {
    if (!confidence) return false
    const level = confidence.toLowerCase()
    return !matches[level]
  }
}

module.exports = PlayerMatchingService
