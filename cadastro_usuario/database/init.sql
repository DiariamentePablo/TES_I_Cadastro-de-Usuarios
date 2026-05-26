-- PROVISORIO: Dev 2 (Pablo) substituirá/expandidá as tabelas de usuario e role
CREATE TABLE IF NOT EXISTS usuario (
  serial SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role (
  serial SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuario_role (
  usuario_id INTEGER REFERENCES usuario(serial),
  role_id INTEGER REFERENCES role(serial),
  PRIMARY KEY (usuario_id, role_id)
);

-- Responsabilidade do Dev 1: tabela de refresh tokens
CREATE TABLE IF NOT EXISTS refresh_token (
  serial SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuario(serial),
  token UUID NOT NULL UNIQUE,
  expira_em TIMESTAMP NOT NULL,
  revogado BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Seed de roles (PROVISORIO)
INSERT INTO role (nome)
VALUES ('admin'), ('user'), ('manager')
ON CONFLICT DO NOTHING;

-- Seed de usuario admin para teste (PROVISORIO)
-- Senha: admin123
INSERT INTO usuario (nome, email, senha_hash)
VALUES ('Admin', 'admin@teste.com', '$2b$10$s7qhKZ47qW2gelMVGNN3iOOG5P1zKogznXSgV/McZsN9butMHyrCG')
ON CONFLICT DO NOTHING;

-- Vincula usuario admin (id=1) a role admin (id=1) (PROVISORIO)
INSERT INTO usuario_role (usuario_id, role_id)
VALUES (1, 1)
ON CONFLICT DO NOTHING;
