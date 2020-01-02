var express = require('express');
var router = express.Router();
const striptags = require('striptags');
const moment = require('moment');
const convertPage = require('../modules/convertPage');
var firebaseAdminDb = require('../connections/firebase_admin');
var firebaseAdmin = require('../connections/firebase_admin');
const categoriesRef = firebaseAdmin.ref('categoriesII');
const articlesRef = firebaseAdmin.ref('article');

/* GET home page. */

router.get('/', function (req, res, next) {
  let categories = {};
  let currentPage = Number.parseInt(req.query.page, 10) || 1;
  categoriesRef.once('value').then(function (snapshot) {
    categories = snapshot.val();
    return articlesRef.orderByChild('update_time').once('value');
  }).then(function (snapshot) {
    let articles = [];
    snapshot.forEach(function (snapshotChild) {
      if ('public' === snapshotChild.val().status) {
        articles.push(snapshotChild.val())
      }
    });
    articles.reverse();
    // 分頁
    const data = convertPage(articles, currentPage);
    // 分頁結束
    res.render('index', {
      title: 'Express',
      articles: data.data,
      categories,
      striptags,
      moment,
      page: data.page,
    });
  });
});
router.get('/post/:id', function (req, res, next) {
  // router路徑
  let id = req.param('id');
  let categories = {};
  categoriesRef.once('value').then(function (snapshot) {
    categories = snapshot.val();
    return articlesRef.child(id).once('value');
  }).then(function (snapshot) {
    const article = snapshot.val();
    // 判斷式
    if (!article) {
      return res.render('error', {
        title: '該文章找不到'
      })
    }
    // end
    res.render('post', {
      title: 'Express',
      article,
      categories,
      striptags,
      moment,
    });
  });
});
router.get('/dashboard/signup', function (req, res, next) {
  res.render('dashboard/signup', {});
});

module.exports = router;