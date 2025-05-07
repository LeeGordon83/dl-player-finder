// routes/goalscorers/fetch-goalscorers.js
const FetchGoalscorersService = require('../../services/goalscorers/fetch-goalscorers-service')
const joi = require('joi')

const fetchGoalscorersService = new FetchGoalscorersService()

module.exports = [{
  method: 'GET',
  path: '/fetch-goalscorers',
  options: {
    auth: {
      strategy: 'jwt',
      mode: 'try'
    },
    validate: {
      query: joi.object({
        league: joi.number().required(),
        position: joi.string().optional().valid('DEF', 'MID', 'FWD', ''),
        availableOnly: joi.string().optional()
      })
    },
    handler: async (request, h) => {
      try {
        const competition = Number(request.query.league)
        const position = request.query.position
        const availableOnly = request.query.availableOnly !== undefined

        const data = await fetchGoalscorersService.fetchGoalscorersList(competition, position, availableOnly)

        return h.view('goalscorers', {
          pageTitle: 'Goalscorers',
          competition: data.competition,
          competitionId: competition,
          goalscorers: data.scorers,
          selectedPosition: position,
          availableOnly,
          // Add these lines to pass authentication data to the view
          user: request.auth.credentials,
          auth: {
            isAuthenticated: request.auth.isAuthenticated,
            isAnonymous: !request.auth.isAuthenticated,
            isUser: request.auth.isAuthenticated,
            isAdmin: request.auth.isAuthenticated &&
                    request.auth.credentials &&
                    (request.auth.credentials.role === 'admin' ||
                     request.auth.credentials.role === 'superuser')
          }
        })
      } catch (error) {
        console.error('Error occurred while fetching goalscorers:', error)
        return h.response('An error occurred while fetching goalscorers.').code(500)
      }
    }
  }
}]
