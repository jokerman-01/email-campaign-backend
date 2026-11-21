const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const oauth2Client = require('../config/googleConfig');
console.log('OAuth2 Client:', oauth2Client);
console.log('generateAuthUrl type:', typeof oauth2Client.generateAuthUrl);

exports.connectGoogle = async (req, res) => {
    try {

        const state = jwt.sign(
            { userId: req.user.id },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',

            scope: [
                'openid',
                'email',
                'https://mail.google.com/'
            ],

            state
        });

        res.status(200).json({
            message: 'Connect your Gmail account',
            authUrl
        });

    } catch (error) {

        res.status(500).json({
            message: 'Error connecting Google account',
            error: error.message
        });

    }
};

exports.googleCallback = async (req, res) => {
    try {

        const { code, state } = req.query;

        if (!code || !state) {
            return res.status(400).json({
                message: 'Authorization code or state is missing'
            });
        }

        // Verify the state token
        const decoded = jwt.verify(
            state,
            process.env.JWT_SECRET
        );

        // Exchange authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        if (!tokens.refresh_token) {
            return res.status(400).json({
                message: 'No refresh token received. Please authorize again.'
            });
        }

        // Create a Google OAuth client
        const googleClient = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        googleClient.setCredentials(tokens);

        // Get the user's Google account information
        const googleApi = google.oauth2({
            version: 'v2',
            auth: googleClient
        });

        const { data } = await googleApi.userinfo.get();

        if (!data.email || !data.verified_email) {
            return res.status(400).json({
                message: 'Could not verify Google email address'
            });
        }

        // Find the logged-in user
        const user = await User.findById(decoded.userId)
            .select('+googleRefreshToken');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Save Gmail details
        user.googleEmail = data.email;
        user.googleRefreshToken = tokens.refresh_token;
        user.googleConnected = true;

        await user.save();

        res.status(200).send(
            'Gmail connected successfully!'
        );

    } catch (error) {

        res.status(500).json({
            message: 'Google authentication failed',
            error: error.message
        });

    }
};