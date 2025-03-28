// player-confidence-service.js
class PlayerConfidenceService {
  determineConfidence (name, firstName, lastName, surname, team, sheetTeam) {
    const trimmedValues = this._trimValues(name, firstName, lastName, surname, team, sheetTeam)
    return this._calculateConfidence(...trimmedValues)
  }

  _trimValues (name, firstName, lastName, surname, team, sheetTeam) {
    return [
      name?.trim() || '',
      firstName?.trim() || '',
      lastName?.trim() || '',
      surname?.trim() || '',
      team?.trim() || '',
      sheetTeam?.trim() || ''
    ]
  }

  _calculateConfidence (name, firstName, lastName, surname, team, sheetTeam) {
    if (name === firstName && lastName === surname && team === sheetTeam) {
      return 'High'
    }
    if ((name === firstName && lastName === surname) ||
        (lastName === surname && team === sheetTeam)) {
      return 'Medium'
    }
    if (lastName === surname) {
      return 'Low'
    }
    return null
  }
}

module.exports = PlayerConfidenceService
