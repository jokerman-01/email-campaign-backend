const express = require('express');
const router = express.Router();


//import the user Controller
const userController = require('../controllers/userController');

//define user routers
router.post('/createUsers', userController.createUsers);

//log in user
router.post('/loginUser', userController.loginUser);

//export the router to be ued in another file
module.exports = router;