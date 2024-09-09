const fetchMatch = require('./fetchMatch')

const TeamAssigner = async (scorersData) => {
  const playersWithTeams = [] // Array to store each player's details and team

  const playersToProcess = scorersData.goalscorers.players

  // Create an array of promises for fetching match data
  const fetchPromises = playersToProcess.map(player =>
    fetchMatch(player.goals[0].match.id).then(matchData => {
      // Extract the home and away team lineups
      const homeTeam = matchData.match['home-team']
      const awayTeam = matchData.match['away-team']

      // Check if the player's ID is in the home team lineup
      const isInHomeTeam = homeTeam['line-up'].some(teamPlayer => teamPlayer.player.id === player.id)

      // Check if the player's ID is in the away team lineup
      const isInAwayTeam = awayTeam['line-up'].some(teamPlayer => teamPlayer.player.id === player.id)

      // Determine the player's team name (home or away)
      let teamName
      if (isInHomeTeam) {
        teamName = homeTeam.name
      } else if (isInAwayTeam) {
        teamName = awayTeam.name
      } else {
        teamName = 'Unknown'
      }

      // Add the player details to the final object
      return {
        id: player.id,
        'first-name': player['first-name'],
        'last-name': player['last-name'],
        team: teamName,
        goals: player.goals.length // Count the number of goals
      }
    }).catch(error => {
      console.error(`Error fetching match data for player ${player.id}:`, error)
      // Return default data or handle the error as needed
      return {
        id: player.id,
        'first-name': player['first-name'],
        'last-name': player['last-name'],
        team: 'Unknown',
        goals: player.goals.length
      }
    })
  )

  // Wait for all promises to resolve
  const results = await Promise.all(fetchPromises)
  playersWithTeams.push(...results)

  return playersWithTeams
}

module.exports = TeamAssigner
