const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.POSTGRES_HOST     || 'localhost',
  port:     process.env.POSTGRES_PORT     || 5432,
  user:     process.env.POSTGRES_USER     || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DB       || 'permissoes',
});

pool.on('error', (erro) => {
  console.error('[BANCO] Erro inesperado:', erro);
});

module.exports = {
  consultar: (sql, parametros) => pool.query(sql, parametros),
  pool,
};
