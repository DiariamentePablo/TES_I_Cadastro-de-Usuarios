const rotas = require('express').Router();
const controlador = require('../controladores/validacao');

rotas.get('/',      controlador.validar);
rotas.post('/lote', controlador.validarLote);

module.exports = rotas;