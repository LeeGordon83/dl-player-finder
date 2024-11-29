class CompetitionLookup {
  constructor () {
    // Mapping competition IDs to their respective names
    this.competitions = {
      1: 'All',
      2: 'Championship',
      3: 'League One',
      4: 'League Two'
    }
  }

  // Method to get competition name based on ID
  getCompetitionName (competitionId) {
    return this.competitions[competitionId] || 'Unknown Competition' // Return 'Unknown Competition' if ID is not found
  }
}

module.exports = CompetitionLookup
