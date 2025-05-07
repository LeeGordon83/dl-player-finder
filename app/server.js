const hapi = require('@hapi/hapi')
const config = require('./config')
require('dotenv').config()
const DatabaseHandler = require('./models/databaseHandler')
const Yar = require('@hapi/yar')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    host: config.host,
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

  server.state('dl_token', {
    ttl: 8 * 60 * 60 * 1000, // 8 hours
    isSecure: process.env.NODE_ENV === 'production',
    isHttpOnly: true,
    path: '/'
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

  await server.register({
    plugin: Yar,
    options: {
      cookieOptions: {
        password: process.env.SESSION_SECRET, // at least 32 characters
        isSecure: process.env.NODE_ENV === 'production', // false in development
        isHttpOnly: true,
        path: '/'
      },
      maxCookieSize: 0
    }
  })

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
