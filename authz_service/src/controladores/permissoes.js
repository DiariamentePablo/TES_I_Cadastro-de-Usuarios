const Permissao = require('../modelos/permissao');

exports.listar = async (requisicao, resposta) => {
  try {
    const permissoes = await Permissao.listarTodas();
    resposta.json(permissoes);
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao listar permissoes' });
  }
};

exports.criar = async (requisicao, resposta) => {
  try {
    const { recurso, acao, descricao } = requisicao.body;
    if (!recurso || !acao) {
      return resposta.status(400).json({
        erro: 'Os campos recurso e acao sao obrigatorios'
      });
    }
    const nome = `${recurso}:${acao}`;
    const existente = await Permissao.buscarPorNome(nome);
    if (existente) {
      return resposta.status(409).json({ erro: 'Permissao ja cadastrada' });
    }
    const permissao = await Permissao.criar({ recurso, acao, descricao });
    resposta.status(201).json(permissao);
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao criar permissao' });
  }
};

exports.remover = async (requisicao, resposta) => {
  try {
    const removida = await Permissao.remover(requisicao.params.id);
    if (!removida) return resposta.status(404).json({ erro: 'Permissao nao encontrada' });
    resposta.status(204).send();
  } catch (erro) {
    console.error(erro);
    resposta.status(500).json({ erro: 'Erro ao remover permissao' });
  }
};
