// services/goalscorers/goalscorers-list-service.js
const fetchScorersForCompetition = require('./fetch-competition-goalscorers-service')
const AddPlayerPositionsService = require('../players/add-player-positions-service')
const CheckPlayerAvailabilityService = require('../players/check-player-availability-service')
const RecordGoalscorersService = require('./record-goalscorers-service')
const CompetitionLookupService = require('../competition/competition-lookup-service')

class GoalscorersListService {
  constructor () {
    this.addPlayerPositionsService = new AddPlayerPositionsService()
    this.checkPlayerAvailabilityService = new CheckPlayerAvailabilityService()
    this.recordGoalscorersService = new RecordGoalscorersService()
    this.competitionLookupService = new CompetitionLookupService()
  }

  async buildGoalscorersList (competition) {
    try {
      const scorersData = await fetchScorersForCompetition.fetchScorersForCompetition(competition)
      const competitionName = this.competitionLookupService.getCompetitionName(competition)
      const scorersWithPositions = await this.addPlayerPositionsService.addPlayerPositions(scorersData)
      const scorersWithPositionsAndAvailability = await this.checkPlayerAvailabilityService.checkAvailability(scorersWithPositions)

      // Filter out invalid data
      const validScorers = scorersWithPositionsAndAvailability.filter(player => {
        // Remove players with invalid/placeholder names
        const firstName = (player['first-name'] || '').trim()
        const lastName = (player['last-name'] || '').trim()
        const playerName = (player.player || '').trim()

        // Filter out placeholder/header rows
        if (!firstName || !lastName) return false
        if (playerName.toLowerCase() === 'player') return false
        if (lastName.toLowerCase() === 'squad') return false

        // Filter out players with no goals or invalid goal values
        const goals = Number(player.goals)
        if (isNaN(goals) || goals <= 0) return false

        return true
      })

      // Sort by goals (descending) then by last name (ascending)
      const sortedScorers = validScorers.sort((a, b) => {
        // First sort by goals (descending)
        const goalsDiff = Number(b.goals) - Number(a.goals)
        if (goalsDiff !== 0) return goalsDiff

        // If goals are equal, sort by last name (ascending)
        const lastNameA = (a['last-name'] || '').toLowerCase()
        const lastNameB = (b['last-name'] || '').toLowerCase()
        return lastNameA.localeCompare(lastNameB)
      })

      try {
        await this.recordGoalscorersService.recordGoalscorers(sortedScorers, competition)
      } catch (error) {
        console.error('Error occurred while managing goalscorers:', error)
      }

      return {
        competition: competitionName,
        scorers: sortedScorers
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
