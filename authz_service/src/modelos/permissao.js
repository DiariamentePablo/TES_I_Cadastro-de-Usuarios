const banco = require('../config/banco');

exports.listarTodas = async () => {
  const { rows } = await banco.consultar(
    'SELECT * FROM permissoes ORDER BY recurso, acao'
  );
  return rows;
};

exports.buscarPorId = async (id) => {
  const { rows } = await banco.consultar('SELECT * FROM permissoes WHERE id = $1', [id]);
  return rows[0] || null;
};

exports.buscarPorNome = async (nome) => {
  const { rows } = await banco.consultar('SELECT * FROM permissoes WHERE nome = $1', [nome]);
  return rows[0] || null;
};

exports.criar = async ({ recurso, acao, descricao }) => {
  const nome = `${recurso}:${acao}`;
  const { rows } = await banco.consultar(
    `INSERT INTO permissoes (nome, recurso, acao, descricao)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nome, recurso, acao, descricao]
  );
  return rows[0];
};

exports.remover = async (id) => {
  const resultado = await banco.consultar('DELETE FROM permissoes WHERE id = $1', [id]);
  return resultado.rowCount > 0;
};
