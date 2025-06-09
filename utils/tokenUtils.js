const jwt = require("jsonwebtoken");

exports.generateToken = (payload, expiresIn = '10m') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

exports.verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
