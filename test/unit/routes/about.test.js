const Hapi = require('@hapi/hapi')
const Vision = require('@hapi/vision')
const Nunjucks = require('nunjucks')
const aboutRoute = require('./../../../app/routes/about')

describe('GET /about', () => {
  let server

  beforeAll(async () => {
    server = Hapi.server({
      port: 3000,
      host: 'localhost'
    })

    await server.register(Vision)

    server.views({
      engines: {
        njk: {
          compile: (src, options) => {
            const template = Nunjucks.compile(src, options.environment)
            return context => template.render(context)
          },
          prepare: (options, next) => {
            options.compileOptions.environment = Nunjucks.configure('app/views', { watch: false })
            return next()
          }
        }
      },
      path: 'app/views'
    })

    server.route(aboutRoute)
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('responds with 200 status code', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/about'
    })

    console.log('Response payload:', response.payload) // Log the response payload for debugging
    console.log('Response status code:', response.statusCode) // Log the response status code for debugging

    expect(response.statusCode).toBe(200)
  })

  test('renders the about view', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/about'
    })

    console.log('Response payload:', response.payload) // Log the response payload for debugging
    console.log('Response status code:', response.statusCode) // Log the response status code for debugging

    // Check if the response contains the expected HTML content
    expect(response.payload).toContain('<!DOCTYPE html>') // Assuming your view renders HTML
  })
})
