INSERT INTO papeis (nome, descricao, e_do_sistema) VALUES
  ('admin',    'Acesso total ao sistema',                  TRUE),
  ('gerente',  'Gerencia operacoes e visualiza relatorios', TRUE),
  ('operador', 'Realiza operacoes do dia a dia',           TRUE)
ON CONFLICT (nome) DO NOTHING;

INSERT INTO permissoes (nome, recurso, acao, descricao) VALUES
  ('usuarios:ler',      'usuarios', 'ler',      'Visualizar lista de usuarios'),
  ('usuarios:escrever', 'usuarios', 'escrever', 'Criar e editar usuarios'),
  ('usuarios:excluir',  'usuarios', 'excluir',  'Remover usuarios'),
  ('papeis:ler',        'papeis',   'ler',      'Visualizar papeis e permissoes'),
  ('papeis:escrever',   'papeis',   'escrever', 'Criar e editar papeis'),
  ('clientes:ler',      'clientes', 'ler',      'Visualizar clientes'),
  ('clientes:escrever', 'clientes', 'escrever', 'Criar e editar clientes'),
  ('clientes:excluir',  'clientes', 'excluir',  'Remover clientes'),
  ('relatorios:ler',    'relatorios','ler',     'Visualizar relatorios'),
  ('relatorios:gerar',  'relatorios','gerar',   'Gerar novos relatorios')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO papeis_permissoes (papel_id, permissao_id)
SELECT p.id, perm.id
FROM papeis p CROSS JOIN permissoes perm
WHERE p.nome = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO papeis_permissoes (papel_id, permissao_id)
SELECT p.id, perm.id
FROM papeis p, permissoes perm
WHERE p.nome = 'gerente'
  AND perm.nome IN (
    'usuarios:ler',
    'clientes:ler',
    'clientes:escrever',
    'relatorios:ler',
    'relatorios:gerar'
  )
ON CONFLICT DO NOTHING;

INSERT INTO papeis_permissoes (papel_id, permissao_id)
SELECT p.id, perm.id
FROM papeis p, permissoes perm
WHERE p.nome = 'operador'
  AND perm.nome IN ('clientes:ler', 'clientes:escrever')
ON CONFLICT DO NOTHING;
