const fetchMatch = require('../matches/fetch-match-service')

class MatchService {
  async fetchMatch (matchId) {
    try {
      return await fetchMatch(matchId)
    } catch (error) {
      console.error(`Error fetching match ${matchId}:`, error)
      throw error
    }
  }
}

module.exports = MatchService
