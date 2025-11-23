# 🚀 Guia de Configuração - PsyMind.AI

## Configuração da API do Google Gemini

Para ativar a integração completa com o Google Gemini, siga os passos:

### 1. Obter API Key do Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Get API Key" ou "Create API Key"
4. Copie a chave gerada

### 2. Configurar no Projeto

1. Crie um arquivo `.env` na raiz do projeto:
```bash
cp .env.example .env
```

2. Abra o arquivo `.env` e adicione sua chave:
```
VITE_GEMINI_API_KEY=sua_chave_aqui
```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Executar o Projeto

```bash
npm run dev
```

## Modo Demonstração

Se a API Key não estiver configurada, o sistema funcionará em **modo demonstração** com respostas simuladas, permitindo testar todas as funcionalidades da interface.

## Funcionalidades Integradas com Gemini

✅ **Chat Inteligente** - Conversas contextualizadas com memória de histórico
✅ **Prompt Engineering** - Sistema de instruções desenvolvido com NotebookLM
✅ **Personalidade Otimizada** - Tom empático calibrado via Gemini Gems
✅ **Respostas Científicas** - Baseadas em psicologia educacional

## Tecnologias Google Utilizadas

- **Google Gemini 1.5 Flash** - Motor de IA principal
- **NotebookLM** - Desenvolvimento e refinamento de prompts
- **Gemini Gems** - Personalização de personalidade e tom
- **Google AI Studio** - Gerenciamento de API Keys

## Troubleshooting

### Erro: "API Key não configurada"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que a variável está nomeada como `VITE_GEMINI_API_KEY`
- Reinicie o servidor de desenvolvimento após criar o `.env`

### Erro: "Failed to fetch"
- Verifique sua conexão com a internet
- Confirme que a API Key é válida no Google AI Studio
- Verifique se não excedeu o limite de requisições gratuitas

## Limites da API Gratuita

- 60 requisições por minuto
- 1500 requisições por dia
- Ideal para demonstrações e testes

Para uso em produção, considere upgrade para plano pago.
