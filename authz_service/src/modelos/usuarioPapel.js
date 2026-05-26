const banco = require('../config/banco');

exports.listarPapeisDoUsuario = async (usuarioId) => {
  const { rows } = await banco.consultar(`
    SELECT pa.*
    FROM usuarios_papeis up
    JOIN papeis pa ON pa.id = up.papel_id
    WHERE up.usuario_id = $1
    ORDER BY pa.nome
  `, [usuarioId]);
  return rows;
};

exports.listarPermissoesDoUsuario = async (usuarioId) => {
  const { rows } = await banco.consultar(`
    SELECT DISTINCT pe.nome, pe.recurso, pe.acao
    FROM usuarios_papeis up
    JOIN papeis_permissoes pp ON pp.papel_id = up.papel_id
    JOIN permissoes pe ON pe.id = pp.permissao_id
    WHERE up.usuario_id = $1
    ORDER BY pe.nome
  `, [usuarioId]);
  return rows;
};

exports.usuarioTemPermissao = async (usuarioId, nomePermissao) => {
  const { rows } = await banco.consultar(`
    SELECT 1
    FROM usuarios_papeis up
    JOIN papeis_permissoes pp ON pp.papel_id = up.papel_id
    JOIN permissoes pe ON pe.id = pp.permissao_id
    WHERE up.usuario_id = $1 AND pe.nome = $2
    LIMIT 1
  `, [usuarioId, nomePermissao]);
  return rows.length > 0;
};

exports.atribuirPapeis = async (usuarioId, papeisIds, atribuidoPor = null) => {
  if (!Array.isArray(papeisIds) || papeisIds.length === 0) return;
  const valores = papeisIds
    .map((_, i) => `($1, $${i + 2}, $${papeisIds.length + 2})`)
    .join(',');
  await banco.consultar(
    `INSERT INTO usuarios_papeis (usuario_id, papel_id, atribuido_por) VALUES ${valores}
     ON CONFLICT DO NOTHING`,
    [usuarioId, ...papeisIds, atribuidoPor]
  );
};

exports.removerPapel = async (usuarioId, papelId) => {
  const resultado = await banco.consultar(
    'DELETE FROM usuarios_papeis WHERE usuario_id = $1 AND papel_id = $2',
    [usuarioId, papelId]
  );
  return resultado.rowCount > 0;
};
