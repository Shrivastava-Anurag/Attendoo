const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    console.log(req.headers);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // No token provided, continue without authentication
        return next();
    }
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            // Token verification failed, log the error
            console.log('Token verification failed:', err);
            // Token is invalid, continue without authentication
            return res.status(401).json({ error: 'Unauthorized token' });
        }
        // Token verification succeeded, log the decoded token
        console.log('Decoded token:', decoded);
        // Token is valid, set the user object on the request
        req.user = decoded;
        next(); // Move to the next middleware or route handler
    });
};

module.exports = authenticateUser;

//Random comment
