const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
         required: [true, 'Campaign title is required'],
        trim: true
    },
    subject: {
        type: String,
       required: [true, 'Campaign title is required'],
        trim: true    
    },
    body: {
        type: String,
        required: [true, 'Campaign title is required'],
        
    },
    user: {
       type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'failed'],
        default: 'draft'
    },
   
    sentAt: {
        type: Date
    }
    
},
{timestamps: true}
);

//recipientSchema.index({ email: 1, user: 1 }, { unique: true });

const Campaign = mongoose.model('Campaign', campaignSchema);  
module.exports = Campaign;