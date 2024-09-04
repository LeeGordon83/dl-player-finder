const config = require('../server.js').cookieOptions

const createDefaultPolicy = (h) => {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state('cookies_policy', cookiesPolicy, config)
  return cookiesPolicy
}

module.exports = createDefaultPolicy
