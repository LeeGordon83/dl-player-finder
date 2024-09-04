const routes = [].concat(
  require('../routes/index'),
  require('../routes/fetchGoalscorers')
  // ('../routes/account/login'),
  // require('../routes/account/register'),
  // require('../routes/account/forgot-password'),
  // require('../routes/account/reset-password'),
  // require('../routes/account/logout')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route(routes)
    }
  }
}
