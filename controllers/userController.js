const Users = require('../models/userModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

//create User
exports.createUsers = async (req, res) => {
    try {
        //request body
        const { name, email, password, gender, phone,} = req.body;
        
        //check if all required fields are provided
       if (!req.body.name || !req.body.email || !req.body.password ||!req.body.gender || !req.body.phone){
        return res.status(400).json({message: 'Please provide all required fields'});
       }
       
        //email check
        const extinguisher = await User.findOne({ email: req.body.email});
        if(extinguisher){
            return res.status(400).json({ message: 'Email already exists'});
        }

        //phone number check
        const existingPhone = await User.findOne({phone: req.body.phone});
        if (existingPhone){
            return res.status(400).json({message:'phone number already exists'});
        
        }
        //encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
        //create new user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            gender: req.body.gender,
            
        });

        await user.save();
        res.status(201).json({ message: 'user created succesfully, user'});
    } catch (error) {
    console.log(error);

    res.status(500).json({
        message: 'Cannot create user',
        error: error.message
    });
}
};

//log in user
exports.loginUser = async (req, res) => {
    try {
        const { email, password} = req.body;
        //check if all required field are provided
        if (!email || !password) {
            return res.status(400).json({message: 'Please provide all required fields'});
        }

        //check if user exist
        const user = await User.findOne ({email: email});
        if (!user){
            return res.status (400).json({message:'User does not exist'});
        }

        //check if pass word is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            return res.status(400).json({message:'Invalid password'})
        }

        

         //generate json web token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

    res.status(200).json({message:'Login successful', token});
    
    }catch (error) {
        res.status(500).json({message:'Error logging in', error: error.message});
    }

   
};