const { readFileSync } = require('fs')
const { encrypt } = require('./security')
const pino = require('pino')

const log = pino({
  name: 'loader',
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.LOG_PRETTY_PRINT === 'true',
})

log.info('Started a thread to load the server...')

const dummy = readFileSync('statics/dummy.jpg')

let x = parseInt(process.argv[2])
x = Math.min(x, 5)
x = Math.max(x, 1)

let count = Math.pow(10, x)

for (let i = 0; i < count; i++) {
  encrypt(dummy)
}

log.info('Stopped the thread from loading the server')

