const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const config = require('../../config')

module.exports = [{
  method: 'GET',
  path: '/login',
  handler: async (request, h) => {
    const error = request.yar.flash('error')
    const success = request.yar.flash('success')

    return h.view('login', {
      error: error.length ? error[0] : null,
      success: success.length ? success[0] : null
    })
  }
},
{
  method: 'POST',
  path: '/login',
  options: {
    validate: {
      payload: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
      }),
      failAction: async (request, h, error) => {
        request.yar.flash('error', 'Invalid email or password. Please try again.')
        return h.redirect('/login').takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const { email, password } = request.payload

        // Find the user by email
        const user = await User.findOne({ email })
        if (!user) {
          request.yar.flash('error', 'Invalid email or password. Please try again.')
          return h.redirect('/login')
        }

        // Compare the password with the stored hash
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
          request.yar.flash('error', 'Invalid email or password. Please try again.')
          return h.redirect('/login')
        }

        // Generate a JWT token
        const token = jwt.sign(
          { id: user._id,
            email: user.email,
            role: user.role },
          config.jwtConfig.secret,
          { expiresIn: '1h' }
        )

        // Store user session data
        request.yar.set('user', {
          id: user._id,
          email: user.email,
          role: user.role
        })

        // Store the JWT token in the session
        request.yar.set('token', token)

        return h.redirect('/')
      } catch (err) {
        console.error('Login error:', err)
        request.yar.flash('error', 'An error occurred during login. Please try again.')
        return h.redirect('/login')
      }
    }
  }
}]
