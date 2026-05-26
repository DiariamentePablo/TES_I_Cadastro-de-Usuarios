const { verifyAccessToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ erro: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(403).json({ erro: 'Formato de token inválido' });
  }

  const token = parts[1];

  try {
    const decoded = verifyAccessToken(token);
    req.usuario = { id: decoded.id, roles: decoded.roles };
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;
