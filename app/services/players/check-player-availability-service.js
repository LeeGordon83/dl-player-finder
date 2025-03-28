// check-player-availability-service.js
const { calculateDistance } = require('../../levenshtein.js')
const fetchDreamLeagueTeams = require('../../api/dream-league-api.js')

class CheckPlayerAvailabilityService {
  async checkAvailability (scorersWithTeamsAndPositions) {
    // 1. Call the Dream League API to fetch the data
    const dreamLeagueData = await fetchDreamLeagueTeams()

    // 2. Loop through scorersWithTeamsAndPositions
    for (const scorer of scorersWithTeamsAndPositions) {
      // 3. Combine 'last-name' and 'first-name' to match the API format
      const fullName = this._createFullName(scorer)

      // 4. Search for a matching player in the Dream League API data
      const matchingPlayer = this._findExactMatch(dreamLeagueData.data.players, fullName)

      if (matchingPlayer) {
        // 5. If a match is found, append the manager's name
        scorer.manager = matchingPlayer.manager
      } else {
        // 6. If no match is found, try fuzzy matching
        this._handleFuzzyMatch(scorer, dreamLeagueData.data.players, fullName)
      }
    }

    return scorersWithTeamsAndPositions
  }

  _createFullName (scorer) {
    return `${scorer['last-name']}, ${scorer['first-name']}`
  }

  _findExactMatch (players, fullName) {
    return players.find(player => player.name === fullName)
  }

  _handleFuzzyMatch (scorer, players, fullName) {
    // Calculate Levenshtein distances
    const distances = players.map(player => ({
      name: player.name,
      distance: calculateDistance(fullName, player.name)
    }))

    // Sort by distance
    distances.sort((a, b) => a.distance - b.distance)

    // Store closest match
    scorer.closestMatch = distances[0].name

    const closestMatchLastName = scorer.closestMatch.split(',')[0].trim()

    if (scorer['last-name'] === closestMatchLastName) {
      // Find the matching player in the API data
      const matchingPlayerByLastName = players.find(
        player => player.name === scorer.closestMatch
      )

      if (matchingPlayerByLastName) {
        scorer.manager = matchingPlayerByLastName.manager
      }
    }
  }
}

module.exports = CheckPlayerAvailabilityService
