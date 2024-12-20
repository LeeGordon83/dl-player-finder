const joi = require('joi')
const bcrypt = require('bcrypt')
const User = require('../models/user')

module.exports = [{
  method: 'GET',
  path: '/reset-password/{id}',
  handler: async (request, h) => {
    const { id } = request.params
    const user = await User.findById(id).lean()
    return h.view('reset-password', { user })
  }
},
{
  method: 'POST',
  path: '/reset-password/{id}',
  options: {
    validate: {
      payload: joi.object({
        password: joi.string().required(),
        confirmPassword: joi.string().valid(joi.ref('password')).required()
      }),
      failAction: async (request, h, error) => {
        let errorMessage = 'Validation error. Please check your input and try again.'
        if (error.details[0].context.key === 'confirmPassword') {
          errorMessage = 'Passwords do not match. Please try again.'
        }
        return h.view('reset-password', {
          error: errorMessage,
          user: { _id: request.params.id }
        }).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params
        const { password } = request.payload

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Update the user's password
        await User.findByIdAndUpdate(id, { password: hashedPassword })

        return h.redirect('/users?message=Password updated successfully.')
      } catch (err) {
        console.error('Error resetting password:', err)
        return h.view('reset-password')
      }
    }
  }
}]
