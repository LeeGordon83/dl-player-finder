const xlsx = require('xlsx')
const { calculateDistance } = require('../levenshtein')

// Function to search for a player in the sheet named 'ALL' and return the team, position, and confidence if found
const findPlayerPosition = (firstName, surname, team, workbook) => {
  const sheetName = 'ALL'
  const sheet = workbook.Sheets[sheetName]

  if (!sheet) {
    console.error(`Sheet named '${sheetName}' not found in the workbook.`)
    return null
  }

  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 })

  let highConfidenceMatch = null
  let mediumConfidenceMatch = null
  let lowConfidenceMatch = null

  for (const row of data) {
    if (row.length < 4) continue

    const [name, lastName, position, sheetTeam] = row

    const confidence = determineConfidence(name, firstName, lastName, surname, team, sheetTeam)

    // Prioritize matches by confidence level and store them
    if (confidence === 'High') {
      highConfidenceMatch = { sheetTeam, position, confidence }
      break // Stop searching if a high confidence match is found
    } else if (confidence === 'Medium' && !mediumConfidenceMatch) {
      mediumConfidenceMatch = { sheetTeam, position, confidence }
    } else if (confidence === 'Low' && !lowConfidenceMatch) {
      lowConfidenceMatch = { sheetTeam, position, confidence }
    }
  }

  // Return the highest confidence match available
  return highConfidenceMatch || mediumConfidenceMatch || lowConfidenceMatch || null
}

function determineConfidence (name, firstName, lastName, surname, team, sheetTeam) {
  const trimmedName = name ? name.trim() : ''
  const trimmedFirstName = firstName ? firstName.trim() : ''
  const trimmedLastName = lastName ? lastName.trim() : ''
  const trimmedSurname = surname ? surname.trim() : ''
  const trimmedTeam = team ? team.trim() : ''
  const trimmedSheetTeam = sheetTeam ? sheetTeam.trim() : ''

  if (trimmedName === trimmedFirstName && trimmedLastName === trimmedSurname && trimmedTeam === trimmedSheetTeam) {
    return 'High'
  } else if (trimmedName === trimmedFirstName && trimmedLastName === trimmedSurname) {
    return 'Medium'
  } else if (trimmedLastName === trimmedSurname && trimmedTeam === trimmedSheetTeam) {
    return 'Medium'
  } else if (trimmedLastName === trimmedSurname) {
    return 'Low'
  }
  return null
}

module.exports = {
  findPlayerPosition
}
