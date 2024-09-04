module.exports = [{
  method: 'GET',
  path: '/',
  config: {
  },
  handler: async (request, h) => {
    return h.view('index', { pageTitle: 'Dream League Target Finder - Results' })
  }
}]
