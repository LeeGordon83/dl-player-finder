// fetch

const FootballApi = require('../api/footballWebApi')
const footballApi = new FootballApi('goalscorersUrl')

async function fetchScorersForCompetition (competition, pages) {
  try {
    const data = await footballApi.fetchGoalscorers(competition, pages)
    return data
  } catch (error) {
    console.error('Error fetching goalscorers:', error)
  }
}

// Export the function
module.exports = {
  fetchScorersForCompetition
}
