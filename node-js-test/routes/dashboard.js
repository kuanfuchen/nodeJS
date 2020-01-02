var express = require('express');
var router = express.Router();
const striptags = require('striptags');
const moment = require('moment');
var firebaseAdmin = require('../connections/firebase_admin');

const categoriesRef = firebaseAdmin.ref('categoriesII');
const articlesRef = firebaseAdmin.ref('article');



router.get('/', (req, res) => {
    const messages = req.flash('error');
    res.render('dashboard/index', {
        title: 'Express',
        currentPath: '/',
        hasErrors: messages.length > 0
    })
})



// app.js已有寫dashboard，故路徑不需要再加
router.get('/article/create', function (req, res, next) {
    const messages = req.flash('error');
    categoriesRef.once('value').then(function (snapshot) {
        var categories = snapshot.val();
        res.render('dashboard/article', {
            currentPath: '/article/create',
            categories,
            messages,
        });
    })
});
router.get('/article/:id', function (req, res, next) {
    const id = req.param('id');
    let categories = {};
    categoriesRef.once('value').then(function (snapshot) {
        categories = snapshot.val();
        return articlesRef.child(id).once('value');
    }).then(function (snapshot) {
        const article = snapshot.val();
        console.log(article);
        res.render('dashboard/article', {
            currentPath: '/article/',
            categories,
            article

        });
    })
});
// 
router.get('/archives', function (req, res, next) {
    const status = req.query.status || 'public';

    let categories = {};
    categoriesRef.once('value').then(function (snapshot) {
        categories = snapshot.val();
        return articlesRef.orderByChild('update_time').once('value');
    }).then(function (snapshot) {
        const articles = [];
        // 在此使用陣列是因為之後要分頁
        snapshot.forEach(function (snapshotChild) {
            // console.log('child', snapshotChild.val());
            if (status === snapshotChild.val().status) {
                articles.push(snapshotChild.val());
            }
        })
        articles.reverse();

        res.render('dashboard/archives', {
            articles,
            categories,
            striptags,
            // 可限制顯示的文字多寡
            // 必須寫到ejs
            moment,
            // 時間顯示
            // 必須寫到ejs
            status
        });
    });
});
router.get('/categories', function (req, res, next) {
    var messages = req.flash('info');
    categoriesRef.once('value', function (snapshot) {
        // 由firebase內categoriesII資料夾
        const categories = snapshot.val();

        res.render('dashboard/categories', {
            title: 'express',
            categories,
            messages,
            hasInfo: messages.length > 0
        });
    });
});

// 管理文章
router.post('/article/create', function (req, res) {
    const data = req.body;
    const articleRef = articlesRef.push();
    const key = articleRef.key;
    // key為id使用
    const updateTime = Math.floor(Date.now() / 1000);
    // Math.floor為取整數
    // const id = req.param('id');
    data.id = key;
    data.update_Time = updateTime;
    articleRef.set(data).then(function () {
        res.redirect(`/dashboard/article/${key}`);

    });

});
// 文章頁面更新
router.post('/article/update/:id', function (req, res) {
    let data = req.body;
    const id = req.param('id').trim();
    // const updateTime = Math.floor(Date.now() / 1000);
    // Math.floor為取整數
    // data.update_Time = updateTime;
    console.log('id', id)
    articlesRef.child(id).update(data).then(function () {
        res.redirect(`/dashboard/article/${data.id}`);

    });

});
router.post('/article/delete/:id', function (req, res) {
    const id = req.param('id');
    articlesRef.child(id).remove().then(() => {
        res.send({
            success: true,
            url: '/dashboard/archives/public',
        });
        res.end();
    });
    // articlesRef.child(id).remove();
    // req.flash('info', '欄位已刪除');
    // res.send({
    //     success: true,
    //     url: '/dashboard/archives/public',
    // });
    // res.end();
    // res.redirect('/dashboard/categories');
})



router.post('/categories/create', function (req, res) {
    const data = req.body;
    console.log(data);
    const category = categoriesRef.push();
    // 以上為存入firebase的資料
    // ----以下顯示至網頁---
    const key = category.key;
    data.id = key;
    // 加入判斷式，避免重複資料
    categoriesRef.orderByChild('path').equalTo(data.path).once('value')
        .then(function (snapshot) {
            // orderByChild可搜索特定的欄位，equalTo為比對相同的值
            if (snapshot.val() !== null) {
                req.flash('info', '已有相同路徑');
                res.redirect('/dashboard/categories');
            } else {
                category.set(data).then(function () {
                    res.redirect('/dashboard/categories')
                });
            }
        });
});

router.post('/categories/delete/:id', function (req, res) {
    const id = req.param('id');
    categoriesRef.child(id).remove();
    req.flash('info', '欄位已刪除');
    res.redirect('/dashboard/categories');
});

module.exports = router;