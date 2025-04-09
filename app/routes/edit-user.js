const joi = require('joi')
const User = require('../models/user')

module.exports = [{
  method: 'GET',
  path: '/edit-user/{id}',
  handler: async (request, h) => {
    const { id } = request.params
    const user = await User.findById(id).lean()
    return h.view('edit-user', { user })
  }
},
{
  method: 'POST',
  path: '/edit-user/{id}',
  options: {
    auth: false,
    validate: {
      payload: joi.object({
        firstName: joi.string().required(),
        surname: joi.string().required(),
        email: joi.string().email().required(),
        role: joi.string().valid('basic', 'admin', 'superuser').required(),
        password: joi.string().allow(''),
        confirmPassword: joi.string().allow('')
      }),
      failAction: async (request, h, err) => {
        console.log('Validation Error:', err.details)
        console.log('Failed Payload:', request.payload)
        request.yar.flash('error', 'Invalid input. Please check your entries.');
        return h.redirect(`/edit-user/${request.params.id}`).takeover();
      }
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params
        const { firstName, surname, email, role, password } = request.payload

        const updateData = {
          firstName,
          surname,
          email,
          role
        }

        if (password && password.trim() !== '') {
          const hashedPassword = await bcrypt.hash(password, 10)
          updateData.password = hashedPassword
        }

        // Update the user's email
        await User.findByIdAndUpdate(id, updateData)
        request.yar.flash('success', 'User updated successfully')
        return h.redirect('/users')
      } catch (err) {
        console.error('Error updating email:', err)
        request.yar.flash('error', 'An error occurred while updating the user')
        return h.redirect(`/edit-user/${request.params.id}`)
      }
    }
  }
}]
