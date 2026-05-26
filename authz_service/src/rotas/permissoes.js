const rotas = require('express').Router();
const controlador = require('../controladores/permissoes');
const { exigirToken, exigirAdmin } = require('../middlewares/autenticacao');

rotas.get('/',       exigirToken,               controlador.listar);
rotas.post('/',      exigirToken, exigirAdmin,  controlador.criar);
rotas.delete('/:id', exigirToken, exigirAdmin,  controlador.remover);

module.exports = rotas;
