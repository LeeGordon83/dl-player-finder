const fetchScorersForCompetition = require('./fetchScorersForCompetition')
const addPlayerPositions = require('./addPlayerPositions')
const addPlayerAvailability = require('./findPlayerAvailability')
const saveGoalscorers = require('./recordGoalscorers')
const teamAssigner = require('./teamAssigner')
async function buildGoalscorersList (competition, pages) {
  try {
    const scorersData = await fetchScorersForCompetition.fetchScorersForCompetition(competition, pages)
    const competitionName = scorersData.goalscorers.competition.name
    const scorersWithTeamsData = await teamAssigner(scorersData)
    const scorersWithTeamsAndPositions = await addPlayerPositions(scorersWithTeamsData)
    const scorersWithTeamsPositionsAndAvailability = await addPlayerAvailability(scorersWithTeamsAndPositions)

    try {
      await saveGoalscorers(scorersWithTeamsPositionsAndAvailability, competition)
    } catch (error) {
      console.error('Error occurred while managing goalscorers:', error)
    }

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

// Export the function
module.exports = {
  buildGoalscorersList
}
