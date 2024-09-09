// services/goalscorerService.js
const Goalscorers = require('../models/goalscorerModel')

class GoalscorerService {
  async addGoalscorers (goalscorers) {
    try {
      await Goalscorers.insertMany(goalscorers)
      console.log('Goalscorers added successfully!')
    } catch (error) {
      console.error('Error inserting goalscorers:', error)
      throw error
    }
  }

  async getGoalscorers () {
    try {
      const goalscorers = await Goalscorers.find()
      return goalscorers
    } catch (error) {
      console.error('Error retrieving goalscorers:', error)
      throw error
    }
  }
}

module.exports = new GoalscorerService()
