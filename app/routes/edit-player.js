// routes/edit-player.js
const RetrieveGoalscorersService = require('../services/goalscorers/retrieve-goalscorers-service')
const UpdateGoalscorersService = require('../services/goalscorers/update-goalscorers-service')
const CompetitionLookup = require('../services/competition/competition-lookup-service')

const retrieveGoalscorersService = new RetrieveGoalscorersService()
const updateGoalscorersService = new UpdateGoalscorersService()

module.exports = [{
  method: 'GET',
  path: '/edit-player/{id}/{competition}',
  config: {
  },
  handler: async (request, h) => {
    const playerId = request.params.id
    const competitionId = request.params.competition
    const competitionLookup = new CompetitionLookup()
    const competitionName = competitionLookup.getCompetitionName(competitionId)
    const player = await retrieveGoalscorersService.retrieveGoalscorerById(playerId, competitionName)
    return h.view('edit-player', { player, competitionId })
  }
},
{
  method: 'POST',
  path: '/edit-player/{id}/{competition}',
  config: {
  },
  handler: async (request, h) => {
    const playerId = request.params.id
    const competition = request.params.competition
    const payload = request.payload

    try {
      await updateGoalscorersService.updateGoalscorerById(playerId, competition, payload)
      return h.redirect(`/fetch-goalscorers?league=${competition}`)
    } catch (error) {
      console.error('Error updating player:', error)
      return h.view('edit-player', {
        player: { ...payload, id: playerId },
        competitionId: competition,
        error: 'Failed to update player'
      })
    }
  }
}]
