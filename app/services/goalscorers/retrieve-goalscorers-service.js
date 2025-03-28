// services/goalscorers/retrieve-goalscorers-service.js
const goalscorer = require('../../models/goalscorer')
const CompetitionLookup = require('../competition/competition-lookup-service')
require('dotenv').config()

class RetrieveGoalscorersService {
  constructor () {
    this.goalscorerModels = {
      2: goalscorer.ChampionshipGoalscorer,
      3: goalscorer.LeagueOneGoalscorer,
      4: goalscorer.LeagueTwoGoalscorer
    }
    this.competitionLookup = new CompetitionLookup()
  }

  async retrieveGoalscorers (competition) {
    try {
      let retrievedGoalscorers = []

      if (competition === 1) {
        for (const model of Object.values(this.goalscorerModels)) {
          const goalscorers = await model.find({}).sort({ goals: -1 }).lean()
          retrievedGoalscorers.push(...goalscorers)
        }
      } else {
        const selectedModel = this.goalscorerModels[competition]

        if (!selectedModel) {
          throw new Error('Invalid competition value')
        }

        retrievedGoalscorers = await selectedModel.find().sort({ goals: -1 }).lean()
      }

      retrievedGoalscorers.sort((a, b) => b.goals - a.goals)
      return retrievedGoalscorers
    } catch (error) {
      console.error('Error retrieving goalscorers:', error)
      throw error
    }
  }

  async retrieveGoalscorerById (playerId, competition) {
    try {
      const competitionId = Number(this.competitionLookup.getCompetitionId(competition))
      const selectedModel = this.goalscorerModels[competitionId]

      if (!selectedModel) {
        throw new Error('Invalid competition value')
      }

      if (isNaN(playerId)) {
        throw new Error(`Invalid player ID format: ${playerId}`)
      }

      const numericPlayerId = Number(playerId)
      const player = await selectedModel.findOne({ id: numericPlayerId }).lean()

      if (!player) {
        throw new Error('Player not found')
      }

      return player
    } catch (error) {
      console.error('Error retrieving player:', error)
      throw error
    }
  }
}

// Export the class itself
module.exports = RetrieveGoalscorersService
