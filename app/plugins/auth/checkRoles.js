const checkRoles = (roles) => {
  return async (request, h) => {
    const credentials = request.auth.credentials

    if (!credentials) {
      return h.redirect('/login')
    }

    if (!roles.includes(credentials.role)) {
      request.yar.flash('error', 'You do not have permission to access this page')
      return h.redirect('/')
    }

    return h.continue
  }
}

module.exports = checkRoles
