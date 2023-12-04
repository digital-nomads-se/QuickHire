import jwt from 'jsonwebtoken';
import logger from '../Utils/logger.js';

// Function to validate the token
const validateToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    logger.warn('Access denied, no token provided');
    return res.status(401).json({ success: false, message: 'Unauthorized Please login' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECREAT);
    req.user = decoded;
    logger.info('Token validated successfully'); 
    next();
  } catch (error) {
    logger.error('Invalid token', err); 
    return res.status(401).json({ success: false, message: 'Unauthorized Please login' });
  }
};

export default validateToken;