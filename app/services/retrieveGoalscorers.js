const goalscorer = require('../models/goalscorer') // Mongoose models for goalscorers
require('dotenv').config()

// Mapping competition numbers to corresponding Mongoose models
const goalscorerModels = {
  1: goalscorer.AllGoalscorers,
  2: goalscorer.ChampionshipGoalscorer,
  3: goalscorer.LeagueOneGoalscorer,
  4: goalscorer.LeagueTwoGoalscorer
}

// Define a function to retrieve Goalscorers based on competition
const retrieveGoalscorers = async (competition) => {
  try {
    // Get the correct model based on the competition value
    const selectedModel = goalscorerModels[competition]

    if (!selectedModel) {
      throw new Error('Invalid competition value')
    }

    // Retrieve all data from the selected goalscorer collection
    const retrievedGoalscorers = await selectedModel.find()

    return retrievedGoalscorers
  } catch (error) {
    console.error('Error retrieving goalscorers:', error)
    throw error
  }
}

module.exports = retrieveGoalscorers
