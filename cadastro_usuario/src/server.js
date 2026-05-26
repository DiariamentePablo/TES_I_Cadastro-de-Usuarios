require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const authMiddleware = require('./middleware/authMiddleware');
const loginRouter = require('./auth/login');
const refreshRouter = require('./auth/refresh');
const logoutRouter = require('./auth/logout');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.use('/auth', loginRouter);
app.use('/auth', refreshRouter);
app.use('/auth', logoutRouter);

app.get('/auth/protegido', authMiddleware, (req, res) => {
  res.json({
    mensagem: 'Rota protegida acessada com sucesso',
    usuario: req.usuario
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor cadastro_usuario executando na porta ${PORT}`);
});
