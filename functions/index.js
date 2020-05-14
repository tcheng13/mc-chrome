const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp();

const database = admin.database().ref('/');

const getIntentsFromDatabase = (res) => {
  let intents = [];
  return database.on('value', (snapshot) => {
    snapshot.forEach((item) => {
      intents.push(item);
    });
    res.status(200).json(intents)
  }, (error) => {
    res.status(error.code).json({
      message: `Something went wrong. ${error.message}`
    })
  })
};

exports.getIntents = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'GET') {
      return res.status(401).json({
        message: 'Not allowed'
      });
    };
    getIntentsFromDatabase(res)
  });
});

exports.addEmail = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      })
    };
    let email = req.body.email;
    let intent = req.body.intent;
    let add = admin.database().ref(`/intents`)
    email = {email, intent};
    add.push(email);
    getIntentsFromDatabase(res);
  });
});

exports.addTemplate = functions.database.ref('/intents/{pushId}/email')
.onCreate((snapshot, context) => {
  var temp;
  database.once("value", function(snap) {
    temp = snap.val().urlTemplate
    return snapshot.ref.parent.child('url').set(temp);
  })
});

exports.addUrl = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      })
    };
    const id = req.query.id
    const edit = admin.database().ref(`/intents/${id}/url`)

    edit.push(req.body.path)

    getIntentsFromDatabase(res)
  });
});
