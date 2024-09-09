const { calculateDistance } = require('../levenshtein')

const fetchDreamLeagueTeams = require('../api/dreamLeagueApi')

const findPlayerAvailibility = async (scorersWithTeamsAndPositions) => {
  // 1. Call the Dream League API to fetch the data
  const dreamLeagueData = await fetchDreamLeagueTeams()

  // 2. Loop through scorersWithTeamsAndPositions
  for (const scorer of scorersWithTeamsAndPositions) {
    // 3. Combine 'last-name' and 'first-name' to match the API format ("surname, forename")
    const fullName = `${scorer['last-name']}, ${scorer['first-name']}`

    // 4. Search for a matching player in the Dream League API data
    const matchingPlayer = dreamLeagueData.data.players.find(player => player.name === fullName)

    // 5. If a match is found, append the manager's name to the scorer object
    if (matchingPlayer) {
      scorer.manager = matchingPlayer.manager
    } else {
      // 6. If no match is found, calculate the Levenshtein distance between the scorer's name and each player's name in the Dream League API data
      const distances = dreamLeagueData.data.players.map(player => {
        return {
          name: player.name,
          distance: calculateDistance(fullName, player.name)
        }
      })

      // 7. Sort the distances in ascending order
      distances.sort((a, b) => a.distance - b.distance)

      // 8. Append the closest match to the scorer object
      scorer.closestMatch = distances[0].name

      const closestMatchLastName = scorer.closestMatch.split(',')[0].trim()

      if (scorer['last-name'] === closestMatchLastName) {
        // Find the matching player in the API data
        const matchingPlayerByLastName = dreamLeagueData.data.players.find(player => player.name === scorer.closestMatch)

        if (matchingPlayerByLastName) {
          scorer.manager = matchingPlayerByLastName.manager
        }
      }
    }
  }

  return scorersWithTeamsAndPositions
}

module.exports = findPlayerAvailibility
