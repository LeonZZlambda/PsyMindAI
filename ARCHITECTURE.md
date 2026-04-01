# Architecture

PsyMind.AI follows a modular service-oriented architecture. Each layer has a single responsibility and can be replaced or migrated independently.

---

## Directory Structure

```
src/
├── services/
│   ├── api/
│   │   ├── geminiClient.js       # Google Gemini API client
│   │   ├── errorHandler.js       # Centralized error parsing
│   │   └── retryHandler.js       # Exponential backoff retry logic
│   ├── chat/
│   │   ├── chatService.js        # Core chat orchestration
│   │   └── messageFormatter.js   # Message normalization for Gemini
│   ├── tools/
│   │   ├── pomodoroService.js    # AI tips for focus/break cycles
│   │   ├── moodService.js        # Mood history analysis
│   │   └── reflectionService.js  # Reflection prompt generation
│   ├── storage/
│   │   ├── chatStorage.js        # Chat persistence (localStorage)
│   │   └── settingsStorage.js    # User settings persistence
│   ├── prompts/
│   │   └── systemPrompts.js      # System prompt definitions
│   ├── adapters/                 # Pluggable storage adapters
│   └── index.js                  # Public service interface
├── utils/
│   ├── notifications.js          # Browser notifications and sounds
│   ├── textStreaming.js          # Typewriter streaming effect
│   └── themeTransition.js        # Animated theme switching
├── context/                      # React context providers
├── components/                   # UI components
└── pages/                        # Route-level pages
```

---

## Modules

### `services/api/`

**`geminiClient.js`** — Thin wrapper around `@google/genai`.

```js
import { GeminiClient } from './services/api/geminiClient';
const client = new GeminiClient(apiKey);
await client.generateContent({ model, contents });
```

**`errorHandler.js`** — Normalizes API errors into typed responses.

```js
import { parseError, createErrorResponse, ERROR_TYPES } from './services/api/errorHandler';
```

**`retryHandler.js`** — Retries failed requests with configurable backoff.

```js
import { withRetry } from './services/api/retryHandler';
await withRetry(() => apiCall(), retries, delay);
```

---

### `services/chat/`

**`chatService.js`** — Orchestrates message sending, history management, and title generation.

```js
import { sendMessage, generateTitle, isConfigured } from './services/chat/chatService';
```

**`messageFormatter.js`** — Converts internal message format to Gemini's `contents` schema.

```js
import { formatHistoryForGemini, createUserMessage, createAIMessage } from './services/chat/messageFormatter';
```

---

### `services/storage/`

**`chatStorage.js`**

```js
import { loadChats, saveChats, createChat, updateChat } from './services/storage/chatStorage';
```

**`settingsStorage.js`**

```js
import { loadSetting, saveSetting, loadBooleanSetting } from './services/storage/settingsStorage';
```

---

### `services/tools/`

```js
import { generatePomodoroTip } from './services/tools/pomodoroService';
import { generateMoodInsight } from './services/tools/moodService';
import { generateReflection, generateReflectionAnalysis } from './services/tools/reflectionService';
```

---

### `utils/`

**`textStreaming.js`** — Streams AI responses character-by-character with reduced-motion support.

```js
import { TextStreamer } from './utils/textStreaming';
const streamer = new TextStreamer(text, onChunk, onComplete, reducedMotion);
streamer.start();
```

**`themeTransition.js`**

```js
import { animateThemeTransition } from './utils/themeTransition';
await animateThemeTransition(event, callback, reducedMotion);
```

**`notifications.js`**

```js
import { playNotificationSound, showNotification, requestNotificationPermission } from './utils/notifications';
```

---

## Data Flows

### Chat

```
User Input → ChatContext → chatService → geminiClient → Gemini API
                ↓               ↓
         chatStorage ← messageFormatter ← errorHandler
```

### Settings

```
User Action → ThemeContext → settingsStorage → localStorage
                  ↓
           themeTransition
```

---

## Pluggable Storage

All storage modules accept a custom adapter, enabling migration from localStorage to any backend:

```js
import { StorageAdapter } from './services';

class DatabaseAdapter extends StorageAdapter {
  async get(key) { return await db.find(key); }
  async set(key, value) { return await db.save(key, value); }
}

loadChats(new DatabaseAdapter());
```

---

## Migration

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for instructions on extracting individual modules into other projects.
