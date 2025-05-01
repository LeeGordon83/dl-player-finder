const User = require('../models/user')

module.exports = [{
  method: 'GET',
  path: '/users',
  options: {
    auth: {
      strategy: 'jwt',
      mode: 'required'
    },
    pre: [{
      method: async (request, h) => {
        if (request.auth.credentials.role !== 'superuser') {
          return h.redirect('/').takeover()
        }
        return h.continue
      }
    }],
    handler: async (request, h) => {
      try {
        // Retrieve all users from the database
        const users = await User.find().lean()

        // Render the 'users' view and pass the users data
        return h.view('users', {
          users,
          user: request.auth.credentials // Add this to pass user info to template
        })
      } catch (err) {
        console.error('Error retrieving users:', err)
        return h.view('users', {
          error: 'An error occurred while retrieving users.',
          user: request.auth.credentials // Add this to pass user info to template
        })
      }
    }
  }
}]
