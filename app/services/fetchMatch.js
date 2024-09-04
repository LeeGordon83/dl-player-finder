// fetchMatch.js

const FootballApi = require('../api/footballWebApi')
const footballApi = new FootballApi('matchesUrl')

async function fetchMatch (matchId) {
  try {
    const data = await footballApi.fetchLatestMatch(matchId)
    return data
  } catch (error) {
    console.error('Error fetching match:', error)
    throw error // Rethrow the error if needed for further handling
  }
}

// Export the function
module.exports = fetchMatch
