const { scrapeGoalscorers } = require('../../scraper/scrape.js')

async function fetchScorersForCompetition (competition, pages) {
  try {
    const data = await scrapeGoalscorers(competition)
    return data
  } catch (error) {
    console.error('Error fetching goalscorers:', error)
  }
}

// Export the function
module.exports = {
  fetchScorersForCompetition
}
