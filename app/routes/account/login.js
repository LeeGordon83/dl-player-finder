module.exports = [{
  method: 'GET',
  path: '/login',
  config: {
  },
  handler: async (request, h) => {
    return h.view('login')
  }
}]
