// models/goalscorerModel.js
const mongoose = require('mongoose')

const goalscorerSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  'first-name': { type: String, required: true },
  'last-name': { type: String, required: true },
  team: { type: String, required: true },
  goals: { type: Number, required: true },
  teamFromPlayersList: { type: String, default: undefined },
  position: { type: String, required: true },
  positionConfidence: { type: String, default: undefined },
  manager: { type: String, default: undefined }
})

// Create separate models for each league
const ChampionshipGoalscorer = mongoose.model('ChampionshipGoalscorer', goalscorerSchema)
const LeagueOneGoalscorer = mongoose.model('LeagueOneGoalscorer', goalscorerSchema)
const LeagueTwoGoalscorer = mongoose.model('LeagueTwoGoalscorer', goalscorerSchema)

// Export all the models
module.exports = {
  ChampionshipGoalscorer,
  LeagueOneGoalscorer,
  LeagueTwoGoalscorer
}
