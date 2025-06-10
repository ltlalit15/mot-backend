const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract the token from the Authorization header

  if (!token) {
    return res.status(403).json({
      status: false,
      message: "No token provided"
    });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user information to the request object
    req.user = decoded;
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({
      status: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authenticateJWT;
