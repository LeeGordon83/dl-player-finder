module.exports = [{
  method: 'POST',
  path: '/logout',
  handler: async (request, h) => {
    return h.redirect('/')
      .unstate('dl_token')
      .unstate('user_email')
  }
}]
