const joi = require('joi')
const User = require('../../models/user')

module.exports = [{
  method: 'GET',
  path: '/register',
  handler: async (request, h) => {
    return h.view('register')
  }
},
{
  method: 'POST',
  path: '/register',
  options: {
    validate: {
      payload: joi.object({
        firstName: joi.string().required(),
        surname: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().valid(joi.ref('password')).required()
      }),
      failAction: async (request, h, error) => {
        let errorMessage = 'Validation error. Please check your input and try again.'
        if (error.details[0].context.key === 'confirmPassword') {
          errorMessage = 'Passwords do not match. Please try again.'
        } else if (error.details[0].context.key === 'email') {
          errorMessage = 'Please enter a valid email address.'
        }
        return h.view('register', {
          error: errorMessage
        }).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const { firstName, surname, email, password } = request.payload

        // Check if the user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
          request.yar.flash('error', 'Email already registered')
          return h.view('register')
        }

        const role = email === process.env.SUPERUSER_EMAIL ? 'superuser' : 'basic'

        // Create the new user
        const newUser = new User({
          firstName,
          surname,
          email,
          password,
          role
        })
        await newUser.save()

        request.yar.flash('success', 'Registration successful. Please log in.')

        return h.redirect('/login')
      } catch (err) {
        console.error('Registration error:', err)
        request.yar.flash('error', 'An error occurred during registration. Please try again.')
        return h.redirect('register')
      }
    }
  }
}]
