const GoalscorersListService = require('../../services/goalscorers/goalscorers-list-service')
const joi = require('joi')
const checkRoles = require('../../plugins/auth/checkRoles') // Import the checkRoles function

const goalscorersListService = new GoalscorersListService()

module.exports = [{
  method: 'GET',
  path: '/build-goalscorers',
  options: {
    auth: {
      strategy: 'jwt',
      mode: 'required'
    },
    pre: [{ method: checkRoles(['superuser']) }], // Use the centralized function
    validate: {
      query: joi.object({
        league: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        console.error('Validation error:', error)
        return h.response('Invalid request query parameter').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const competition = Number(request.query.league)
        const data = await goalscorersListService.buildGoalscorersList(competition, 1)
        return h.view('goalscorers', {
          pageTitle: 'Goalscorers',
          competition: data.competition,
          competitionId: competition,
          goalscorers: data.scorers,
          user: request.auth.credentials,
          auth: {
            isAuthenticated: true,
            isAnonymous: false,
            isUser: true,
            isAdmin: true
          }
        })
      } catch (error) {
        console.error('Error occurred while fetching goalscorers:', error)
        return h.response('An error occurred while fetching goalscorers.').code(500)
      }
    }
  }
}]
