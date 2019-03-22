const admin = require('firebase-admin');
const adminKey = require('./firebase-key.json')

admin.initializeApp({credential:admin.credential.cert(adminKey)})

const db = admin.firestore();