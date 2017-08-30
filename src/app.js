import admin from 'firebase-admin'
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');

//firebase
require('dotenv').config() // helps parse config
require('./config/firebase/live_server') // firebase config

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------
router.route('/posts')

  // create a bear (accessed at POST http://localhost:8080/api/bears)
  .post(function(req, res) {
    
    const channel =   req.query.channel;
    const encrypted = req.query.encrypted;
    const plaintext = req.query.plaintext;
    const text =      req.query.text;

    admin.database().ref('/notes/' + channel).push({
      createdAt: admin.database.ServerValue.TIMESTAMP,
      encrypted: req.query.encrypted,
      plaintext: req.query.plaintext,
      text:      req.query.text,
    });
    const db = admin.database()
    return db.ref('/notes/' + channel).once('value').then(function(snapshot) {
      res.json({ data: snapshot.val() });
      console.log(snapshot.val())
    });
  })

  .get(function(req, res){    
    const channel = req.query.channel;
    const db = admin.database()
    return db.ref('/notes/' + channel).once('value').then(function(snapshot) {
      res.json({ data: snapshot.val() });
      console.log(snapshot.val())
    });
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);