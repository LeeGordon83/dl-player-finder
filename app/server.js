const hapi = require('@hapi/hapi')
const config = require('./config')
require('dotenv').config()
const DatabaseHandler = require('./models/databaseHandler')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  // Initialize the database connection
  const dbHandler = new DatabaseHandler(process.env.MONGO_URL)
  try {
    await dbHandler.connect() // Connect to MongoDB
    console.log('MongoDB connection established successfully.')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1) // Exit the process if the database connection fails
  }

  // Register the plugins
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/views'))
  await server.register(require('hapi-auth-jwt2'))
  await server.register(require('./plugins/auth'))
  await server.register(require('./plugins/qs'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/errors'))
  await server.register(require('./plugins/crumb'))
  await server.register(require('./plugins/view-context'))

  return server
}

module.exports = createServer
