// middleware/authMiddleware.js - Enhanced with debug logging
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    console.log('🔍 AUTH MIDDLEWARE DEBUG:', {
      hasAuthHeader: !!authHeader,
      authHeaderValue: authHeader ? `${authHeader.substring(0, 30)}...` : 'No header'
    });

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token not found in Authorization header' });
    }

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET);
    
    console.log('🔑 TOKEN DECODED SUCCESSFULLY:', {
      decodedPayload: decoded,
      hasId: !!decoded.id,
      hasDoctorId: !!decoded.doctor_id,
      hasPatientId: !!decoded.patient_id,
      type: decoded.type || 'no type specified'
    });

    // Attach user to request object
    req.user = decoded;
    
    console.log('👤 USER ATTACHED TO REQUEST:', req.user);
    
    next();
    
  } catch (error) {
    console.error('❌ AUTH MIDDLEWARE ERROR:', {
      errorName: error.name,
      errorMessage: error.message,
      isJWTError: error.name === 'JsonWebTokenError',
      isTokenExpired: error.name === 'TokenExpiredError'
    });

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else {
      return res.status(401).json({ message: 'Token verification failed' });
    }
  }
};

module.exports = authMiddleware;