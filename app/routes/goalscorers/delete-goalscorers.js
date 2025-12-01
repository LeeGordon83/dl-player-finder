const {
  ChampionshipGoalscorer,
  LeagueOneGoalscorer,
  LeagueTwoGoalscorer
} = require('../../models/goalscorer')
const joi = require('joi')

module.exports = [{
  method: 'POST',
  path: '/delete-goalscorers',
  options: {
    auth: {
      strategy: 'jwt',
      mode: 'required'
    },
    validate: {
      payload: joi.object({}) // No payload required
    },
    handler: async (request, h) => {
      const user = request.auth.credentials
      if (!user || user.role !== 'superuser') {
        return h.response({ success: false, message: 'Admin access required.' }).code(403)
      }

      try {
        const championshipResult = await ChampionshipGoalscorer.deleteMany({})
        const leagueOneResult = await LeagueOneGoalscorer.deleteMany({})
        const leagueTwoResult = await LeagueTwoGoalscorer.deleteMany({})

        return h.view('delete-confirmation', {
          deleted: {
            championship: championshipResult.deletedCount,
            leagueOne: leagueOneResult.deletedCount,
            leagueTwo: leagueTwoResult.deletedCount
          }
        })
      } catch (error) {
        console.error('Error occurred while deleting goalscorers:', error)
        return h.response('An error occurred while deleting goalscorers.').code(500)
      }
    }
  }
}]
