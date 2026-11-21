const Recipient = require('../models/recipientModel');


//add recipient
exports.addRecipient = async (req, res) => {
    try {
        const { name, email } = req.body;

        const newRecipient = await Recipient.create({
            name,
            email,
            user: req.user.id // 👈 Pulled automatically from the logged-in user's JWT token!
        });

        res.status(201).json({ message: 'Recipient added successfully', newRecipient });
    } catch (error) {

        // Handle duplicate email error for the same user
        if (error.code === 11000) {
            return res.status(400).json({ message: 'This email is already in your recipient list' });
        }
        res.status(500).json({ message: 'Error adding recipient', error: error.message });
    }
};


// Get all recipients for the logged-in user
exports.getAllRecipients = async (req, res) => {
    try {
        const recipients = await Recipient.find({ user: req.user.id });
        res.status(200).json({ 
            count: recipients.length, 
            recipients 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipients', error: error.message });
    }
};