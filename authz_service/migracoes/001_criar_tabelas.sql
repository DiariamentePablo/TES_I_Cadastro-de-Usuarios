CREATE TABLE IF NOT EXISTS papeis (
  id            SERIAL PRIMARY KEY,
  nome          VARCHAR(50) UNIQUE NOT NULL,
  descricao     TEXT,
  e_do_sistema  BOOLEAN DEFAULT FALSE,
  criado_em     TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS permissoes (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) UNIQUE NOT NULL,
  recurso     VARCHAR(50) NOT NULL,
  acao        VARCHAR(50) NOT NULL,
  descricao   TEXT,
  criado_em   TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS papeis_permissoes (
  papel_id      INT REFERENCES papeis(id) ON DELETE CASCADE,
  permissao_id  INT REFERENCES permissoes(id) ON DELETE CASCADE,
  PRIMARY KEY (papel_id, permissao_id)
);
CREATE TABLE IF NOT EXISTS usuarios_papeis (
  usuario_id    INT NOT NULL,
  papel_id      INT REFERENCES papeis(id) ON DELETE CASCADE,
  atribuido_por INT,
  atribuido_em  TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (usuario_id, papel_id)
);
CREATE INDEX IF NOT EXISTS idx_usuarios_papeis_usuario ON usuarios_papeis(usuario_id);
CREATE INDEX IF NOT EXISTS idx_papeis_permissoes_papel ON papeis_permissoes(papel_id);
CREATE INDEX IF NOT EXISTS idx_permissoes_nome ON permissoes(nome);