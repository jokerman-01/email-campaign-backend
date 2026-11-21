const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Get the Authorization header from the request
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // 2. Extract the token (split "Bearer <token>" and take the token part)
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the decoded user payload to req.user so controllers can use it
        req.user = decoded; 

        // 5. Move on to the next function (your controller)
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = verifyToken;