var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController'); 

// GET for /users.
router.get('/', user_controller.userList);  

// GET request /users/all users
router.get('/all', user_controller.userList);



module.exports = router;
