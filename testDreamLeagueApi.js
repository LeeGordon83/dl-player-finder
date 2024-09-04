const dreamLeagueAPI = require('./services/apis/dreamLeagueApi')

// const footballApi = new FootballApi('matchesUrl')

async function testFetchDL () {
  try {
    const data = await dreamLeagueAPI()
    // const data = await footballApi.fetchLatestMatch(491741)
    console.log('DL Data:', data)
    // console.log('First match:', data.competition.name)
    // console.log('First match:', data.goalscorers.players[0].goals[0].match.id)
    // console.log(data.match['home-team']['line-up'])
  } catch (error) {
    console.error('Error fetching goalscorers:', error)
  }
}

testFetchDL()
