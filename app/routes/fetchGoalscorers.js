const buildGoalscorersList = require('../services/buildGoalscorersList')
const joi = require('joi')

module.exports = [{
  method: 'POST',
  path: '/fetch-goalscorers',
  options: {
    auth: false,
    validate: {
      payload: joi.object({
        league: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        console.error('Validation error:', error)
        return h.response('Invalid request payload').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const competition = Number(request.payload.league)
        const data = await buildGoalscorersList.buildGoalscorersList(competition, 1)
console.log(data)
        return h.view('goalscorers', {
          pageTitle: 'Goalscorers',
          competition: data.competition,
          goalscorers: data.scorers
        })
      } catch (error) {
        console.error('Error occurred while fetching goalscorers:', error)
        return h.response('An error occurred while fetching goalscorers.').code(500)
      }
    }
  }
}]
