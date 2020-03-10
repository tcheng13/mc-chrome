const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp();

const database = admin.database().ref('/intents');

exports.getIntents = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
      if(req.method !== 'GET') {
        return res.status(404).json({
          message: 'Not allowed'
        })
      }
  
      let intents = [];
  
      return database.on('value', (snapshot) => {
        snapshot.forEach((item) => {
          intents.push({
            item
          });
        });
        
        res.status(200).json(intents)
      }, (error) => {
        res.status(error.code).json({
          message: `Something went wrong. ${error.message}`
        })
      })
    })
})

