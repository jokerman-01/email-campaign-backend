const express = require('express');
const router = express.Router();

const googleController = require('../controllers/googleController');
const verifyToken = require('../middlewares/authMiddleware');

// Route to connect Gmail
router.get('/connectGoogle', verifyToken, googleController.connectGoogle);

// Route to handle Google's callback
router.get('/callback', googleController.googleCallback);

module.exports = router;