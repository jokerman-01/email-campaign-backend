const mongose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
   
    phone: {
        type: String,
        required: true,
        unique: true
    },
    googleEmail: {
    type: String,
    default: null
},

googleRefreshToken: {
    type: String,
    default: null,
    select: false
},

googleConnected: {
    type: Boolean,
    default: false
}
   
},
{timestamps: true}
);


const Users = mongose.model('User', userSchema);  
module.exports = Users;