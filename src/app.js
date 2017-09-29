//express
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

//configuration
require('dotenv').config() // helps parse config
require('./config/firebase/live_server') // firebase config

// logs
require('now-logs')(process.env.NEP_LOGS_SECRET)

// routes
import api_routes from './routes/api.js'
import root_route from './routes/root.js'

// set up app
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 8080

//set up routes
const router = express.Router()
root_route(app, router)
api_routes(app, router)

// REGISTER OUR ROUTES
app.use('/', router)

// START THE SERVER
app.listen(port)
console.log('Magic happens on port ' + port)
