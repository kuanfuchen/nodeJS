const fasebaseAdmin = require('firebase-admin');
require('dotenv').config();

fasebaseAdmin.initializeApp({
    credential: fasebaseAdmin.credential.cert({
        type: "service_account",
        project_id: process.env.FIREBASE_PROJJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        // 不知道是甚麼符號，但很重要
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    }),
    databaseURL: process.env.FIREBASE_DATABASEURL
});



const firebaseDb = fasebaseAdmin.database();


module.exports = firebaseDb;