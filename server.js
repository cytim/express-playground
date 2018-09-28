const { fork } = require('child_process')
const { mkdirSync, appendFile, readFile } = require('fs')
const bodyParser = require('body-parser')
const express = require('express')
const pino = require('pino')

const log = pino({
  name: 'main',
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.LOG_PRETTY_PRINT === 'true',
})


// PREPARE THE APPLICATION ENVIRONMENT

try {
  mkdirSync('log')
  log.info('Created the "log" directory')
} catch(e) {
  if (e.code === 'EEXIST') {
    log.info('Skip creating the "log" directory: directory already exists')
  } else {
    log.error(`Failed to create the "log" directory: ${e.message}`)
  }
}


// SETUP THE SERVER

const app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Express Playground'))

app.get('/_health', (req, res) => res.json({ data: 'ok' }))

app.get('/load', (req, res) => {
  log.info('Received a request to load the server')
  fork('./lib/load', [ req.query.x ])
  res.json({ acknowledged: true })
})

app.post('/logs/dummy', (req, res) => {
  log.info('Received a request to write some dummy logs')
  const now = new Date()
  let { message } = req.body

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: '"message" must be a non-empty string' })
    return
  }

  message = now.toISOString() + ' - ' + message
  appendFile('log/dummy.log', `${message}\n`, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      res.json({ data: message })
    }
  })
})

app.get('/logs/dummy', (req, res) => {
  log.info('Received a request to get the dummy logs')
  readFile('log/dummy.log', (err, content) => {
    if (err) {
      res.json({ data: [] })
    } else {
      res.json({ data: content.toString().replace(/\n+$/, '').split('\n') })
    }
  })
})


// START THE SERVER

const port = process.env.PORT || 3000
app.listen(port, () => log.info(`Server listening on port ${port}...`))

