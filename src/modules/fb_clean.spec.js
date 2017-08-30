const test = require('blue-tape')
import admin from 'firebase-admin'
import util from '../test/helpers'
require('dotenv').config() // helps parse config
require('../config/firebase/test_server') // firebase config
import fb_clean from './fb_clean.js'

const test_ref = '___test_notes'
const db_test_ref = admin.database().ref(test_ref)
const test_obj = date_time => {
  return {
    channel_name_123: {
      random_id_456: {
        createdAt: date_time,
        encrypted: false,
        plaintext: '',
        text: 'a test note here 789'
      }
    }
  }
}
const one_day = 1000 * 60 * 60 * 24
const current_time = Date.now()
const two_day_old = Date.now() - one_day * 2

const create_note = date_time => {
  return new Promise((resolve, reject) => {
    db_test_ref.update(test_obj(date_time)).then(() => {
      resolve()
    })
  })
}

const read_snapshot = () => {
  return new Promise((resolve, reject) => {
    db_test_ref.once('value').then(function(snapshot) {
      const data = snapshot.val()
      resolve(data)
    })
  })
}

test('delete posts older than a day', t => {
  create_note(two_day_old).then(() => {
    console.log('done')
    fb_clean.clean(test_ref).then(() => {
      read_snapshot()
        .then(data => {
          t.equal(data, null, 'deleted two day old post')
          t.end()
        })
        .then(() => {
          util.delete_sample_post(db_test_ref)
        })
    })
  })
})

test('will not delete a current post', t => {
  create_note(current_time).then(() => {
    console.log('done')
    fb_clean.clean(test_ref).then(() => {
      read_snapshot()
        .then(data => {
          const data_type = typeof data
          console.log(data_type)
          t.equal(data_type, 'object', 'post data returns an object')
          t.end()
        })
        .then(() => {
          util.delete_sample_post(db_test_ref)
        })
    })
  })
})
