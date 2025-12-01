const { calculateDistance } = require('../../levenshtein.js')
const fetchDreamLeagueTeams = require('../../api/dream-league-api.js')

class CheckPlayerAvailabilityService {
  async checkAvailability (scorersWithTeamsAndPositions) {
    // 1. Call the Dream League API to fetch the data
    const dreamLeagueData = await fetchDreamLeagueTeams()

    // 2. Loop through scorersWithTeamsAndPositions
    for (const scorer of scorersWithTeamsAndPositions) {
      const firstName = (scorer['first-name'] || '').trim()
      const lastName = (scorer['last-name'] || '').trim()
      
      if (!firstName || !lastName) continue

      // Try multiple name formats
      const dreamLeagueFormat = `${lastName}, ${firstName}` // "Last, First"
      const normalFormat = `${firstName} ${lastName}` // "First Last"
      
      // 3. Search for a matching player in the Dream League API data
      let matchingPlayer = this._findExactMatch(dreamLeagueData.data.players, dreamLeagueFormat)
      
      if (!matchingPlayer) {
        matchingPlayer = this._findExactMatch(dreamLeagueData.data.players, normalFormat)
      }

      if (matchingPlayer) {
        // 4. If a match is found, append the manager's name
        scorer.manager = matchingPlayer.manager
      } else {
        // 5. If no match is found, try fuzzy matching
        this._handleFuzzyMatch(scorer, dreamLeagueData.data.players, firstName, lastName)
      }
    }

    return scorersWithTeamsAndPositions
  }

  _findExactMatch (players, fullName) {
    return players.find(player => 
      player.name.toLowerCase() === fullName.toLowerCase()
    )
  }

  _handleFuzzyMatch (scorer, players, firstName, lastName) {
    // Try matching against both name formats
    const dreamLeagueFormat = `${lastName}, ${firstName}`
    const normalFormat = `${firstName} ${lastName}`
    
    // Calculate Levenshtein distances for both formats
    const distances = players.map(player => {
      const dist1 = calculateDistance(dreamLeagueFormat.toLowerCase(), player.name.toLowerCase())
      const dist2 = calculateDistance(normalFormat.toLowerCase(), player.name.toLowerCase())
      return {
        name: player.name,
        distance: Math.min(dist1, dist2), // Use the better match
        manager: player.manager
      }
    })

    // Sort by distance
    distances.sort((a, b) => a.distance - b.distance)

    // Get the closest match
    const closestMatch = distances[0]
    scorer.closestMatch = closestMatch.name

    // If the distance is reasonable (less than 3 characters different), assign the manager
    if (closestMatch.distance <= 3) {
      scorer.manager = closestMatch.manager
    }
  }
}

module.exports = CheckPlayerAvailabilityService
