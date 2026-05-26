const rotas = require('express').Router();
const controlador = require('../controladores/usuariosPapeis');
const { exigirToken, exigirAdmin } = require('../middlewares/autenticacao');

rotas.get('/:usuarioId/papeis',     exigirToken, controlador.listarPapeis);
rotas.get('/:usuarioId/permissoes', exigirToken, controlador.listarPermissoes);

rotas.post('/:usuarioId/papeis',           exigirToken, exigirAdmin, controlador.atribuirPapeis);
rotas.delete('/:usuarioId/papeis/:papelId', exigirToken, exigirAdmin, controlador.removerPapel);

module.exports = rotas;
