const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  //console.log('Headers:', req.headers);  // Debug print all headers

  const authHeader = req.headers['authorization'];
  //console.log('Authorization Header:', authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  //console.log('Extracted Token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
