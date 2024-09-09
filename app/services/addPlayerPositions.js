const xlsx = require('xlsx')
const { findPlayerPosition } = require('./findPlayerPosition')

// Path to the file
const playersList = 'app/data/PlayersList_24_25.xlsx'

// Function to update player data with positions
const addPlayerPositions = async (playersWithTeams) => {
  // Load the spreadsheet with the "ALL" sheet
  const workbook = xlsx.readFile(playersList)

  // Process each player and add position data
  for (const player of playersWithTeams) {
    const result = findPlayerPosition(player['first-name'], player['last-name'], player.team, workbook)
    if (result) {
      player.teamFromPlayersList = result.team
      player.position = result.position
      player.positionConfidence = result.confidence
    } else {
      player.teameamFromPlayersList = null
      player.position = 'Unknown' // Default position if not found
    }
  }

  return playersWithTeams
}

module.exports = addPlayerPositions
