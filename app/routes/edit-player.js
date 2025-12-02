// routes/edit-player.js
const RetrieveGoalscorersService = require('../services/goalscorers/retrieve-goalscorers-service')
const UpdateGoalscorersService = require('../services/goalscorers/update-goalscorers-service')
const CompetitionLookup = require('../services/competition/competition-lookup-service')
const checkRoles = require('../plugins/auth/checkRoles')
const fetchDreamLeagueTeams = require('../api/dream-league-api')

const retrieveGoalscorersService = new RetrieveGoalscorersService()
const updateGoalscorersService = new UpdateGoalscorersService()

module.exports = [{
  method: 'GET',
  path: '/edit-player/{id}/{competition}',
  options: {
    auth: {
      strategy: 'jwt',
      mode: 'required'
    },
    pre: [{ method: checkRoles(['admin', 'superuser']) }]
  },
  handler: async (request, h) => {
    try {
      const playerId = request.params.id
      const competitionId = request.params.competition
      const competitionLookup = new CompetitionLookup()
      const competitionName = competitionLookup.getCompetitionName(competitionId)
      const player = await retrieveGoalscorersService.retrieveGoalscorerById(playerId, competitionName)

      // Fetch Dream League teams to get list of managers
      const dreamLeagueData = await fetchDreamLeagueTeams()
      const managers = dreamLeagueData.data.players
        .map(p => p.manager)
        .filter((value, index, self) => self.indexOf(value) === index) 
        .sort()

      return h.view('edit-player', {
        player,
        competitionId,
        competitionName,
        managers
      })
    } catch (error) {
      console.error('Error loading edit player page:', error)
      return h.view('edit-player', {
        error: 'Failed to load player',
        competitionId: request.params.competition
      }).code(500)
    }
  }
},
{
  method: 'POST',
  path: '/edit-player/{id}/{competition}',
  options: {
    auth: {
      strategy: 'jwt',
      mode: 'required'
    },
    pre: [{ method: checkRoles(['admin', 'superuser']) }]
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
