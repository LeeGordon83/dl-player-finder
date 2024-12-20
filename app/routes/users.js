const User = require('../models/user')

module.exports = [{
  method: 'GET',
  path: '/users',
  handler: async (request, h) => {
    try {
      // Retrieve all users from the database
      const users = await User.find().lean()

      // Render the 'users' view and pass the users data
      return h.view('users', { users })
    } catch (err) {
      console.error('Error retrieving users:', err)
      return h.view('users', { error: 'An error occurred while retrieving users.' })
    }
  }
}]
