const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ erro: 'Refresh token é obrigatório' });
  }

  try {
    const result = await db.query(
      'UPDATE refresh_token SET revogado = TRUE WHERE token = $1 AND revogado = FALSE RETURNING serial',
      [refreshToken]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Refresh token não encontrado ou já revogado' });
    }

    res.json({ mensagem: 'Logout realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
