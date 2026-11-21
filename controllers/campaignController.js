const Campaign = require('../models/campaignModel');
const CampaignRecipient = require('../models/campaignRecipientModel');
const sendEmail = require('../services/emailService');
const User = require('../models/userModel');

// Create a new campaign and initialize recipient tracking logs
exports.createCampaign = async (req, res) => {
    try {
        const { title, subject, body, recipientIds } = req.body;

        // 1. Create the main campaign
        const newCampaign = await Campaign.create({
            title,
            subject,
            body,
            user: req.user.id
        });

        // 2. If recipient IDs were provided, create log entries for each
        if (recipientIds && recipientIds.length > 0) {
            const recipientLogs = recipientIds.map(recipientId => ({
                campaign: newCampaign._id,
                recipient: recipientId,
                status: 'pending'
            }));
            await CampaignRecipient.insertMany(recipientLogs);
        }

        res.status(201).json({
            message: 'Campaign created successfully with recipient logs',
            campaign: newCampaign
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating campaign',
            error: error.message
        });
    }
};

// Get all campaigns for the logged-in user
exports.getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            count: campaigns.length,
            campaigns
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching campaigns',
            error: error.message
        });
    }
};

exports.sendCampaign = async (req, res) => {
    try {
        // 1. Get campaign ID from URL
        const { campaignId } = req.params;

        // 2. Find the campaign
        const campaign = await Campaign.findOne({
            _id: campaignId,
            user: req.user.id
        });

        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found'
            });
        }

        // 3. Find the campaign owner
        const user = await User.findById(req.user.id)
            .select('+googleRefreshToken');

        if (!user || !user.googleRefreshToken) {
            return res.status(400).json({
                message: 'Please connect your Gmail account first'
            });
        }

        // 4. Find all recipients belonging to this campaign
        const campaignRecipients = await CampaignRecipient.find({
            campaign: campaignId
        }).populate('recipient');

        if (campaignRecipients.length === 0) {
            return res.status(400).json({
                message: 'No recipients found for this campaign'
            });
        }

        // 5. Send emails individually
        let successfulEmails = 0;
        let failedEmails = 0;

        for (const campaignRecipient of campaignRecipients) {
            try {
                const recipientEmail = campaignRecipient.recipient.email;

                // Send email
                await sendEmail(
                    user,
                    recipientEmail,
                    campaign.subject,
                    campaign.body
                );

                // Update recipient status
                campaignRecipient.status = 'sent';
                await campaignRecipient.save();

                successfulEmails++;

            } catch (error) { console.error(`Failed to send email to ${campaignRecipient.recipient.email}:`, error.message);

                campaignRecipient.status = 'failed';
                await campaignRecipient.save();

                failedEmails++;
            }
        }

        // 6. Update campaign status
        campaign.status = failedEmails === 0 ? 'sent' : 'failed';
        campaign.sentAt = new Date();

        await campaign.save();

        // 7. Send response
        return res.status(200).json({
            message: 'Campaign sending completed',
            totalRecipients: campaignRecipients.length,
            successfulEmails,
            failedEmails
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error sending campaign',
            error: error.message
        });
    }
};

console.log('Campaign controller loaded successfully');

console.log('Available exports:', Object.keys(exports));