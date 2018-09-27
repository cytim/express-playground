const express = require('express')
const { fork } = require('child_process')
const pino = require('pino')

const log = pino({
  name: 'main',
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.LOG_PRETTY_PRINT === 'true',
})

const app = express()

app.get('/', (req, res) => res.send('Express Playground'))

app.get('/_health', (req, res) => res.json({ data: 'ok' }))

app.get('/load', (req, res) => {
  log.info('Received a request to load the server')
  fork('./lib/load', [ req.query.x ])
  res.json({ acknowledged: true })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server listening on port ${port}...`))

