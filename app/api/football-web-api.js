const config = require('../config')
const axios = require('axios')

class FootballApi {
  constructor (option) {
    this.baseOptions = {
      method: 'GET',
      url: config.apiEndpoints[option],
      headers: {
        'x-rapidapi-key': config.apiKey,
        'x-rapidapi-host': config.apiHost
      }
    }
  }

  async fetchGoalscorers (comp, page) {
    const options = {
      ...this.baseOptions,
      params: {
        comp,
        page
      }
    }

    try {
      const response = await axios.request(options)
      return response.data
    } catch (error) {
      console.error('Error fetching goalscorers:', error)
      throw error
    }
  }

  async fetchLatestMatch (match) {
    const options = {
      ...this.baseOptions,
      params: {
        match
      }
    }

    try {
      const response = await axios.request(options)
      return response.data
    } catch (error) {
      console.error('Error fetching latest match:', error)
      throw error
    }
  }
}

module.exports = FootballApi
