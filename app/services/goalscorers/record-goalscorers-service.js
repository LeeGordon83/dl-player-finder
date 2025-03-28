// record-goalscorers-service.js
const goalscorer = require('../../models/goalscorer')
const CompetitionLookup = require('../competition/competition-lookup-service')

class RecordGoalscorersService {
  constructor () {
    this.goalscorerModels = {
      2: goalscorer.ChampionshipGoalscorer,
      3: goalscorer.LeagueOneGoalscorer,
      4: goalscorer.LeagueTwoGoalscorer
    }
    this.competitionLookup = new CompetitionLookup()
  }

  async recordGoalscorers (goalscorers, competition) {
    try {
      const selectedModel = this.goalscorerModels[competition]
      const competitionName = this.competitionLookup.getCompetitionName(competition)

      if (!selectedModel) {
        throw new Error('Invalid competition value')
      }

      await this._insertGoalscorers(goalscorers, selectedModel, competitionName)
      console.log('Goalscorers added successfully!')
    } catch (error) {
      console.error('Error inserting goalscorers:', error)
      throw error
    }
  }

  async _insertGoalscorers (goalscorers, selectedModel, competitionName) {
    for (const goalscorer of goalscorers) {
      const uniqueIdentifier = this._createUniqueIdentifier(goalscorer)
      goalscorer.competition = competitionName

      await selectedModel.updateOne(
        { uniqueIdentifier },
        { $set: goalscorer },
        { upsert: true }
      )
    }
  }

  _createUniqueIdentifier (goalscorer) {
    return `${goalscorer['first-name']}-${goalscorer['last-name']}-${goalscorer.team}`
  }
}

module.exports = RecordGoalscorersService
