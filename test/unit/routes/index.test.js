const Hapi = require('@hapi/hapi')
const Vision = require('@hapi/vision')
const Nunjucks = require('nunjucks')
const indexRoute = require('./../../../app/routes/index')

describe('GET /index', () => {
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

    server.route(indexRoute)
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('responds with 200 status code', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/'
    })

    expect(response.statusCode).toBe(200)
  })

  test('renders the index view', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/'
    })

    expect(response.payload).toContain('<!DOCTYPE html>')
  })
})
