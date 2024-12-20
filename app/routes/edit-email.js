const joi = require('joi')
const User = require('../models/user')

module.exports = [{
  method: 'GET',
  path: '/edit-email/{id}',
  handler: async (request, h) => {
    const { id } = request.params
    const user = await User.findById(id).lean()
    return h.view('edit-email', { user })
  }
},
{
  method: 'POST',
  path: '/edit-email/{id}',
  options: {
    validate: {
      payload: joi.object({
        email: joi.string().email().required()
      })
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params
        const { email } = request.payload

        // Update the user's email
        await User.findByIdAndUpdate(id, { email })

        return h.redirect('/users?message=Email updated successfully.')
      } catch (err) {
        console.error('Error updating email:', err)
        const { id } = request.params
        const user = await User.findById(id).lean()
        return h.view('edit-email', { error: 'An error occurred while updating the email.', user })
      }
    }
  }
}]
