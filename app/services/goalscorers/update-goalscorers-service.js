// services/goalscorers/update-goalscorers-service.js
const goalscorer = require('../../models/goalscorer')
const CompetitionLookup = require('../competition/competition-lookup-service')

class UpdateGoalscorersService {
  constructor () {
    this.goalscorerModels = {
      2: goalscorer.ChampionshipGoalscorer,
      3: goalscorer.LeagueOneGoalscorer,
      4: goalscorer.LeagueTwoGoalscorer
    }
    this.competitionLookup = new CompetitionLookup()
  }

  async updateGoalscorerById (playerId, competition, updateData) {
    try {
      const selectedModel = this.goalscorerModels[competition]

      if (!selectedModel) {
        throw new Error('Invalid competition value')
      }

      if (isNaN(playerId)) {
        throw new Error(`Invalid player ID format: ${playerId}`)
      }

      const numericPlayerId = Number(playerId)

      const updatedPlayer = await selectedModel.findOneAndUpdate(
        { id: numericPlayerId },
        {
          $set: {
            competition,
            'first-name': updateData['first-name'],
            'last-name': updateData['last-name'],
            team: updateData.team,
            position: updateData.position,
            positionConfidence: updateData.positionConfidence,
            goals: Number(updateData.goals)
          }
        },
        { new: true, runValidators: true }
      ).lean()

      if (!updatedPlayer) {
        throw new Error('Player not found')
      }

      return updatedPlayer
    } catch (error) {
      console.error('Error updating player:', error)
      throw error
    }
  }
}

module.exports = UpdateGoalscorersService
