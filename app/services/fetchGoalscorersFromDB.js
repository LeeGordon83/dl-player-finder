const CompetitionLookup = require('../helpers/competitionLookup')
const retrieveGoalscorers = require('./retrieveGoalscorers')

async function fetchGoalscorersList (competition) {
  try {
    const competitionLookup = new CompetitionLookup()
    const competitionName = competitionLookup.getCompetitionName(competition)
    let scorers = []
    try {
      scorers = await retrieveGoalscorers(competition)
    } catch (error) {
      console.error('Error occurred while managing goalscorers:', error)
    }

    return {
      competition: competitionName,
      scorers
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
  fetchGoalscorersList
}
