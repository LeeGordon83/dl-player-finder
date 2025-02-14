const fetchGoalscorersList = require('../services/fetchGoalscorersFromDB')
const joi = require('joi')

module.exports = [
  {
    method: 'GET', // Handle GET requests
    path: '/fetch-goalscorers',
    options: {
      auth: false,
      validate: {
        query: joi.object({
          league: joi.number().required() // Validate the query parameter 'league'
        }),
        failAction: async (request, h, error) => {
          console.error('Validation error:', error)
          return h.response('Invalid request query parameter').code(400).takeover()
        }
      },
      handler: async (request, h) => {
        try {
          const competition = Number(request.query.league) // Get league from query parameter
          const data = await fetchGoalscorersList.fetchGoalscorersList(competition, 1)
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
  }
]
