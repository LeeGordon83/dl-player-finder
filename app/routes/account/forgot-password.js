// forgot-password.js
const joi = require('joi')
const User = require('../../models/user')

module.exports = [{
  method: 'GET',
  path: '/forgot-password',
  options: {
    auth: false,
    handler: async (request, h) => {
      const error = request.yar.flash('error')
      const success = request.yar.flash('success')

      return h.view('forgot-password', {
        error: error.length ? error[0] : null,
        success: success.length ? success[0] : null
      })
    }
  }
},
{
  method: 'POST',
  path: '/forgot-password',
  options: {
    auth: false,
    validate: {
      payload: joi.object({
        email: joi.string().email().required(),
        crumb: joi.string().required()
      }),
      failAction: async (request, h, err) => {
        request.yar.flash('error', 'Please enter a valid email address')
        return h.redirect('/forgot-password').takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const { email } = request.payload

        // Check if user exists but don't change behavior based on result
        // Using await to ensure the database query completes
        await User.findOne({ email })

        // Always show success regardless of whether email was found
        request.yar.flash('success', 'If your email is registered, you will receive password reset instructions shortly')

        // TODO: Implement actual password reset email functionality

        return h.redirect('/forgot-password')
      } catch (err) {
        console.error('Password reset error:', err)
        request.yar.flash('error', 'An error occurred. Please try again later')
        return h.redirect('/forgot-password')
      }
    }
  }
}]
