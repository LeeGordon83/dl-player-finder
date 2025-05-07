// routes/delete-user.js
const User = require('../models/user')
const checkRoles = require('../plugins/auth/checkRoles')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/delete-user/{id}',
  options: {
    auth: {
      strategy: 'jwt',
      mode: 'required'
    },
    pre: [{ method: checkRoles(['superuser']) }],
    handler: async (request, h) => {
      try {
        const { id } = request.params
        const user = await User.findById(id).lean()
        
        if (!user) {
          request.yar.flash('error', 'User not found')
          return h.redirect('/users')
        }

        return h.view('delete-user-confirm', {
          userData: user,
          user: request.auth.credentials,
          crumb: request.plugins.crumb
        })
      } catch (err) {
        console.error('Error fetching user for deletion:', err)
        request.yar.flash('error', 'An error occurred while fetching the user')
        return h.redirect('/users')
      }
    }
  }
},
{
  method: 'POST',
  path: '/delete-user/{id}',
  options: {
    auth: {
      strategy: 'jwt',
      mode: 'required'
    },
    pre: [{ method: checkRoles(['superuser']) }],
    validate: {
      payload: joi.object({
        crumb: joi.string().optional()
      }),
      failAction: async (request, h, err) => {
        request.yar.flash('error', 'Invalid request')
        return h.redirect('/users').takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params
        
        // Delete the user
        const result = await User.findByIdAndDelete(id)
        
        if (!result) {
          request.yar.flash('error', 'User not found')
          return h.redirect('/users')
        }
        
        request.yar.flash('success', 'User deleted successfully')
        return h.redirect('/users')
      } catch (err) {
        console.error('Error deleting user:', err)
        request.yar.flash('error', 'An error occurred while deleting the user')
        return h.redirect('/users')
      }
    }
  }
}]
