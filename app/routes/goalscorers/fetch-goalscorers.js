// routes/goalscorers/fetch-goalscorers.js
const FetchGoalscorersService = require('../../services/goalscorers/fetch-goalscorers-service')
const joi = require('joi')

const fetchGoalscorersService = new FetchGoalscorersService()

module.exports = [{
  method: 'GET',
  path: '/fetch-goalscorers',
  options: {
    auth: false,
    validate: {
      query: joi.object({
        league: joi.number().required(),
        position: joi.string().optional().valid('DEF', 'MID', 'FWD', '')
      })
    },
    handler: async (request, h) => {
      try {
        const competition = Number(request.query.league)
        const position = request.query.position

        const data = await fetchGoalscorersService.fetchGoalscorersList(competition, position)

        return h.view('goalscorers', {
          pageTitle: 'Goalscorers',
          competition: data.competition,
          competitionId: competition,
          goalscorers: data.scorers,
          selectedPosition: position
        })
      } catch (error) {
        console.error('Error occurred while fetching goalscorers:', error)
        return h.response('An error occurred while fetching goalscorers.').code(500)
      }
    }
  }
}]
