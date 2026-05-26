const Papel = require('../modelos/papel');

exports.listar = async (requisicao, resposta) => {
  try {
    const papeis = await Papel.listarTodos();
    resposta.json(papeis);
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao listar papeis' });
  }
};

exports.buscarPorId = async (requisicao, resposta) => {
  try {
    const papel = await Papel.buscarComPermissoes(requisicao.params.id);
    if (!papel) return resposta.status(404).json({ erro: 'Papel nao encontrado' });
    resposta.json(papel);
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao buscar papel' });
  }
};

exports.criar = async (requisicao, resposta) => {
  try {
    const { nome, descricao } = requisicao.body;
    if (!nome) return resposta.status(400).json({ erro: 'O campo nome eh obrigatorio' });
    const existente = await Papel.buscarPorNome(nome);
    if (existente) return resposta.status(409).json({ erro: 'Ja existe um papel com esse nome' });
    const papel = await Papel.criar({ nome, descricao });
    resposta.status(201).json(papel);
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao criar papel' });
  }
};

exports.atualizar = async (requisicao, resposta) => {
  try {
    const { nome, descricao } = requisicao.body;
    const papel = await Papel.atualizar(requisicao.params.id, { nome, descricao });
    if (!papel) return resposta.status(404).json({ erro: 'Papel nao encontrado' });
    resposta.json(papel);
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao atualizar papel' });
  }
};

exports.remover = async (requisicao, resposta) => {
  try {
    const removido = await Papel.remover(requisicao.params.id);
    if (!removido) return resposta.status(404).json({ erro: 'Papel nao encontrado' });
    resposta.status(204).send();
  } catch (erro) {
    if (erro.message.includes('sistema')) {
      return resposta.status(403).json({ erro: erro.message });
    }
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao remover papel' });
  }
};

exports.vincularPermissoes = async (requisicao, resposta) => {
  try {
    const { permissoesIds } = requisicao.body;
    if (!Array.isArray(permissoesIds)) {
      return resposta.status(400).json({ erro: 'permissoesIds deve ser uma lista' });
    }
    await Papel.vincularPermissoes(requisicao.params.id, permissoesIds);
    const papel = await Papel.buscarComPermissoes(requisicao.params.id);
    resposta.json(papel);
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao vincular permissoes' });
  }
};

exports.desvincularPermissao = async (requisicao, resposta) => {
  try {
    await Papel.desvincularPermissao(
      requisicao.params.id,
      requisicao.params.permissaoId
    );
    resposta.status(204).send();
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao desvincular permissao' });
  }
};
