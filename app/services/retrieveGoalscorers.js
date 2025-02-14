const goalscorer = require('../models/goalscorer') // Mongoose models for goalscorers
const CompetitionLookup = require('../helpers/competitionLookup')
require('dotenv').config()

// Mapping competition numbers to corresponding Mongoose models
const goalscorerModels = {
  2: goalscorer.ChampionshipGoalscorer,
  3: goalscorer.LeagueOneGoalscorer,
  4: goalscorer.LeagueTwoGoalscorer
}

// Define a function to retrieve Goalscorers based on competition
const retrieveGoalscorers = async (competition) => {
  try {
    let retrievedGoalscorers = []

    if (competition === 1) {
      for (const model of Object.values(goalscorerModels)) {
        const goalscorers = await model.find({}).sort({ goals: -1 }).lean()
        retrievedGoalscorers.push(...goalscorers)
      }
    } else {
      // Get the correct model based on the competition value
      const selectedModel = goalscorerModels[competition]

      if (!selectedModel) {
        throw new Error('Invalid competition value')
      }

      // Retrieve all data from the selected goalscorer collection
      retrievedGoalscorers = await selectedModel.find().sort({ goals: -1 }).lean()
    }
    // Sort the retrieved goalscorers by goals in descending order
    retrievedGoalscorers.sort((a, b) => b.goals - a.goals)
    return retrievedGoalscorers
  } catch (error) {
    console.error('Error retrieving goalscorers:', error)
    throw error
  }
}

const retrieveGoalscorerById = async (playerId, competition) => {
  try {
    // Get the correct model based on the competition value
    const competitionLookup = new CompetitionLookup()
    const competitionId = Number(competitionLookup.getCompetitionId(competition))
    const selectedModel = goalscorerModels[competitionId]

    if (!selectedModel) {
      throw new Error('Invalid competition value')
    }

    // Validate playerId
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

module.exports = {
  retrieveGoalscorers,
  retrieveGoalscorerById
}
