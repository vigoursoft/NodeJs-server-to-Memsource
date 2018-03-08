// wiki.js - Wiki route module.
// this would be a help module

var express = require('express');
var router = express.Router();

// Home page route.
router.get('/', function (req, res) {
  res.render('index', { title: 'Vigoursoft' });
})

// About page route.
router.get('/about', function (req, res) {
  res.render('index', { title: 'Vigoursoft' });
})

module.exports = router;
