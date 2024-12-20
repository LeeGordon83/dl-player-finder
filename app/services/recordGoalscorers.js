const goalscorer = require('../models/goalscorer') // Mongoose models for goalscorers
require('dotenv').config()

// Mapping competition numbers to corresponding Mongoose models
const goalscorerModels = {
  1: goalscorer.AllGoalscorers,
  2: goalscorer.ChampionshipGoalscorer,
  3: goalscorer.LeagueOneGoalscorer,
  4: goalscorer.LeagueTwoGoalscorer
}

// Define a function to insert and retrieve Goalscorers based on competition
const recordGoalscorers = async (goalscorers, competition) => {
  try {
    // Get the correct model based on the competition value
    const selectedModel = goalscorerModels[competition]

    if (!selectedModel) {
      throw new Error('Invalid competition value')
    }

    await selectedModel.deleteData()

    // Insert data into the selected goalscorer collection
    for (const goalscorer of goalscorers) {
      // Use a unique identifier to check for duplicates
      const uniqueIdentifier = `${goalscorer['first-name']}-${goalscorer['last-name']}-${goalscorer.team}`
      await selectedModel.updateOne(
        { uniqueIdentifier },
        { $set: goalscorer },
        { upsert: true }
      )
    }
    console.log('Goalscorers added successfully!')
  } catch (error) {
    console.error('Error inserting goalscorers:', error)
    throw error
  }
}

module.exports = recordGoalscorers
