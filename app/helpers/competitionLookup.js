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

  // Method to get competition ID based on name
  getCompetitionId (competitionName) {
    for (const [id, name] of Object.entries(this.competitions)) {
      if (name === competitionName) {
        return parseInt(id)
      }
    }
    return null // Return null if name is not found
  }
}

module.exports = CompetitionLookup
