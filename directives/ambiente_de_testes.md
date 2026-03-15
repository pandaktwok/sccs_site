# Diretriz: Ambiente de Testes SCCS

Este documento descreve como configurar e utilizar o ambiente de testes para garantir que as mudanças no código (frontend e backend) sejam seguras e validadas.

## 1. Estrutura do Ambiente
- **Backend**: Jest + Supertest (Localizado em `tests/backend/`).
- **Frontend**: Vitest + React Testing Library (Configuração em `vite.config.js` e testes em `frontend/src/test/`).

## 2. Como Executar os Testes

### Backend
Para rodar os testes da API:
```bash
npm test
```
*Nota: O ambiente de testes utiliza os mocks definidos em `server.js` para evitar dependência de banco de dados externo.*

### Frontend
Para rodar os testes de UI:
```bash
cd frontend
npm test
```

## 3. Boas Práticas
- **Mocks**: Sempre prefira usar mocks para chamadas de API no frontend.
- **Isolamento**: Não modifique dados reais de produção durante os testes.
- **Teardown**: Certifique-se de que os servidores e conexões sejam fechados após os testes (o backend exporta o `app` sem iniciar o `listen` automaticamente para facilitar isso).

## 4. Próximos Passos Sugeridos
- Implementar testes de integração com Cypress ou Playwright para fluxos críticos (Login, Cadastro de Eventos).
- Configurar CI/CD no GitHub Actions para rodar estes testes automaticamente em cada Pull Request.
