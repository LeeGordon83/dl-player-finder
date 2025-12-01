const { getTopScorers } = require('./fbrefScraper')

async function scrapeGoalscorers (competition) {
  const topScorers = await getTopScorers(competition)
  return topScorers
}

// Export the function
module.exports = {
  scrapeGoalscorers
}
