const fs = require('fs')
const { parse } = require('csv-parse/sync')
const ExcelJS = require('exceljs')

// --- Read and parse the CSV file ---
const csv = fs.readFileSync('export.csv', 'utf8')
const records = parse(csv, { skip_empty_lines: false }) // keep empty rows

// Save header & remove it from processing list
const header = records.shift()

// --- Load Excel workbook ---
const workbook = new ExcelJS.Workbook()
await workbook.xlsx.readFile('app/data/PlayersList_25_26.xlsx')

// Get worksheet named "ALL"
const worksheet = workbook.getWorksheet('ALL')
if (!worksheet) {
  console.error("Worksheet 'ALL' not found in PlayersList_25_26.xlsx")
  process.exit(1)
}

// --- Convert Excel sheet to a 2D array (same as sheet_to_json(header:1)) ---
const excelRows = []
worksheet.eachRow({ includeEmpty: true }, (row) => {
  excelRows.push(row.values.slice(1)) // remove index 0 (ExcelJS stores null)
})

// Remove header row from Excel sheet if needed
if (excelRows[0] && excelRows[0][0] && excelRows[0][0].toLowerCase().includes('first')) {
  excelRows.shift()
}

// --- Build lookup map: "firstname|surname" -> position ---
const playerMap = new Map()

for (const row of excelRows) {
  const [firstName, surname, position] = row
  if (firstName && surname && position) {
    playerMap.set(
      `${firstName.trim().toLowerCase()}|${surname.trim().toLowerCase()}`,
      position.trim()
    )
  }
}

// --- Update each CSV row ---
const updatedRecords = records.map(row => {
  // Ensure row has at least 5 columns
  while (row.length < 5) row.push('')

  const [firstName, surname] = row
  const key = `${(firstName || '').trim().toLowerCase()}|${(surname || '').trim().toLowerCase()}`
  const position = playerMap.get(key)

  if (position) {
    row[4] = position // Column E (index 4)
  }

  return row
})

// Add header back
updatedRecords.unshift(header)

// Convert rows back to CSV
const csvOut = updatedRecords
  .map(row => row.map(cell => (cell ?? '')).join(','))
  .join('\n')

// Write to file
fs.writeFileSync('export.csv', csvOut, 'utf8')

console.log('export.csv updated with positions.')
