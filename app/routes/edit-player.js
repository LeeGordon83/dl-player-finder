const retrieveGoalscorerById = require('../retrieveGoalscorers').retrieveGoalscorerById

module.exports = [{
  method: 'GET',
  path: '/edit/{id}',
  config: {
  },
  handler: async (request, h) => {
    const playerId = request.params.id
    const competition = Number(request.params.competition)
    const player = await retrieveGoalscorerById(playerId, competition)// Replace with your actual model and logic
    return h.view('edit', { player })
  }
}]
