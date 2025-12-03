// Polyfill for File API (needed for undici in some environments)
if (typeof global.File === 'undefined') {
  const { Blob } = require('buffer')
  global.File = class File extends Blob {
    constructor(bits, name, options = {}) {
      super(bits, options)
      this.name = name
      this.lastModified = options.lastModified || Date.now()
    }
  }
}

console.log('Node version:', process.version)
console.log('Has File API:', typeof File !== 'undefined')

const createServer = require('./server')
const pkg = require('../package.json')

createServer()
  .then((server) => {
    server.start()
    console.log('Dream League Player Finder (%s) running on %s', pkg.version, server.info.uri)
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
