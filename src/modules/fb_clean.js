import admin from 'firebase-admin'

const db = admin.database()
const one_day = 1000 * 60 * 60 * 24
//const five_min  = 1000 * 60 * 5 // for testing
const one_min = 1000 * 60 * 1 // for testing

const cutoff = Date.now() - one_day
// TODO: tests should say we are measuring one day.

const clean = notes => {
  // delete old posts
  const ref_notes = db.ref(`${notes}`)
  ref_notes.on('child_added', snapshot => {
    const channel_name = snapshot.key
    snapshot.forEach(child_snap => {
      const key_id = child_snap.key
      if (child_snap.val().createdAt < cutoff) {
        db.ref(`${notes}/${channel_name}/${key_id}`).remove()
      }
    })
  })

  // admin.database().ref('notes').update({
  //   channelname01: {
  //     somecrazyid1: {
  //       createdAt: 0,
  //       text: 'hi'
  //     }
  //   },
  //   channelname02: {
  //     somecrazyid2: {
  //       createdAt: 1,
  //       text: 'hi'
  //     }
  //   },
  //   channelname03: {
  //     somecrazyid3: {
  //       createdAt: 1,
  //       text: 'hi'
  //     }
  //   },
  // });
}

module.exports = {
  clean
}
