// competition-lookup-service.test.js
const CompetitionLookup = require('../../../../app/services/competition/competition-lookup-service')

describe('CompetitionLookup', () => {
  let competitionLookup

  beforeEach(() => {
    competitionLookup = new CompetitionLookup()
  })

  describe('getCompetitionName', () => {
    test('should return correct competition name for valid ID', () => {
      expect(competitionLookup.getCompetitionName(1)).toBe('All')
      expect(competitionLookup.getCompetitionName(2)).toBe('Championship')
      expect(competitionLookup.getCompetitionName(3)).toBe('League One')
      expect(competitionLookup.getCompetitionName(4)).toBe('League Two')
    })

    test('should return "Unknown Competition" for invalid ID', () => {
      expect(competitionLookup.getCompetitionName(999)).toBe('Unknown Competition')
      expect(competitionLookup.getCompetitionName(0)).toBe('Unknown Competition')
    })
  })

  describe('getCompetitionId', () => {
    test('should return correct ID for valid competition name', () => {
      expect(competitionLookup.getCompetitionId('All')).toBe(1)
      expect(competitionLookup.getCompetitionId('Championship')).toBe(2)
      expect(competitionLookup.getCompetitionId('League One')).toBe(3)
      expect(competitionLookup.getCompetitionId('League Two')).toBe(4)
    })

    test('should return null for invalid competition name', () => {
      expect(competitionLookup.getCompetitionId('Invalid League')).toBeNull()
      expect(competitionLookup.getCompetitionId('')).toBeNull()
    })
  })
})
