const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');

const fetchUserID = (req) => {

  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if(token){
    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY); // Verify JWT token
        console.log(`decoded: ${decoded._id}`);
        return decoded._id; 
    } catch (error) {
        console.error("Invalid Token Provided");
    }
  }

  return null;
};


module.exports = fetchUserID;
