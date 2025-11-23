# 🏗️ Arquitetura Modular - PsyMind.AI

## 📁 Estrutura de Diretórios

```
src/
├── services/           # Serviços e lógica de negócio
│   ├── api/           # Integrações com APIs externas
│   │   ├── geminiClient.js      # Cliente do Google Gemini
│   │   ├── errorHandler.js      # Tratamento de erros
│   │   └── retryHandler.js      # Lógica de retry
│   ├── chat/          # Serviços de chat
│   │   ├── chatService.js       # Lógica principal do chat
│   │   └── messageFormatter.js  # Formatação de mensagens
│   ├── tools/         # Serviços das ferramentas
│   │   ├── pomodoroService.js   # Dicas do Pomodoro
│   │   ├── moodService.js       # Análise de humor
│   │   └── reflectionService.js # Reflexões e frases
│   ├── storage/       # Persistência de dados
│   │   ├── chatStorage.js       # Armazenamento de conversas
│   │   └── settingsStorage.js   # Armazenamento de configurações
│   ├── prompts/       # Prompts do sistema
│   │   └── systemPrompts.js     # Prompts para IA
│   └── gemini.js      # Interface pública (compatibilidade)
├── utils/             # Utilitários reutilizáveis
│   ├── notifications.js         # Sistema de notificações
│   ├── textStreaming.js         # Streaming de texto
│   └── themeTransition.js       # Transições de tema
├── context/           # Contextos React
├── components/        # Componentes React
└── pages/            # Páginas da aplicação
```

## 🔧 Módulos Principais

### 1. **API Services** (`services/api/`)

#### `geminiClient.js`
Cliente modular para Google Gemini API.
```javascript
import { GeminiClient } from './services/api/geminiClient';
const client = new GeminiClient(apiKey);
await client.generateContent({ model, contents });
```

#### `errorHandler.js`
Tratamento centralizado de erros.
```javascript
import { parseError, createErrorResponse, ERROR_TYPES } from './services/api/errorHandler';
```

#### `retryHandler.js`
Lógica de retry para requisições.
```javascript
import { withRetry } from './services/api/retryHandler';
await withRetry(async () => apiCall(), retries, delay);
```

### 2. **Chat Services** (`services/chat/`)

#### `chatService.js`
Serviço principal de chat com IA.
```javascript
import { sendMessage, generateTitle, isConfigured } from './services/chat/chatService';
```

#### `messageFormatter.js`
Formatação de mensagens para diferentes contextos.
```javascript
import { formatHistoryForGemini, createUserMessage, createAIMessage } from './services/chat/messageFormatter';
```

### 3. **Storage Services** (`services/storage/`)

#### `chatStorage.js`
Gerenciamento de conversas no localStorage.
```javascript
import { loadChats, saveChats, createChat, updateChat } from './services/storage/chatStorage';
```

#### `settingsStorage.js`
Gerenciamento de configurações.
```javascript
import { loadSetting, saveSetting, loadBooleanSetting } from './services/storage/settingsStorage';
```

### 4. **Tools Services** (`services/tools/`)

#### `pomodoroService.js`
Geração de dicas para sessões Pomodoro.
```javascript
import { generatePomodoroTip } from './services/tools/pomodoroService';
await generatePomodoroTip('focus');
```

#### `moodService.js`
Análise de histórico de humor.
```javascript
import { generateMoodInsight } from './services/tools/moodService';
await generateMoodInsight(moodHistory);
```

#### `reflectionService.js`
Geração de reflexões e análises.
```javascript
import { generateReflection, generateReflectionAnalysis } from './services/tools/reflectionService';
```

### 5. **Utilities** (`utils/`)

#### `notifications.js`
Sistema de notificações e sons.
```javascript
import { playNotificationSound, showNotification, requestNotificationPermission } from './utils/notifications';
```

#### `textStreaming.js`
Classe para streaming de texto com efeito de digitação.
```javascript
import { TextStreamer } from './utils/textStreaming';
const streamer = new TextStreamer(text, onChunk, onComplete, reducedMotion);
streamer.start();
```

#### `themeTransition.js`
Transições animadas de tema.
```javascript
import { animateThemeTransition } from './utils/themeTransition';
await animateThemeTransition(event, callback, reducedMotion);
```

## 🔄 Fluxo de Dados

### Chat Flow
```
User Input → ChatContext → chatService → geminiClient → API
                ↓              ↓            ↓
         chatStorage ← messageFormatter ← errorHandler
```

### Settings Flow
```
User Action → ThemeContext → settingsStorage → localStorage
                ↓
         themeTransition (animação)
```

## 📦 Migração Facilitada

Todos os módulos são independentes e podem ser migrados individualmente:

1. **API Layer**: `services/api/*` - Migre para backend
2. **Business Logic**: `services/chat/*` - Migre para servidor
3. **Storage**: `services/storage/*` - Substitua por banco de dados
4. **Utils**: `utils/*` - Reutilize em qualquer projeto

## 🎯 Benefícios

- ✅ **Modularidade**: Cada módulo tem responsabilidade única
- ✅ **Testabilidade**: Fácil criar testes unitários
- ✅ **Reutilização**: Módulos podem ser usados em outros projetos
- ✅ **Manutenção**: Mudanças isoladas não afetam todo o sistema
- ✅ **Migração**: Fácil mover funcionalidades para backend

## 🚀 Migração para Outros Projetos

Veja o [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) para instruções completas.

### Quick Start
```bash
# Copiar módulos
cp -r src/services /seu-projeto/src/
cp -r src/utils /seu-projeto/src/

# Instalar dependências
npm install @google/genai

# Usar
import { sendMessage, generatePomodoroTip } from './services';
```

### Pontos de Entrada
- `./services` - Todos os serviços (API, Chat, Tools, Storage)
- `./utils` - Utilitários (Notificações, Streaming, Transições)

## 🔌 Adaptadores

Todos os módulos suportam adaptadores customizados:

```javascript
// Storage customizado
class DatabaseAdapter extends StorageAdapter {
  async get(key) { return await db.find(key); }
  async set(key, value) { return await db.save(key, value); }
}

// Usar
const dbStorage = new DatabaseAdapter();
loadChats(dbStorage);
```
