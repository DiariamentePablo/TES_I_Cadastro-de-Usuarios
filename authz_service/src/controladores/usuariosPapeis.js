const UsuarioPapel = require('../modelos/usuarioPapel');

exports.listarPapeis = async (requisicao, resposta) => {
  try {
    const papeis = await UsuarioPapel.listarPapeisDoUsuario(requisicao.params.usuarioId);
    resposta.json(papeis);
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao buscar papeis do usuario' });
  }
};

exports.listarPermissoes = async (requisicao, resposta) => {
  try {
    const permissoes = await UsuarioPapel.listarPermissoesDoUsuario(
      requisicao.params.usuarioId
    );
    resposta.json(permissoes);
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao buscar permissoes do usuario' });
  }
};

exports.atribuirPapeis = async (requisicao, resposta) => {
  try {
    const { papeisIds } = requisicao.body;
    if (!Array.isArray(papeisIds)) {
      return resposta.status(400).json({ erro: 'papeisIds deve ser uma lista' });
    }
    const atribuidoPor = requisicao.usuario ? requisicao.usuario.id : null;
    await UsuarioPapel.atribuirPapeis(
      requisicao.params.usuarioId,
      papeisIds,
      atribuidoPor
    );
    const papeis = await UsuarioPapel.listarPapeisDoUsuario(requisicao.params.usuarioId);
    resposta.json(papeis);
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao atribuir papeis' });
  }
};

exports.removerPapel = async (requisicao, resposta) => {
  try {
    const removido = await UsuarioPapel.removerPapel(
      requisicao.params.usuarioId,
      requisicao.params.papelId
    );
    if (!removido) return resposta.status(404).json({ erro: 'Vinculo nao encontrado' });
    resposta.status(204).send();
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao remover papel do usuario' });
  }
};
