const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const config = require('../../config')

module.exports = [{
  method: 'GET',
  path: '/login',
  handler: async (request, h) => {
    return h.view('login')
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
        return h.view('login', {
          error: 'Invalid email or password. Please try again.'
        }).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const { email, password } = request.payload

        // Find the user by email
        const user = await User.findOne({ email })
        if (!user) {
          return h.view('login', {
            error: 'Invalid email or password. Please try again.'
          })
        }

        // Compare the password with the stored hash
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
          return h.view('login', {
            error: 'Invalid email or password. Please try again.'
          })
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, config.jwtConfig.secret, { expiresIn: '1h' })

        return h.redirect('/')
          .header('Authorization', token)
          .state('dl_token', token, config.cookieOptionsIdentity)
          .state('user_email', user.email, { isSecure: process.env.NODE_ENV === 'development', isHttpOnly: false })
      } catch (err) {
        console.error('Login error:', err)
        return h.view('login', {
          error: 'An error occurred during login. Please try again.'
        })
      }
    }
  }
}]
