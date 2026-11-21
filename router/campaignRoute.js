const express = require('express');
const router = express.Router();


//import the campaign Controller
const campaignController = require('../controllers/campaignController');
console.log('createCampaign:', typeof campaignController.createCampaign);
console.log('getAllCampaigns:', typeof campaignController.getAllCampaigns);
console.log('sendCampaign:', typeof campaignController.sendCampaign);

const verifyToken = require('../middlewares/authMiddleware');


//define campaign routers
router.post('/createCampaign',verifyToken, campaignController.createCampaign);

// Get all campaign
router.get('/getAllCampaigns', verifyToken, campaignController.getAllCampaigns);

// New send campaign route
console.log('Send campaign route registered successfully');
router.post('/sendCampaign/:campaignId',verifyToken, campaignController.sendCampaign);

//export the router to be ued in another file
module.exports = router; 