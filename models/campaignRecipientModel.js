const mongoose = require('mongoose');

const campaignRecipientSchema = new mongoose.Schema({
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipient',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent',  'delivered', 'failed'],
        default: 'pending'
    },
    errorMessage: {
        type: String
    },
    sentAt: {
        type: Date
    }
}, {
    timestamps: true
});

const CampaignRecipient = mongoose.model('CampaignRecipient', campaignRecipientSchema);

module.exports = CampaignRecipient;