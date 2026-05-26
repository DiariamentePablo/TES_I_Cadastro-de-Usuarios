const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_padrao';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS) || 7;

function generateAccessToken(usuario) {
  return jwt.sign(
    { id: usuario.id, roles: usuario.roles },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

function generateRefreshToken() {
  return uuidv4();
}

function getRefreshTokenExpiry() {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
  return expiry;
}

function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
  verifyAccessToken
};
