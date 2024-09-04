const fetchScorersForCompetition = require('./fetchScorersForCompetition')
const fetchMatch = require('./fetchMatch')
const addPlayerPositions = require('./addPlayerPositions')
const addPlayerAvailability = require('./findPlayerAvailability')
async function buildGoalscorersList (competition, pages) {
  try {
    const scorersData = await fetchScorersForCompetition.fetchScorersForCompetition(competition, pages)
    const competitionName = scorersData.goalscorers.competition.name
    const scorersWithTeamsData = await assignTeamsToGoalscorers(scorersData)
    const scorersWithTeamsAndPositions = await addPlayerPositions(scorersWithTeamsData)
    const scorersWithTeamsPositionsAndAvailability = await addPlayerAvailability(scorersWithTeamsAndPositions)

    return {
      competition: competitionName,
      scorers: scorersWithTeamsPositionsAndAvailability
    }
  } catch (error) {
    console.error('Error occurred while fetching goalscorers:', error)

    return {
      competition: null,
      scorers: []
    }
  }
}

async function assignTeamsToGoalscorers (scorersData) {
  const playersWithTeams = [] // Array to store each player's details and team

  const playersToProcess = scorersData.goalscorers.players.slice(0, 5) // Process only the first 5 players for testing

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

// Export the function
module.exports = {
  buildGoalscorersList
}
