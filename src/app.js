import firebase from 'firebase'
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

//firebase
require('dotenv').config() // helps parse config
require('./config/firebase/live_server') // firebase config

require('now-logs')(process.env.NEP_LOGS_SECRET)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 8080

//ROUTES
const router = express.Router()

router.use((req, res, next) => {
  // do logging
  console.log('Something is happening.', req.query)
  next()
})

router.get('/', (req, res) => {
  res.json({ message: 'welcome to the api!' })
})

router
  .route('/posts')
  .post((req, res) => {
    console.log('POST')
    console.log(req.body)
    firebase
      .database()
      .ref('/notes/' + req.body.channel)
      .set({
        key: {
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          encrypted: req.body.encrypted,
          plaintext: req.body.plaintext,
          text: req.body.text
        }
      })
      .then(function() {
        const db = firebase.database()
        db.ref('/notes/' + req.body.channel).once('value').then(
          snapshot => {
            res.json({ data: snapshot.val() })
          },
          error => {
            console.error(error)
          }
        )
      })
  })
  .get((req, res) => {
    console.log('GET')
    const channel = req.query.channel
    const db = firebase.database()
    return db.ref('/notes/' + channel).once('value').then(snapshot => {
      res.json({ data: snapshot.val() })
    })
  })

// REGISTER OUR ROUTES
app.use('/api', router)

// START THE SERVER
app.listen(port)
console.log('Magic happens on port ' + port)
