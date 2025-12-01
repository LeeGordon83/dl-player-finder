const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const config = require('../config')

async function scrapeLeague (url) {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: ['--ignore-certificate-errors']
  })
  const page = await browser.newPage()

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  )

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  const html = await page.content()

  // Find the comment containing the stats table
  const commentRegex = /<!--([\s\S]*?)-->/g
  let match
  let tableHtml = null

  while ((match = commentRegex.exec(html)) !== null) {
    const comment = match[1]
    if (comment.includes('stats_standard')) {
      tableHtml = comment
      break
    }
  }

  if (!tableHtml) {
    console.error('Table not found in HTML comments')
    await browser.close()
    return []
  }

  const $ = cheerio.load(tableHtml)

  const players = []

  $('#stats_standard tbody tr').each((i, row) => {
    const player = {}
    $(row)
      .find('td, th')
      .each((_, cell) => {
        const key = $(cell).attr('data-stat')
        if (!key) return
        const value = $(cell).text().trim()
        player[key] = value
      })
    players.push(player)
  })

  await browser.close()
  return players
}

async function getTopScorers (competition) {
  const comp = Number(competition)
  // Map competition number to config URL
  const urlMap = {
    2: config.fbChampionship,
    3: config.fbLeagueOne,
    4: config.fbLeagueTwo
  }

  const url = urlMap[comp]

  if (!url) {
    throw new Error(`Invalid competition: ${competition}`)
  }

  const players = await scrapeLeague(url)

  // Split player name into first-name and last-name
  return players.map(player => {
    const nameParts = (player.player || '').trim().split(' ')
    const lastName = nameParts.pop() || '' // Last word is surname
    const firstName = nameParts.join(' ') || '' // Rest is first name

    return {
      ...player,
      'first-name': firstName,
      'last-name': lastName,
      id: Number(player.ranker) || 0
    }
  })
}

module.exports = { getTopScorers }
