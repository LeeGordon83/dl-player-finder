const axios = require('axios')
const https = require('https')
const config = require('../config')

// URL of the API endpoint
const apiUrl = config.dreamLeagueAPI

// Function to fetch data from the API
const fetchDreamLeagueTeams = async () => {
  try {
    const response = await axios.get(apiUrl, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    return response.data
  } catch (error) {
    console.error('Error fetching dream league team data:', error.message)
    throw error
  }
}
module.exports = fetchDreamLeagueTeams
