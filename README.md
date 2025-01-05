
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
    *   `PersonInvoiceModule`:  Relacionamento entre pessoas e faturas (tabela associativa).
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
    *   `GET /person/:id/invoices`: Lista as faturas de uma pessoa. (Implementado no front-end buscando todas as faturas e filtrando por personId). **(Ponto de melhoria: Implementar esse endpoint no back-end)**
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
    * `POST /auth/login`: Autentica um usuário.
    * `POST /auth/register`: Cadastra um novo usuário.

### Front-end (Next.js)

*   **Páginas:**
    *   `/`: Página inicial (provavelmente o `index.tsx`).
    *   `/association`: **Página de Associação** (`association.tsx`) - Lista todas as pessoas e suas faturas associadas. Ao clicar em uma pessoa, navega para `/person/:personId/invoices`.
    *   `/invoice/:invoiceId/edit`: **Página de Edição de Fatura** (`edit.tsx`) - Permite editar os campos `paid_at`, `cancelled_at` e `enable` de uma fatura específica para uma pessoa. Acessível a partir da listagem de faturas.
    *   `/person/:personId/invoices`: **Página de Listagem de Faturas por Pessoa** (`invoices.tsx`) - Lista as faturas de uma pessoa específica, mostrando o status de cada fatura (Pago, Cancelado, Ativo, Inativo).

## Rotas do Next.js e Estrutura de Pastas

| Rota                               | Arquivo                      | Descrição                                                                                             |
| ---------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| `/`                                | `pages/index.tsx`             | Página inicial do projeto.                                                                          |
| `/association`                     | `pages/association.tsx`       | Lista todas as pessoas cadastradas com links para ver as faturas associadas a cada pessoa.            |
| `/invoice/[invoiceId]/edit`         | `pages/invoice/[invoiceId]/edit.tsx` | Formulário para editar os detalhes de uma fatura específica (`paid_at`, `cancelled_at`, `enable`). |
| `/person/[personId]/invoices`       | `pages/person/[personId]/invoices.tsx` | Lista as faturas associadas a uma pessoa específica.                                              |

## Considerações e Melhorias

*   **Endpoint para buscar faturas por pessoa no back-end:** Implementar um endpoint `/person/:personId/invoices` no back-end para melhorar a performance da listagem de faturas por pessoa. Atualmente, o front-end busca todas as faturas e filtra localmente.
*   **Tratamento de erros:** Implementar um tratamento de erros mais robusto, com mensagens de erro detalhadas para o usuário.
*   **Estilização:** Adicionar estilos CSS para melhorar a aparência da aplicação.
*   **Validação de formulários:** Adicionar validação aos campos dos formulários no front-end.
*   **Paginação:** Implementar paginação para as listagens de pessoas e faturas, caso o volume de dados cresça muito.
*   **Testes:** Implementar testes unitários e/ou de integração para garantir a qualidade do código.

## Contribuições

Contribuições são bem-vindas! Se você quiser contribuir com o projeto, siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para a sua feature (`git checkout -b feature/sua-feature`).
3. Faça commit das suas alterações (`git commit -m 'Adicionando nova feature'`).
4. Faça push para a branch (`git push origin feature/sua-feature`).
5. Abra um Pull Request.
