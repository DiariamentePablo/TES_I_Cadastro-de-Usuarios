# TES I - Cadastro de Usuarios
Um microserviço de cadastro de usuários.

## Responsabilidades
- Login
- Senha
- Permissões
- JWT
- Refresh Token
- Recuperação de senha

## Links Relevantes
https://github.com/andreunigran/projeto_topicos  
https://sites.google.com/unigran.br/cursos/docker/modulo-1


# PROJETO TÓPICOS
## 2 microserviço e um app


# Microserviço valida_cpf

## Executar com Docker

```bash
docker-compose up --build
```

## Endpoint

### Validar CPF

GET `/validar/:cpf`

Exemplo:
```bash
curl http://localhost:3001/validar/12345678909
```

# Microserviço cliente_service

## Dependência

O serviço `valida_cpf` deve estar executando na porta `3001`.

## Executar

```bash
docker-compose up --build
```

## Endpoints

### Listar clientes
GET `/clientes`

### Buscar cliente
GET `/clientes/:id`

### Criar cliente
POST `/clientes`

Exemplo:
```json
{
  "nome": "João Silva",
  "cpf": "12345678909",
  "data_nascimento": "1990-01-01",
  "endereco": "Rua A",
  "cidade": 1
}
```

### Atualizar cliente
PUT `/clientes/:id`

### Remover cliente
DELETE `/clientes/:id`


# Frontend Cliente Service com Docker

Frontend HTML puro utilizando Material Design e JavaScript.

## Executar com Docker

### Requisitos

- Docker
- Docker Compose

## Subir aplicação

Na pasta do projeto execute:

```bash
docker compose up --build
```

ou:

```bash
docker-compose up --build
```

## Acessar

Abra no navegador:

```text
http://localhost:8080
```

## Backend

O backend deve estar executando em:

```text
http://localhost:3000
```

## Funcionalidades

- Cadastro de clientes
- Edição
- Exclusão
- Listagem
- Material Design
- Requisições Fetch API

## Estrutura

- index.html
- styles.css
- app.js
- Dockerfile
- docker-compose.yml
- nginx.conf


## Enzo
3. Frontend: Acesso e Controle de Estado (Dev 3)
Esta pessoa vai conectar o frontend com o motor de autenticação (Dev 1) e garantir que o app inteiro saiba quem está logado.

Telas Principais: Interface de Login e Cadastro.

Gerenciamento de Estado: Configurar o estado global da aplicação (armazenar se o usuário está logado, seus dados básicos e suas permissões para esconder/mostrar menus).

Segurança no Client: Lógica de armazenamento seguro do JWT e do Refresh Token (ex: Secure Storage no mobile ou HttpOnly Cookies / Session Storage na web).

Interceptors HTTP: Criar a configuração do cliente HTTP (ex: Axios ou Dio) para injetar automaticamente o JWT em todas as requisições e tentar o Refresh Token silenciosamente caso receba um erro 401.


## Pablo

2. Backend: Identidade e Gestão (Dev 2)
Esta pessoa focará nas regras de negócio da conta do usuário e nos processos assíncronos.

Modelagem e CRUD de Usuários: Criação, edição e bloqueio de contas.

Sistema de Permissões: Estruturar como as permissões e roles (admin, user, manager) são vinculadas aos usuários no banco de dados.

Recuperação de Senha: Criar o fluxo de geração de token temporário (com validade de tempo), armazenamento desse token e disparo do e-mail com o link de recuperação.

Redefinição de Senha: O endpoint que recebe o token do e-mail e a nova senha, aplica o hash e atualiza o banco.


## Allan
1. Backend: Core de Autenticação (Dev 1)
Esta pessoa cuidará do "motor" de segurança. O foco aqui não é o dado do usuário em si, mas sim garantir que quem está batendo na porta é quem diz ser.

Login & Validação de Credenciais: Receber usuário/senha, aplicar hash e comparar com o banco.

Geração e Assinatura de JWT: Criar o token contendo o payload básico (ID do usuário e roles).

Refresh Token: Criar a lógica de emissão, armazenamento seguro no banco (para poder revogar, se necessário) e renovação do JWT expirado.

Middlewares de Segurança: Criar os filtros/interceptors do backend que validarão o JWT nas rotas privadas.

## Matheus

4. Frontend: Fluxos de Gestão (Dev 4)
Esta pessoa focará nas interfaces de administração, na jornada de recuperação e na experiência do usuário (UX).

Fluxo de Recuperação: Telas de "Esqueci minha senha" (input de e-mail), tela de feedback ("Verifique seu e-mail") e a tela final de "Criar nova senha" (lendo o token da URL).

Painel de Permissões: Interface onde um administrador pode buscar usuários e atribuir ou remover permissões/roles.

Gestão de Perfil: Tela para o usuário alterar seus próprios dados (nome, e-mail, foto).

Validações Visuais: Garantir que todos os formulários tenham validações fortes e mensagens de erro amigáveis (ex: "A senha deve conter 8 caracteres").

## Ygor de Andrade

3. Backend: Autorização e Permissões / AuthZ (Dev 5 - NOVO)
Este desenvolvedor vai construir o IAM (Identity and Access Management). Ele foca apenas nas regras de negócio de acesso. Responde à pergunta: "Essa pessoa tem permissão para fazer isso?"

Gestão de Roles: Criar papéis (Admin, Gerente, Operador).

Gestão de Permissões Granulares: Relacionar ações específicas aos papéis (ex: users:read, reports:write).

Motor de Validação: Criar o serviço (ou middleware compartilhado) que os outros microsserviços vão consultar para saber se o usuário X pode acessar o recurso Y.

Vínculo Usuário-Role: A tabela que liga o ID do usuário aos papéis que ele possui.