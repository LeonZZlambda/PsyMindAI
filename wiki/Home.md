# 🧠 Bem-vindo à Wiki do PsyMindAI

Esta wiki é o ponto central de documentação detalhada sobre as funcionalidades, arquitetura interna e padrões de desenvolvimento do projeto **PsyMindAI**. 

O PsyMindAI é um assistente virtual focado em bem-estar emocional, estudos e produtividade, construído como uma aplicação client-side estática (SPA) usando **React** e **Vite**.

## 📌 Páginas da Wiki

*   [**Arquitetura e Fluxo de Dados**](../ARCHITECTURE.md) - Visão geral da arquitetura de alto nível (link para o arquivo de arquitetura principal).
*   [**Funcionalidades (Features)**](./Features.md) - Detalhes sobre cada módulo como Pomodoro, Diário Emocional, Rastreador de Humor, etc.
*   [**Gerenciamento de Estado**](./State-Management.md) - Como a aplicação gerencia dados através da React Context API.
*   [**Guia de Estilos (Styling Guide)**](./Styling-Guide.md) - Padrões de CSS, acessibilidade e temas da aplicação.
*   [**Configuração Inicial**](../SETUP.md) - Como rodar o projeto localmente (link para o guia de Setup).

---

**Nota:** Como a aplicação atua via simulação *client-only*, todas as interações da Inteligência Artificial (AI) e retenção de estado são atualmente geridas pelo `ChatContext` e interfaces de `localStorage`.
