require('dotenv').config();
const express = require('express');
const cors = require('cors');

const rotasPapeis     = require('./rotas/papeis');
const rotasPermissoes = require('./rotas/permissoes');
const rotasUsuarios   = require('./rotas/usuarios');
const rotasValidacao  = require('./rotas/validacao');

const app = express();

app.use(cors());
app.use(express.json());

app.use((requisicao, _resposta, proximo) => {
  console.log(
    `[${new Date().toISOString()}] ${requisicao.method} ${requisicao.url}`
  );
  proximo();
});

app.get('/saude', (_requisicao, resposta) =>
  resposta.json({ status: 'ok', servico: 'servico_permissoes' })
);

app.use('/papeis',     rotasPapeis);
app.use('/permissoes', rotasPermissoes);
app.use('/usuarios',   rotasUsuarios);
app.use('/validar',    rotasValidacao);

app.use((_requisicao, resposta) =>
  resposta.status(404).json({ erro: 'Rota nao encontrada' })
);

const PORTA = process.env.PORTA || 3002;
app.listen(PORTA, () => {
  console.log(`[servico_permissoes] rodando na porta ${PORTA}`);
});