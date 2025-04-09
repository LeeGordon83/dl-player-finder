const User = require('../models/user')

const validate = async (decoded, request, h) => {
  try {
    const user = await User.findById(decoded.id)
    
    if (!user) {
      console.error('User not found:', decoded.id)
      return { isValid: false }
    }

    return {
      isValid: true,
      credentials: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        surname: user.surname,
        role: user.role
      }
    }
  } catch (err) {
    console.error('Validation error:', err)
    return { isValid: false }
  }
}

module.exports = validate
