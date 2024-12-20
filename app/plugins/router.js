const routes = [].concat(
  require('../routes/index'),
  require('../routes/about'),
  require('../routes/buildGoalscorers'),
  require('../routes/fetchGoalscorers'),
  require('../routes/public'),
  require('../routes/account/login'),
  require('../routes/account/register'),
  require('../routes/users'),
  require('../routes/edit-email'),
  require('../routes/reset-password'),
  require('../routes/account/logout'),
  require('../routes/cookies')
  // require('../routes/account/forgot-password'),
  // require('../routes/account/reset-password'),
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route(routes)
    }
  }
}
