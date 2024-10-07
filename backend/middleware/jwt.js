const jwt = require('jsonwebtoken');

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(401).json({  
        "message": "Access denied! no token provided." 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY); // Verify JWT token
    req.body._id = decoded._id; 
    next(); 
    
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authenticateJWT;