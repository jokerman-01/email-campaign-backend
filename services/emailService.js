const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const oauth2Client = require('../config/googleConfig');

const sendEmail = async (user, recipient, subject, body) => {
    try {
        // 1. Set the user's refresh token
        oauth2Client.setCredentials({
            refresh_token: user.googleRefreshToken
        });

        // 2. Get a fresh access token
        const accessToken = await oauth2Client.getAccessToken();

        // 3. Create the email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: user.googleEmail,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: user.googleRefreshToken,
                accessToken: accessToken.token
            }
        });

        // 4. Send the email
        const mailOptions = {
            from: user.googleEmail,
            to: recipient,
            subject: subject,
            html: body
        };

        const result = await transporter.sendMail(mailOptions);

        return result;

    } catch (error) {
        throw error;
    }
};

module.exports = sendEmail;
