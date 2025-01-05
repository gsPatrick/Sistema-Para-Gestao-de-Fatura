# Projeto de Gerenciamento de Pessoas e Faturas

Este projeto é uma aplicação web desenvolvida com Next.js no front-end e Nest.js no back-end, que permite o gerenciamento de pessoas, faturas e suas associações.

## Pré-requisitos

*   [Docker Desktop](https://www.docker.com/products/docker-desktop)
*   [Git](https://git-scm.com/)

## Como Executar o Projeto

1. **Clone o repositório:**

    ```bash
    git clone <URL do seu repositório>
    cd <nome-da-pasta-do-repositorio>
    ```

2. **Configure as variáveis de ambiente:**

    *   Copie o arquivo `back-end/.env.example` para `back-end/.env` e preencha as variáveis de ambiente conforme necessário (configurações do banco de dados, etc.).
    *   Copie o arquivo `front-end/.env.example` para `front-end/.env` e defina a variável `NEXT_PUBLIC_API_BASE_URL` como `http://localhost:3001` (ou a porta em que seu back-end está rodando).

3. **Construa e execute os contêineres:**

    ```bash
    docker-compose up -d --build
    ```

    Este comando irá:

    *   Construir as imagens Docker para o back-end e o front-end.
    *   Criar e iniciar os contêineres em modo detached (`-d`).

4. **Acesse a aplicação:**

    *   **Front-end:** `http://localhost:3000`
    *   **Back-end:** `http://localhost:3001`

## Funcionalidades Implementadas

### Back-end (Nest.js)

*   **Módulos:**
    *   `PersonModule`: Gerenciamento de pessoas (CRUD).
    *   `InvoiceModule`: Gerenciamento de faturas (CRUD).
    *   `InvoiceTypeModule`: Gerenciamento de tipos de faturas.
    *   `StatusTypeModule`: Gerenciamento de status de pessoas.
    *   `PersonInvoiceModule`: Relacionamento entre pessoas e faturas (tabela associativa).
    *   `AddressModule`: Gerenciamento de endereços.
    *   `ClassificationModule`: Gerenciamento de classificações de pessoas.
    *   `PersonClassificationModule`: Relacionamento entre pessoas e classificações.
    *   `AuthModule`: Autenticação de usuários.

*   **Endpoints da API (resumo):**
    *   `POST /person`: Cria uma nova pessoa.
    *   `GET /person`: Lista todas as pessoas.
    *   `GET /person/:id`: Busca uma pessoa pelo ID.
    *   `PUT /person/:id`: Atualiza uma pessoa.
    *   `DELETE /person/:id`: Exclui uma pessoa.
    *   `DELETE /person/:personId/address/:addressId`: Remove um endereço de uma pessoa.
    *   `POST /invoice`: Cria uma nova fatura.
    *   `GET /invoice`: Lista todas as faturas.
    *   `GET /invoice/:id`: Busca uma fatura pelo ID.
    *   `PUT /invoice/:id`: Atualiza uma fatura.
    *   `DELETE /invoice/:id`: Exclui uma fatura.
    *   `POST /invoice/:invoiceId/persons`: Associa uma fatura a múltiplas pessoas.
    *   `DELETE /invoice/:invoiceId/persons`: Remove a associação de uma fatura com múltiplas pessoas.
    *   `PATCH /invoice/:invoiceId/person/:personId`: Atualiza os campos `paid_at`, `cancelled_at` e `enable` da associação entre uma pessoa e uma fatura (tabela `person_invoice`).
    *   `GET /classification`: Lista todas as classificações.
    *   `POST /classification`: Cria uma nova classificação.
    *   `POST /auth/login`: Autentica um usuário.
    *   `POST /auth/register`: Cadastra um novo usuário.

### Front-end (Next.js)

*   **Páginas:**
    *   `/`: Página inicial, listagem de pessoas (`index.tsx`).
    *   `/invoice`: Listagem de faturas (`invoice/index.tsx`).
    *   `/invoice/create`: Formulário de criação de faturas. (`invoice/create.tsx`).
    *   `/login`: Formulário de login do usuário (`login.tsx`)

*   **Componentes:**
    *   `PersonForm`: Formulário para criação e edição de pessoas.
    *   `PersonInvoiceForm`: Formulário para edição dos campos `paid_at`, `cancelled_at` e `enable` da associação entre pessoa e fatura.
    *   `withAuth`: HOC (Higher-Order Component) para proteger rotas que exigem autenticação.

*   **Funcionalidades da Listagem de Pessoas (`index.tsx`):**
    *   **Criação de Pessoa:**
        *   Modal com o componente `PersonForm`.
        *   Permite adicionar nome completo, apelido, status, celular, Instagram, ativar/desativar, múltiplos endereços e múltiplas classificações.
    *   **Edição de Pessoa:**
        *   Modal com o componente `PersonForm`.
        *   Permite editar os dados da pessoa.
    *   **Visualização de Detalhes da Pessoa:**
        *   Modal que exibe todos os dados da pessoa, incluindo endereços, classificações e faturas associadas.
        *   **Listagem de Faturas:**
            *   Exibe as faturas associadas à pessoa.
            *   Botão "Editar" para cada fatura, que abre o modal com o `PersonInvoiceForm`.
    *   **Edição de Fatura (PersonInvoiceForm):**
        *   Modal com o componente `PersonInvoiceForm`.
        *   Permite editar os campos `paid_at`, `cancelled_at` e `enable` de uma fatura específica para uma pessoa.

## Autenticação

O projeto implementa autenticação de usuários utilizando JWT (JSON Web Tokens).

### Fluxo de Autenticação

1. **Login (`POST /auth/login`):**
    *   O usuário envia suas credenciais (e-mail e senha) para o endpoint `POST /auth/login` no back-end através da página `/login`.
    *   O back-end verifica as credenciais e, se forem válidas, gera um token JWT.
    *   O token JWT é enviado de volta para o front-end no corpo da resposta e armazenado no `localStorage`.

2. **Registro (`POST /auth/register`):**
    *   O usuário preenche o formulário de cadastro com seus dados e envia para o endpoint `POST /auth/register` no back-end.
    *   O back-end cria um novo usuário no banco de dados.

3. **Rotas Protegidas:**
    *   O front-end envia o token JWT no cabeçalho `Authorization` de cada requisição para rotas protegidas.
    *   O back-end verifica a validade do token JWT antes de processar a requisição.
    *   O componente `withAuth` é usado para proteger as rotas no front-end, permitindo acesso apenas a usuários autenticados.

4. **Logout:**
    *   O front-end remove o token JWT do `localStorage`, invalidando a sessão do usuário.

## Rotas do Next.js e Estrutura de Pastas

| Rota                    | Arquivo                             | Descrição                                                                                                   |
| ----------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/`                     | `pages/index.tsx`                    | Página inicial do projeto, listagem de pessoas com opção de criar, editar, ver detalhes e excluir.         |
| `/invoice`              | `pages/invoice/index.tsx`             | Listagem de faturas,  com opção de criar.                                                                     |
| `/invoice/create`       | `pages/invoice/create.tsx`          | Formulário para criar uma nova fatura.                                                                   |
| `/login`                | `pages/login.tsx`                   | Formulário para login do usuário                                                                            |

*   **Estrutura de pastas do front-end:**

*   

## Contribuições

Contribuições são bem-vindas! Se você quiser contribuir com o projeto, siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para a sua feature (`git checkout -b feature/sua-feature`).
3. Faça commit das suas alterações (`git commit -m 'Adicionando nova feature'`).
4. Faça push para a branch (`git push origin feature/sua-feature`).
5. Abra um Pull Request.
