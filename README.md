
## Considerações e Melhorias

*   **Endpoint para buscar faturas por pessoa no back-end:** Implementar um endpoint `/person/:personId/invoices` no back-end para melhorar a performance da listagem de faturas por pessoa. Atualmente, o front-end busca todas as faturas e filtra localmente.
*   **Tratamento de erros:** Implementar um tratamento de erros mais robusto, com mensagens de erro detalhadas para o usuário.
*   **Estilização:** Adicionar estilos CSS para melhorar a aparência da aplicação.
*   **Validação de formulários:** Adicionar validação aos campos dos formulários no front-end.
*   **Paginação:** Implementar paginação para as listagens de pessoas e faturas, caso o volume de dados cresça muito.
*   **Testes:** Implementar testes unitários e/ou de integração para garantir a qualidade do código.
*   **Remoção de Modal de Associação de Faturas:** O modal de associação de pessoas a faturas foi removido, pois a funcionalidade foi descontinuada.

## Contribuições

Contribuições são bem-vindas! Se você quiser contribuir com o projeto, siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para a sua feature (`git checkout -b feature/sua-feature`).
3. Faça commit das suas alterações (`git commit -m 'Adicionando nova feature'`).
4. Faça push para a branch (`git push origin feature/sua-feature`).
5. Abra um Pull Request.

**Alterações Importantes:**

*   **Integração do `PersonInvoiceForm` ao Modal de Detalhes:** O formulário para editar os detalhes da fatura (`paid_at`, `cancelled_at`, `enable`) foi movido para o modal de detalhes da pessoa, na seção de listagem de faturas.
*   **Remoção de Páginas e Componentes Não Utilizados:** As páginas e componentes relacionados à associação e edição de faturas foram removidos, pois a funcionalidade foi integrada ao fluxo principal de listagem de pessoas.
*   **Implementação de Autenticação:** Adicionada a funcionalidade de autenticação com JWT, incluindo as páginas de login e registro, e a proteção de rotas com o HOC `withAuth`.
