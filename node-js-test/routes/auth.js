const express = require('express');
var router = express.Router();
const firebaseClient = require('../connections/firebase_client');
const firebaseAuth = firebaseClient.auth();


router.get('/signup', (req, res) => {
    const messages = req.flash('error');
    res.render('dashboard/signup', {
        messages,
        hasErrors: messages.length > 0
    });
});
router.get('/signin', (req, res) => {
    const messages = req.flash('error');
    res.render('dashboard/signin', {
        messages,
        hasErrors: messages.length > 0
    });
});

router.get('/signout', (req, res) => {
    res.session.uid = '';
    res.redirect('/auth/signin');
})

router.post('/signup', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    const confirmPassword = req.body.confirm_Password;
    if (password !== confirmPassword) {
        req.flash('error', '密碼不相同');
        res.redirect('/auth/signup');
    }

    firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            res.redirect('/auth/signin')
        }).catch((error) => {
            req.flash('error', error.messages);
            res.redirect('/auth/signup')
        })
})
router.post('/signin', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    firebaseAuth.signInWithEmailAndPassword(email, password)
        .then((user) => {
            // user = firebaseAuth.currentUser;
            // 上面那條登入必用，抓取個人uid
            req.session.uid = user.uid;
            req.session.mail = req.body.email;
            console.log(user.uid);
            res.redirect('/dashboard')
        }).catch((error) => {
            console.log(error);
            req.flash('error', error.messages);
            res.redirect('/auth/signin')
        })
})

module.exports = router;