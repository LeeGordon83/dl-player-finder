// services/goalscorers/fetch-goalscorers-service.js
const CompetitionLookup = require('../competition/competition-lookup-service')
const RetrieveGoalscorersService = require('./retrieve-goalscorers-service')

class FetchGoalscorersService {
  constructor () {
    this.competitionLookup = new CompetitionLookup()
    this.retrieveGoalscorersService = new RetrieveGoalscorersService()
  }

  async fetchGoalscorersList (competition, position, availableOnly) {
    try {
      const competitionId = Number(competition)
      const competitionName = this.competitionLookup.getCompetitionName(competitionId)
      let scorers = await this.retrieveGoalscorersService.retrieveGoalscorers(competitionId)

      // Filter by position if specified
      if (position) {
        scorers = scorers.filter(player => player.position === position)
      }

      if (availableOnly) {
        scorers = scorers.filter(scorer => !scorer.manager)
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
}

module.exports = FetchGoalscorersService
