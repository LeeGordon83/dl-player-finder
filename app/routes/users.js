const User = require('../models/user')
const checkRoles = require('../plugins/auth/checkRoles') // Import the checkRoles function

module.exports = [{
  method: 'GET',
  path: '/users',
  options: {
    auth: {
      strategy: 'jwt',
      mode: 'required'
    },
    pre: [{ method: checkRoles(['superuser']) }], // Use the centralized function
    handler: async (request, h) => {
      try {
        // Retrieve all users from the database
        const users = await User.find().lean()

        // Render the 'users' view and pass the users data
        return h.view('users', {
          users,
          user: request.auth.credentials,
          auth: {
            isAuthenticated: true,
            isAnonymous: false,
            isUser: true,
            isAdmin: true
          }
        })
      } catch (err) {
        console.error('Error retrieving users:', err)
        return h.view('users', {
          error: 'An error occurred while retrieving users.',
          user: request.auth.credentials,
          auth: {
            isAuthenticated: true,
            isAnonymous: false,
            isUser: true,
            isAdmin: true
          }
        })
      }
    }
  }
}]
