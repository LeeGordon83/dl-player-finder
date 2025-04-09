const isInRole = (credentials, role) => {
  if (!credentials || !credentials.scope) {
    return false
  }

  if (role === 'user') {
    return true
  }

  return credentials.role === role
}

module.exports = isInRole
