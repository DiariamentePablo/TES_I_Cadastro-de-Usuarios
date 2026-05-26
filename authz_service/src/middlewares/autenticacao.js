const jwt = require('jsonwebtoken');

exports.exigirToken = (requisicao, resposta, proximo) => {
  const cabecalho = requisicao.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return resposta.status(401).json({ erro: 'Token nao fornecido' });
  }

  const token = cabecalho.slice(7);

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    requisicao.usuario = {
      id:     dados.sub || dados.userId || dados.id,
      papeis: dados.papeis || dados.roles || [],
    };
    proximo();
  } catch (erro) {
    return resposta.status(401).json({ erro: 'Token invalido ou expirado' });
  }
};

exports.exigirAdmin = (requisicao, resposta, proximo) => {
  if (!requisicao.usuario || !requisicao.usuario.papeis.includes('admin')) {
    return resposta.status(403).json({ erro: 'Acesso restrito a administradores' });
  }
  proximo();
};
