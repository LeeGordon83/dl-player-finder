const FootballApi = require('./services/apis/footballWebApi')

const footballApi = new FootballApi('goalscorersUrl')
// const footballApi = new FootballApi('matchesUrl')

async function testFetchGoalscorers () {
  try {
    const data = await footballApi.fetchGoalscorers(2, 1)
    // const data = await footballApi.fetchLatestMatch(491741)
    console.log('First goalscorer:', data.goalscorers.players[0])
    // console.log('First match:', data.competition.name)
    // console.log('First match:', data.goalscorers.players[0].goals[0].match.id)
    // console.log(data.match['home-team']['line-up'])
  } catch (error) {
    console.error('Error fetching goalscorers:', error)
  }
}

testFetchGoalscorers()
