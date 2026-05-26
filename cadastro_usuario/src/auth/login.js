const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } = require('../utils/jwt');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  try {
    const userResult = await db.query(
      `SELECT u.serial, u.nome, u.email, u.senha_hash, u.ativo,
              COALESCE(array_agg(r.nome) FILTER (WHERE r.nome IS NOT NULL), '{}') AS roles
       FROM usuario u
       LEFT JOIN usuario_role ur ON ur.usuario_id = u.serial
       LEFT JOIN role r ON r.serial = ur.role_id
       WHERE u.email = $1
       GROUP BY u.serial`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const usuario = userResult.rows[0];

    if (!usuario.ativo) {
      return res.status(403).json({ erro: 'Conta desativada' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const tokenPayload = {
      id: usuario.serial,
      roles: usuario.roles
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken();
    const refreshTokenExpiry = getRefreshTokenExpiry();

    await db.query(
      `INSERT INTO refresh_token (usuario_id, token, expira_em)
       VALUES ($1, $2, $3)`,
      [usuario.serial, refreshToken, refreshTokenExpiry]
    );

    res.json({
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.serial,
        nome: usuario.nome,
        email: usuario.email,
        roles: usuario.roles
      }
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
