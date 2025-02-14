const retrieveGoalscorerById = require('../../app/services/retrieveGoalscorers').retrieveGoalscorerById

module.exports = [{
  method: 'GET',
  path: '/edit-player/{id}/{competition}',
  config: {
  },
  handler: async (request, h) => {
    const playerId = request.params.id
    const competition = request.params.competition
    const player = await retrieveGoalscorerById(playerId, competition)// Replace with your actual model and logic
    return h.view('edit-player', { player })
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
    console.log(competition)
    const payload = request.payload

    try {
      // await updateGoalscorerById(playerId, competition, payload) // Replace with your actual model and logic
      return h.redirect(`/edit-player/${playerId}/${competition}`)
    } catch (error) {
      console.error('Error updating player:', error)
      return h.view('edit-player', { player: payload, error: 'Failed to update player' })
    }
  }
}]
