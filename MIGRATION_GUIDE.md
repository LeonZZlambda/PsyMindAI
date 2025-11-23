# 🚀 Guia de Migração - PsyMind.AI

## Como Usar os Módulos em Outro Projeto

### 1️⃣ Copiar Arquivos

Copie as pastas para seu novo projeto:

```bash
cp -r src/services /seu-projeto/src/
cp -r src/utils /seu-projeto/src/
```

### 2️⃣ Instalar Dependências

```bash
npm install @google/genai
```

### 3️⃣ Configurar API Key

#### Opção A: Variável de Ambiente
```javascript
// .env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

#### Opção B: Configuração Manual
```javascript
import { setApiKey } from './services';

setApiKey('sua_chave_aqui');
```

### 4️⃣ Usar os Serviços

#### Chat com IA
```javascript
import { sendMessage, isConfigured } from './services';

if (isConfigured()) {
  const result = await sendMessage('Olá!', []);
  console.log(result.text);
}
```

#### Ferramentas
```javascript
import { 
  generatePomodoroTip, 
  generateMoodInsight, 
  generateReflection 
} from './services';

// Dica de Pomodoro
const tip = await generatePomodoroTip('focus');

// Análise de humor
const insight = await generateMoodInsight(moodHistory);

// Reflexão
const reflection = await generateReflection('motivação');
```

#### Storage
```javascript
import { loadChats, saveChats, createChat } from './services';

const chats = loadChats();
const newChat = createChat(id, title, messages);
saveChats([...chats, newChat]);
```

#### Notificações
```javascript
import { playNotificationSound, showNotification } from './utils';

playNotificationSound();
await showNotification('Título', 'Mensagem');
```

### 5️⃣ Adaptar Storage (Opcional)

Para usar banco de dados ao invés de localStorage:

```javascript
import { StorageAdapter } from './services';

class DatabaseAdapter extends StorageAdapter {
  async get(key) {
    return await db.find(key);
  }

  async set(key, value) {
    return await db.save(key, value);
  }
}

const dbStorage = new DatabaseAdapter();
loadChats(dbStorage);
```

### 6️⃣ Customizar Prompts

```javascript
import { SYSTEM_PROMPTS } from './services';

// Usar prompts existentes
const prompt = SYSTEM_PROMPTS.PSYMIND;

// Ou criar novos
const customPrompt = 'Você é um assistente...';
```

## 📦 Estrutura Exportada

### Services (`./services`)
- `sendMessage(message, history)` - Enviar mensagem para IA
- `generateTitle(text)` - Gerar título de chat
- `isConfigured()` - Verificar se API está configurada
- `setApiKey(key)` - Configurar API key
- `generatePomodoroTip(mode)` - Dicas de Pomodoro
- `generateMoodInsight(history)` - Análise de humor
- `generateReflection(category)` - Gerar reflexão
- `loadChats()`, `saveChats()` - Gerenciar chats
- `loadSetting()`, `saveSetting()` - Gerenciar configurações

### Utils (`./utils`)
- `playNotificationSound()` - Tocar som
- `showNotification(title, body)` - Mostrar notificação
- `TextStreamer` - Classe para streaming de texto
- `animateThemeTransition()` - Animação de tema

## 🔧 Exemplos de Uso

### Backend Node.js
```javascript
import { sendMessage, setApiKey } from './services';

setApiKey(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  const result = await sendMessage(req.body.message, req.body.history);
  res.json(result);
});
```

### React/Vue/Angular
```javascript
import { sendMessage, loadChats, saveChats } from './services';

function ChatComponent() {
  const [chats, setChats] = useState(loadChats());
  
  const handleSend = async (message) => {
    const result = await sendMessage(message, []);
    const newChats = [...chats, result];
    setChats(newChats);
    saveChats(newChats);
  };
}
```

### Next.js API Route
```javascript
import { sendMessage } from '@/services';

export async function POST(request) {
  const { message, history } = await request.json();
  const result = await sendMessage(message, history);
  return Response.json(result);
}
```

## ⚠️ Notas Importantes

1. **API Key**: Nunca exponha sua API key no frontend em produção
2. **Rate Limits**: O retry handler já gerencia limites de taxa
3. **Storage**: Adapte o storage para seu caso de uso (DB, Redis, etc)
4. **Erros**: Todos os serviços retornam `{ success, text/error, userMessage }`

## 🎯 Migração Completa vs Parcial

### Migração Completa
Copie tudo e use como está. Ideal para projetos similares.

### Migração Parcial
Copie apenas o que precisa:
- Só IA? → `services/api/`, `services/chat/`
- Só ferramentas? → `services/tools/`
- Só storage? → `services/storage/`, `services/adapters/`

## 📚 Recursos Adicionais

- [Documentação Gemini API](https://ai.google.dev/)
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura detalhada
- [README.md](./README.md) - Visão geral do projeto
