const FootballApiClient = require('../api/FootballApiClient')
const MatchRateLimiter = require('./MatchRateLimiter')

class FetchMatchService {
  constructor () {
    this.footballApiClient = new FootballApiClient('matchesUrl')
    this.rateLimiter = new MatchRateLimiter()
  }

  async fetchMatch (matchId) {
    try {
      const data = await this.rateLimiter.execute(() =>
        this.footballApiClient.fetchLatestMatch(matchId)
      )
      return data
    } catch (error) {
      console.error('Error fetching match:', error)
      throw error
    }
  }
}

module.exports = FetchMatchService
