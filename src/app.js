// import admin from 'firebase-admin'
import express from 'express'
const app = express()
require('dotenv').config() // helps parse config
require('./config/firebase/live_server') // firebase config
// firebase service worker to clean old posts
const fb_clean = require('./modules/fb_clean')

require('now-logs')(process.env.LOGS_SECRET)

app.set('port', process.env.PORT || 5000)

app.get('/', function(request, response) {
  const greeting = process.env.GREETING
  response.writeHead(200)
  response.end(greeting)
  // run firebase cleaner
  fb_clean.clean('notes')
  // TODO: test on visit url, this function runs.
  console.log('hit browser')
})

app.listen(app.get('port'), function() {
  console.log('Your app is listening on port ' + app.get('port'))
  // run firebase cleaner
  fb_clean.clean('notes')
})
