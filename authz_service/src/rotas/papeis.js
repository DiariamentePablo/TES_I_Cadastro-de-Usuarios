const rotas = require('express').Router();
const controlador = require('../controladores/papeis');
const { exigirToken, exigirAdmin } = require('../middlewares/autenticacao');

rotas.get('/',    exigirToken, controlador.listar);
rotas.get('/:id', exigirToken, controlador.buscarPorId);

rotas.post('/',                                exigirToken, exigirAdmin, controlador.criar);
rotas.put('/:id',                              exigirToken, exigirAdmin, controlador.atualizar);
rotas.delete('/:id',                           exigirToken, exigirAdmin, controlador.remover);
rotas.post('/:id/permissoes',                  exigirToken, exigirAdmin, controlador.vincularPermissoes);
rotas.delete('/:id/permissoes/:permissaoId',   exigirToken, exigirAdmin, controlador.desvincularPermissao);

module.exports = rotas;
