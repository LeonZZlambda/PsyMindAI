# Migration Guide

Instructions for extracting PsyMind.AI service modules into another project.

---

## 1. Copy modules

```bash
cp -r src/services /your-project/src/
cp -r src/utils /your-project/src/
```

## 2. Install dependencies

```bash
npm install @google/genai
```

## 3. Configure API key

**Via environment variable (recommended):**
```
VITE_GEMINI_API_KEY=your_key_here
```

**Via code:**
```js
import { setApiKey } from './services';
setApiKey('your_key_here');
```

---

## Usage

### Chat

```js
import { sendMessage, isConfigured } from './services';

if (isConfigured()) {
  const result = await sendMessage('Hello!', history);
  console.log(result.text);
}
```

### Tools

```js
import { generatePomodoroTip, generateMoodInsight, generateReflection } from './services';

await generatePomodoroTip('focus');
await generateMoodInsight(moodHistory);
await generateReflection('motivation');
```

### Storage

```js
import { loadChats, saveChats, createChat } from './services';

const chats = loadChats();
const chat = createChat(id, title, messages);
saveChats([...chats, chat]);
```

### Utilities

```js
import { playNotificationSound, showNotification } from './utils';
import { TextStreamer } from './utils';
import { animateThemeTransition } from './utils';
```

---

## Custom Storage Adapter

Replace localStorage with any backend by extending `StorageAdapter`:

```js
import { StorageAdapter } from './services';

class DatabaseAdapter extends StorageAdapter {
  async get(key) { return await db.find(key); }
  async set(key, value) { return await db.save(key, value); }
}

loadChats(new DatabaseAdapter());
```

---

## Framework Examples

**React:**
```js
import { sendMessage, loadChats, saveChats } from './services';

function Chat() {
  const [chats, setChats] = useState(loadChats());

  const handleSend = async (message) => {
    const result = await sendMessage(message, []);
    const updated = [...chats, result];
    setChats(updated);
    saveChats(updated);
  };
}
```

**Next.js API Route:**
```js
import { sendMessage } from '@/services';

export async function POST(request) {
  const { message, history } = await request.json();
  const result = await sendMessage(message, history);
  return Response.json(result);
}
```

**Node.js:**
```js
import { sendMessage, setApiKey } from './services';

setApiKey(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  const result = await sendMessage(req.body.message, req.body.history);
  res.json(result);
});
```

---

## Partial Migration

You don't need to copy everything. Take only what you need:

| Need | Copy |
|---|---|
| AI chat only | `services/api/`, `services/chat/` |
| Tools only | `services/tools/` |
| Storage only | `services/storage/`, `services/adapters/` |
| All services | `services/` |

---

## Public API Reference

### `services/index.js`

| Export | Description |
|---|---|
| `sendMessage(message, history)` | Send a message to the AI |
| `generateTitle(text)` | Generate a chat title |
| `isConfigured()` | Check if API key is set |
| `setApiKey(key)` | Set API key at runtime |
| `generatePomodoroTip(mode)` | AI tip for focus/break cycle |
| `generateMoodInsight(history)` | Mood trend analysis |
| `generateReflection(category)` | Generate a reflection prompt |
| `loadChats()` / `saveChats()` | Chat persistence |
| `loadSetting()` / `saveSetting()` | Settings persistence |

### `utils/index.js`

| Export | Description |
|---|---|
| `playNotificationSound()` | Play notification audio |
| `showNotification(title, body)` | Browser notification |
| `TextStreamer` | Typewriter streaming class |
| `animateThemeTransition()` | Animated theme switch |

---

## Notes

- Never expose your API key in client-side code in production — proxy requests through a backend
- All service functions return `{ success, text | error, userMessage }`
- The retry handler automatically manages rate limit errors

---

## References

- [Gemini API Docs](https://ai.google.dev/)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [SETUP.md](./SETUP.md)
