// migrate.js

const mongoose = require('mongoose')

// Replace this with your MongoDB Atlas connection string
const MONGO_URI = 'mongodb+srv://Geordie_Foo:Pitchshifter12~@geordiefoo.yk90dti.mongodb.net/?retryWrites=true&w=majority&appName=GeordieFoo'
// Define a minimal version of the User model just for migration
const userSchema = new mongoose.Schema({
  firstName: { type: String },
  surname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String, default: null },
  resetTokenExpiration: { type: Date, default: null },
  role: { type: String, default: 'basic' },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

async function migrate () {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    const users = await User.find({})

    console.log(`Found ${users.length} users`)

    for (const user of users) {
      let updated = false

      // Add missing firstName and surname with default values if missing
      if (!user.firstName) {
        user.firstName = 'PlaceholderFirstName'
        updated = true
      }

      if (!user.surname) {
        user.surname = 'PlaceholderSurname'
        updated = true
      }

      // Add role if missing
      if (!user.role) {
        user.role = 'basic'
        updated = true
      }

      // Add createdAt if missing
      if (!user.createdAt) {
        user.createdAt = new Date()
        updated = true
      }

      if (updated) {
        await user.save()
        console.log(`Updated user ${user.email}`)
      }
    }

    console.log('Migration completed successfully!')
    process.exit(0)
  } catch (err) {
    console.error('Migration failed', err)
    process.exit(1)
  }
}

migrate()
