// routes/goalscorers/index.js
const buildGoalscorers = require('./build-goalscorers')
const fetchGoalscorers = require('./fetch-goalscorers')

module.exports = [
  ...buildGoalscorers,
  ...fetchGoalscorers
]
