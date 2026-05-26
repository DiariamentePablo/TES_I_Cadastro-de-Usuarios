const banco = require('../config/banco');

exports.listarTodos = async () => {
  const { rows } = await banco.consultar('SELECT * FROM papeis ORDER BY id');
  return rows;
};

exports.buscarPorId = async (id) => {
  const { rows } = await banco.consultar('SELECT * FROM papeis WHERE id = $1', [id]);
  return rows[0] || null;
};

exports.buscarPorNome = async (nome) => {
  const { rows } = await banco.consultar('SELECT * FROM papeis WHERE nome = $1', [nome]);
  return rows[0] || null;
};

exports.criar = async ({ nome, descricao }) => {
  const { rows } = await banco.consultar(
    'INSERT INTO papeis (nome, descricao) VALUES ($1, $2) RETURNING *',
    [nome, descricao]
  );
  return rows[0];
};

exports.atualizar = async (id, { nome, descricao }) => {
  const { rows } = await banco.consultar(
    'UPDATE papeis SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *',
    [nome, descricao, id]
  );
  return rows[0] || null;
};

exports.remover = async (id) => {
  const papel = await exports.buscarPorId(id);
  if (!papel) return false;
  if (papel.e_do_sistema) {
    throw new Error('Nao eh permitido excluir papeis do sistema');
  }
  await banco.consultar('DELETE FROM papeis WHERE id = $1', [id]);
  return true;
};

exports.buscarComPermissoes = async (id) => {
  const { rows } = await banco.consultar(`
    SELECT
      pa.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', pe.id,
            'nome', pe.nome,
            'recurso', pe.recurso,
            'acao', pe.acao
          )
        ) FILTER (WHERE pe.id IS NOT NULL),
        '[]'
      ) AS permissoes
    FROM papeis pa
    LEFT JOIN papeis_permissoes pp ON pp.papel_id = pa.id
    LEFT JOIN permissoes pe ON pe.id = pp.permissao_id
    WHERE pa.id = $1
    GROUP BY pa.id
  `, [id]);
  return rows[0] || null;
};

exports.vincularPermissoes = async (papelId, permissoesIds) => {
  if (!Array.isArray(permissoesIds) || permissoesIds.length === 0) return;
  const valores = permissoesIds.map((_, i) => `($1, $${i + 2})`).join(',');
  await banco.consultar(
    `INSERT INTO papeis_permissoes (papel_id, permissao_id) VALUES ${valores}
     ON CONFLICT DO NOTHING`,
    [papelId, ...permissoesIds]
  );
};

exports.desvincularPermissao = async (papelId, permissaoId) => {
  await banco.consultar(
    'DELETE FROM papeis_permissoes WHERE papel_id = $1 AND permissao_id = $2',
    [papelId, permissaoId]
  );
};
