import firebase from 'firebase'

module.exports = function(app, router) {
  router.get('/api', (req, res) => {
    res.json({ message: 'welcome to the api!' })
  })

  router
    .route('/api/posts')
    .post((req, res) => {
      console.log('POST')
      const encode_channel = encodeURIComponent(req.body.channel)
      firebase
        .database()
        .ref('/notes/' + encode_channel)
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
          db.ref('/notes/' + encode_channel).once('value').then(
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
      const encode_channel = encodeURIComponent(req.query.channel)
      const db = firebase.database()
      return db
        .ref('/notes/' + encodeURIComponent(encode_channel))
        .once('value')
        .then(snapshot => {
          res.json({ data: snapshot.val() })
        })
    })
}
