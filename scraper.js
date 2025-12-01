process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' // ⚠️ local testing only

const cheerio = require('cheerio')

async function scrapeTopScorers (baseUrl, pages = 2) {
  const results = []

  for (let page = 1; page <= pages; page++) {
    const url = `${baseUrl}${page > 1 ? `&page=${page}` : ''}`
    console.log(`Fetching: ${url}`)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch page ${page}: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // ✅ Use a more flexible selector
    $('table.items tbody tr').each((_, el) => {
      const cols = $(el).find('td')

      if (cols.length === 0) return // skip header or spacer rows

      // Player name (usually in 2nd cell, with .spielprofil_tooltip)
      const name = $(cols[1]).find('a.spielprofil_tooltip').text().trim()

      // Team (usually in 4th cell, with an <a> tag)
      const team = $(cols[3]).find('a').text().trim()

      // Goals (last numeric column)
      const goalsText = $(cols[cols.length - 1]).text().trim()
      const goals = parseInt(goalsText, 10)

      if (name && team && !isNaN(goals)) {
        results.push({ name, team, goals })
      }
    })
  }

  return results.slice(0, 50)
}

(async () => {
  const baseUrl =
    'https://www.transfermarkt.co.uk/league-one/scorerliste/wettbewerb/GB3/plus/1/galerie/0?saison_id=2025&altersklasse=alle'

  try {
    const top50 = await scrapeTopScorers(baseUrl, 2)
    console.table(top50)
  } catch (err) {
    console.error('Scrape error:', err)
  }
})()
