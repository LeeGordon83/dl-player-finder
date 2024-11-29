const buildGoalscorersList = require('../services/buildGoalscorersList')
const joi = require('joi')

module.exports = [{
  method: 'GET', // Change to GET method
  path: '/build-goalscorers',
  options: {
    auth: false,
    validate: {
      query: joi.object({ // Use query for GET request
        league: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        console.error('Validation error:', error)
        return h.response('Invalid request query parameter').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const competition = Number(request.query.league) // Use query instead of payload
        const data = await buildGoalscorersList.buildGoalscorersList(competition, 1)
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
