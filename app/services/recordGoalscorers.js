// index.js
const DatabaseHandler = require('../models/databaseHandler')
const goalscorer = require('../models/goalscorerModel') // Mongoose models for goalscorers
require('dotenv').config()

// Create a new instance of DatabaseHandler with the MongoDB URI
const dbHandler = new DatabaseHandler(process.env.MONGO_URL)

// Mapping competition numbers to corresponding Mongoose models
const goalscorerModels = {
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

    // Connect to MongoDB
    await dbHandler.connect()

    // Insert data into the selected goalscorer collection
    await dbHandler.insertOrUpdateData(selectedModel, goalscorers)

    // Retrieve all data from the selected goalscorer collection
    // const retrievedGoalscorers = await dbHandler.getData(selectedModel)
    // console.log('Retrieved Goalscorers:', retrievedGoalscorers)

    // // Optionally, return the retrieved goalscorers
    // return retrievedGoalscorers
  } catch (error) {
    console.error('Error managing goalscorers:', error)
  } finally {
    // Disconnect from MongoDB
    await dbHandler.disconnect()
  }
}

module.exports = recordGoalscorers
