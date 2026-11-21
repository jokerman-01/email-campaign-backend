const express = require('express');
const router = express.Router();

//import the recipient Controller
const recipientController = require('../controllers/recipientController');


const verifyToken = require('../middlewares/authMiddleware');


console.log("verifyToken is:", typeof verifyToken);
console.log("addRecipient is:", typeof recipientController.addRecipient);
//define recipient routers
router.post('/addRecipient',verifyToken, recipientController.addRecipient);

// Get all recipient
router.get('/getAllRecipients', verifyToken, recipientController.getAllRecipients);

//export the router to be ued in another file
module.exports = router; 