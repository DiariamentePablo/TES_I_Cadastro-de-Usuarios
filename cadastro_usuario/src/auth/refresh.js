const express = require('express');
const db = require('../db');
const { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } = require('../utils/jwt');

const router = express.Router();

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ erro: 'Refresh token é obrigatório' });
  }

  try {
    const tokenResult = await db.query(
      `SELECT rt.*, u.serial AS usuario_id, u.nome, u.email, u.ativo
       FROM refresh_token rt
       JOIN usuario u ON u.serial = rt.usuario_id
       WHERE rt.token = $1`,
      [refreshToken]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(401).json({ erro: 'Refresh token inválido' });
    }

    const tokenData = tokenResult.rows[0];

    if (tokenData.revogado) {
      return res.status(401).json({ erro: 'Refresh token revogado' });
    }

    if (new Date(tokenData.expira_em) < new Date()) {
      return res.status(401).json({ erro: 'Refresh token expirado' });
    }

    if (!tokenData.ativo) {
      return res.status(403).json({ erro: 'Conta desativada' });
    }

    await db.query(
      'UPDATE refresh_token SET revogado = TRUE WHERE serial = $1',
      [tokenData.serial]
    );

    const rolesResult = await db.query(
      `SELECT r.nome FROM usuario_role ur
       JOIN role r ON r.serial = ur.role_id
       WHERE ur.usuario_id = $1`,
      [tokenData.usuario_id]
    );

    const roles = rolesResult.rows.map(r => r.nome);

    const tokenPayload = {
      id: tokenData.usuario_id,
      roles
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenExpiry = getRefreshTokenExpiry();

    await db.query(
      `INSERT INTO refresh_token (usuario_id, token, expira_em)
       VALUES ($1, $2, $3)`,
      [tokenData.usuario_id, newRefreshToken, newRefreshTokenExpiry]
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
