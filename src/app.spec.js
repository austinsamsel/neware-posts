const test = require('blue-tape')
import admin from 'firebase-admin'
import util from './test/helpers'
require('dotenv').config() // helps parse config
require('./config/firebase/test_server') // firebase config

const db_test_ref = admin.database().ref('___test_read_write')

const sample_post = new_time => {
  return new Promise(resolve => {
    db_test_ref
      .set({
        time: new_time
      })
      .then(() => {
        resolve()
      })
  })
}

const read_sample_post = new_time => {
  return new Promise(resolve => {
    db_test_ref.once('value').then(function(snapshot) {
      const time = snapshot.val().time
      resolve(time)
    })
  })
}

test('write and read firebase', t => {
  const new_time = Date.now()
  sample_post(new_time).then(() => {
    read_sample_post()
      .then(res => {
        console.log(res)
        t.equal(res, new_time, 'found post with same time')
        t.end()
      })
      .then(() => {
        util.delete_sample_post(db_test_ref)
      })
  })
})
