var firebase = require('firebase');
require('dotenv').config();
var config = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.FIREBASE_DATABASEURL,
    projectId: process.env.FIREBASE_PROJJECT_ID,
    // storageBucket: "enhanced-bonito-205902.appspot.com",
    // messagingSenderId: "464374520999"
};
firebase.initializeApp(config);

module.exports = firebase;