const fs = require('fs')
const xlsx = require('xlsx')
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

// Paths to the files
const originalFilePath = 'championship.csv'
const otherSpreadsheetPath = 'PlayersList_24_25.xlsx'
const updatedFilePath = 'championship.csv'

// Function to read the CSV file and return the data as an array of objects
const readCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err))
  })
}

// Function to search for player in all sheets except 'ALL' and return the sheet name and team if found
const findPlayer = (firstName, surname, workbook) => {
  for (const sheetName of workbook.SheetNames) {
    if (sheetName === 'ALL') continue
    const sheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 })
    for (const row of data) {
      if (row[0].trim() === firstName && row[1].trim() === surname) {
        console.log(`Found ${firstName} ${surname} in sheet ${sheetName} with team ${row[2]}`)
        return { sheetName, team: row[2] }
      }
    }
  }
  return null
}

const main = async () => {
  // Read the original CSV file
  const originalData = await readCsv(originalFilePath)

  // Extract first names and surnames
  originalData.forEach(row => {
    const names = row.Player.split(' ')
    row.FirstName = names[0]
    row.Surname = names[names.length - 1]
  })

  // Load the other spreadsheet with multiple sheets
  const workbook = xlsx.readFile(otherSpreadsheetPath)

  // Search for each player in the other spreadsheet and add the result to the original data
  for (const row of originalData) {
    const result = findPlayer(row.FirstName, row.Surname, workbook)
    if (result) {
      row.WorksheetFound = result.sheetName
      row.TeamFromPlayersList = result.team
    } else {
      row.WorksheetFound = null
      row.TeamFromPlayersList = null
      console.log(`Could not find ${row.FirstName} ${row.Surname} in any sheet`)
    }
  }

  // Write the updated data to a new CSV file
  const csvWriter = createCsvWriter({
    path: updatedFilePath,
    header: Object.keys(originalData[0]).map(key => ({ id: key, title: key }))
  })

  await csvWriter.writeRecords(originalData)

  console.log(`Updated file saved to ${updatedFilePath}`)
}

main().catch(err => console.error(err))
