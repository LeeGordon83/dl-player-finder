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
    }
  }

  return scorersWithTeamsAndPositions
}

module.exports = findPlayerAvailibility
