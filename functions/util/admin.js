const admin = require("firebase-admin");
const dotenv = require("dotenv");

//admin.initializeApp();

const serviceAccount = require(`../meowzers.json`);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "meowzers-4343a.appspot.com"
});

var bucket = admin.storage().bucket();

const db = admin.firestore();

module.exports = { admin, db };
