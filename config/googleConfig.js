const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);


console.log('OAuth2 constructor:', oauth2Client.constructor.name);
console.log('generateAuthUrl inside config:', typeof oauth2Client.generateAuthUrl);
module.exports = oauth2Client;