// services/goalscorers/goalscorers-list-service.js
const fetchScorersForCompetition = require('./fetch-competition-goalscorers-service')
const AddPlayerPositionsService = require('../players/add-player-positions-service')
const CheckPlayerAvailabilityService = require('../players/check-player-availability-service')
const RecordGoalscorersService = require('./record-goalscorers-service')
const TeamAssignerService = require('../teams/team-assigner-service')

class GoalscorersListService {
  constructor () {
    this.addPlayerPositionsService = new AddPlayerPositionsService()
    this.checkPlayerAvailabilityService = new CheckPlayerAvailabilityService()
    this.teamAssignerService = new TeamAssignerService()
    this.recordGoalscorersService = new RecordGoalscorersService()
  }

  async buildGoalscorersList (competition, pages) {
    try {
      const scorersData = await fetchScorersForCompetition.fetchScorersForCompetition(competition, pages)
      const competitionName = scorersData.goalscorers.competition.name
      const scorersWithTeams = await this.teamAssignerService.assignTeams(scorersData)
      const scorersWithTeamsAndPositions = await this.addPlayerPositionsService.addPlayerPositions(scorersWithTeams)
      const scorersWithTeamsPositionsAndAvailability = await this.checkPlayerAvailabilityService.checkAvailability(scorersWithTeamsAndPositions)

      try {
        await this.recordGoalscorersService.recordGoalscorers(scorersWithTeamsPositionsAndAvailability, competition)
      } catch (error) {
        console.error('Error occurred while managing goalscorers:', error)
      }

      return {
        competition: competitionName,
        scorers: scorersWithTeamsPositionsAndAvailability
      }
    } catch (error) {
      console.error('Error occurred while fetching goalscorers:', error)
      return {
        competition: null,
        scorers: []
      }
    }
  }
}

module.exports = GoalscorersListService
