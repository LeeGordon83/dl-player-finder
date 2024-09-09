// findPlayerPosition.test.js
// const xlsx = require('xlsx')
const { findPlayerPosition } = require('../../../app/services/findPlayerPosition')

// Mock the xlsx module
jest.mock('xlsx')

describe('findPlayerPosition', () => {
  let workbook

  beforeEach(() => {
    workbook = {
      Sheets: {
        ALL: [
          ['John', 'Doe', 'Forward', 'TeamA'],
          ['Jane', 'Smith', 'Midfielder', 'TeamB'],
          ['Jim', 'Brown', 'Defender', 'TeamC']
        ]
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return null if sheet is not found', () => {
    const result = findPlayerPosition('John', 'Doe', 'TeamA', { Sheets: {} })
    expect(result).toBeNull()
  })

  test('should return high confidence match', () => {
    const result = findPlayerPosition('John', 'Doe', 'TeamA', workbook)
    expect(result).toEqual({ sheetTeam: 'TeamA', position: 'Forward', confidence: 'High' })
  })

  test('should return medium confidence match', () => {
    const result = findPlayerPosition('Jane', 'Smith', 'TeamX', workbook)
    expect(result).toEqual({ sheetTeam: 'TeamB', position: 'Midfielder', confidence: 'Medium' })
  })

  test('should return low confidence match', () => {
    const result = findPlayerPosition('Jim', 'Brown', 'TeamX', workbook)
    expect(result).toEqual({ sheetTeam: 'TeamC', position: 'Defender', confidence: 'Low' })
  })

  test('should return null if no match is found', () => {
    const result = findPlayerPosition('Nonexistent', 'Player', 'TeamX', workbook)
    expect(result).toBeNull()
  })
})
