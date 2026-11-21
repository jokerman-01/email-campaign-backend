const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    user: {
       type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    
},
{timestamps: true}
);

recipientSchema.index({ email: 1, user: 1 }, { unique: true });

const Recipient = mongoose.model('Recipient', recipientSchema);  
module.exports = Recipient;