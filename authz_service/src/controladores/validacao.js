const UsuarioPapel = require('../modelos/usuarioPapel');

exports.validar = async (requisicao, resposta) => {
  try {
    const { usuarioId, permissao } = requisicao.query;
    if (!usuarioId || !permissao) {
      return resposta.status(400).json({
        erro: 'Os parametros usuarioId e permissao sao obrigatorios'
      });
    }
    const permitido = await UsuarioPapel.usuarioTemPermissao(usuarioId, permissao);
    resposta.json({
      permitido,
      usuarioId: Number(usuarioId),
      permissao
    });
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao validar permissao' });
  }
};

exports.validarLote = async (requisicao, resposta) => {
  try {
    const { usuarioId, permissoes } = requisicao.body;
    if (!usuarioId || !Array.isArray(permissoes)) {
      return resposta.status(400).json({
        erro: 'usuarioId e a lista permissoes sao obrigatorios'
      });
    }
    const permissoesDoUsuario = await UsuarioPapel.listarPermissoesDoUsuario(usuarioId);
    const conjuntoPermissoes = new Set(permissoesDoUsuario.map(p => p.nome));
    const resultado = {};
    for (const permissao of permissoes) {
      resultado[permissao] = conjuntoPermissoes.has(permissao);
    }
    resposta.json(resultado);
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro na validacao em lote' });
  }
};