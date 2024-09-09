const FootballApi = require('../api/footballWebApi')
const Bottleneck = require('bottleneck')

const footballApi = new FootballApi('matchesUrl')

// Create a rate limiter that allows max 20 requests per minute
const limiter = new Bottleneck({
  maxConcurrent: 1, // Only one request at a time
  minTime: 60000 / 20 // Time between requests (60s divided by 20 requests)
})

async function fetchMatch (matchId) {
  try {
    // Use the limiter to rate-limit the API calls
    const data = await limiter.schedule(() => footballApi.fetchLatestMatch(matchId))
    return data
  } catch (error) {
    console.error('Error fetching match:', error)
    throw error
  }
}

module.exports = fetchMatch
