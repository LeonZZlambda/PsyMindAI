# PsyMind.AI Architecture Guide

PsyMind.AI is engineered using a clean, client-centric, service-oriented architecture. Each module has a strict single responsibility, decoupled from user-interface components to facilitate independent updates, testability, and portability.

---

## 📂 Directory Structure

The repository follows a modular, feature-based TypeScript layout:

```text
src/
├── services/                     # Core Business Logic & Infrastructure
│   ├── api/
│   │   ├── providers/            # LLM provider abstractions (e.g. GeminiProvider)
│   │   ├── errorHandler.ts       # Centralized API error parsing
│   │   └── retryHandler.ts       # Exponential backoff retry handler
│   ├── chat/
│   │   ├── chatService.ts        # Chat session management & Meta-Insight synthesis
│   │   └── messageFormatter.ts   # Chat history translation for Google API
│   ├── analytics/
│   │   └── telemetry.ts          # Local analytics processing engine
│   ├── tools/
│   │   ├── pomodoroService.ts    # Pomodoro analytics and timer utilities
│   │   ├── moodService.ts        # Mood-tracker insights calculator
│   │   └── reflectionService.ts  # CBT cognitive reflection generators
│   ├── storage/
│   │   ├── chatStorage.ts        # Local database serialization for chat sessions
│   │   └── settingsStorage.ts    # Key-value user settings storage
│   ├── prompts/
│   │   └── systemPrompts.ts      # Active system instructions and state builders
│   ├── config/
│   │   └── apiConfig.ts          # API constants and configuration schemas
│   ├── adapters/
│   │   └── storageAdapter.ts     # Abstract storage port
│   └── index.ts                  # Public service exports
├── utils/                        # System Utilities & Helper Modules
│   ├── notifications.ts          # Native browser audio/visual feedback utilities
│   ├── textStreaming.ts          # Reduced-motion supported typewriter simulator
│   ├── themeTransition.ts        # Paint-holding View Transition wrapper
│   ├── recommendationEngine.ts   # On-device Spaced Repetition (SRS) memory decay processor
│   └── materialIconsTests.ts     # Visual design verification assets
├── context/                      # React State Providers
│   ├── ChatContext.tsx           # Global state orchestrating chat feeds
│   ├── ThemeContext.tsx          # Focus, contrast, and accessibility theme configurations
│   ├── PomodoroContext.tsx       # Pomodoro timer lifecycle events
│   └── ...                       # Mood, Gamification, and Modal Context layers
├── hooks/                        # Reusable Component Logic
│   ├── context/                  # Custom wrapper hooks pointing directly to Context APIs
│   │   ├── useChat.ts
│   │   ├── useTheme.ts
│   │   └── usePomodoro.ts
│   └── useStudyDashboardData.ts  # Dashboard hydration and diagnostic hook
├── routes/                       # App Routing
│   └── AppRoutes.tsx             # Public landing vs Private system paths mapping
├── components/                   # React Visual Tree (Modular Hierarchy)
│   ├── ui/                       # Reusable visual atoms (TextField, CustomSelect, Snackbar)
│   ├── layout/                   # Structural page shell components (Header, Sidebar, Ripple)
│   ├── chat/                     # Components driving the chat view (InputArea, MessageList)
│   ├── modals/                   # Lazy-loaded user dialog portals
│   └── features/                 # Modularized business features
│       ├── landing/              # Marketing blocks & hero frames
│       ├── study-dashboard/      # Study analytics cards, trackers, and widgets
│       └── weekly-schedule/      # Focus calendar schedules & planners
└── pages/                        # Component route controllers
    ├── StyleGuidePage.tsx        # System design guidelines demo
    ├── RoadmapPage.tsx           # Product vision tracker
    └── ContributePage.tsx        # Community contributions hub
```

---

## 🛠️ Engineering Decisions & Trade-offs

A series of deliberate design choices were made during architecture planning:

### 1. Why Client-Side AI Execution?
Rather than channeling AI calls through a dedicated middleware backend (e.g. Express/Next.js routes), all prompt assembly and API calls execute directly from the client.
- **Trade-off:** Exposing the API key option directly to the client. We mitigated this by (1) utilizing Vite build-time environment bindings, (2) enabling users to supply their own secure Google AI Studio key, and (3) falling back to a **fully offline mock/demo mode** when no key is provided.
- **Benefit:** Absolute user data privacy (chats never land on our servers) and **zero runtime backend operational costs**.

### 2. Why Vite over Next.js?
We opted for a Single Page Application (SPA) compiled via Vite + React 19 rather than using Next.js.
- **Trade-off:** Lacks Server-Side Rendering (SSR), meaning search engine spiders see a React hydration shell. However, since PsyMind.AI is a highly interactive, authenticated student dashboard (private self-regulation logs), SEO for dashboard pages is not a priority.
- **Benefit:** Allows standard static assets compilation. The entire app can be served off static CDNs (GitHub Pages, Cloudflare Pages, Render) and trivially converted into a progressive offline-ready app (PWA) using `workbox-inject-manifest`.

### 3. Why Google Gemini 1.5 Flash?
We selected Gemini 1.5 Flash as our core model.
- **Benefit:** Extremely low latency, structured JSON response capability (essential for parsing study structures and OBI evaluations), and a generous context window. This makes parsing historical student logs cost-effective and immediate.

### 4. Why Local-First Telemetry?
Usage telemetry is computed entirely inside the browser's JavaScript environment and rendered through the "Meu Uso" interface.
- **Benefit:** Zero tracking servers. Complete compliance with GDPR and LGPD. The data remains with the student on their own machine.

### 5. Why Manual Vite Chunk Splitting?
A standard Vite build lumps all npm packages into a single bloated vendor file, delaying the first paint.
- **Benefit:** Custom Rollup chunking splits heavy dependencies (`framer-motion`, `zod`, `markdown-vendor`, and `genai-vendor`) so that critical components load in parallel chunks, reducing Largest Contentful Paint (LCP) to under 2 seconds.

---

## ⚡ Performance Optimizations

To deliver a premium, premium feel, the following optimization techniques are implemented:

- **Manual Chunk Splitting:** Inside `vite.config.js`, dependencies are split into specialized modules:
  ```js
  manualChunks(id) {
    if (id.includes('node_modules')) {
      if (id.includes('framer-motion')) return 'motion-vendor';
      if (id.includes('zod')) return 'zod-vendor';
      if (id.includes('markdown') || id.includes('prism')) return 'markdown-vendor';
      if (id.includes('@google/genai')) return 'genai-vendor';
      return 'core-vendor';
    }
  }
  ```
- **Lazy-Loaded Modals:** Heavy UI overlays (e.g. `GuidedLearningModal`, `StudyStatsModal`) are imported via `React.lazy` and suspended until the user explicitly clicks their respective trigger buttons.
- **Deferred Hydration:** Dashboard graphs and history charts defer calculation until the visual window is painted, preventing main-thread lockups.
- **Skeleton-First Rendering:** Dynamic elements are backed by structured skeleton screens (`SkeletonScreen.tsx`) to eliminate visual layout shifts during async data loading.
- **CSS Painting Optimizations:** Uses hardware-accelerated animations (`transform` and `opacity` properties) handled by `framer-motion` to keep paint times down.

---

## 🛡️ Security & Privacy Model

The application enforces a rigorous privacy boundary:

```text
  +------------------ Browser Sandbox -------------------+
  |                                                      |
  |  [ User Input ]                                      |
  |         |                                            |
  |         v                                            |
  |  [ Local Guardrails ] --(Crisis Match)--> [ Block & Reroute ]
  |         |                                            |
  |      (Safe)                                          |
  |         v                                            |
  |  [ System Prompts ] <--- Injects --- [ Local Storage ]
  |         |                                            |
  |         v                                            |
  |  [ SDK Client ] ======(HTTPS/WSS)======> Google Gemini API
  |                                            (No middle-tier log)
  +------------------------------------------------------+
```

- **Zero Backend Persistence:** No external database connection is ever initialized. Database files (chat histories, mood records) reside in the browser's Sandboxed `localStorage`.
- **Consent-Gated Telemetry:** Analytics tracking is fully passive and opt-in. The flag `psymind_telemetry_optin` must be explicitly verified.
- **Local-Only Context Memory:** Chat histories are read from the database, updated in memory inside `ChatContext`, and wiped from active JavaScript memory immediately when the session is closed.
- **Client-Side Prompt Assembly:** The system system-prompt definitions are composed in the user's browser, preventing leakage of custom prompt parameters to intermediating servers.

---

## 🔀 Pluggable Storage & Adapters

PsyMind.AI provides clean abstractions for persistence. All services communicate with storage engines using the `StorageAdapter` interface:

```typescript
// src/services/adapters/storageAdapter.ts
export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}
```

This permits replacing `localStorage` with indexDB, Firebase Firestore, or a secure remote SQL database simply by instantiating a new adapter:

```typescript
import { StorageAdapter } from '@/services/adapters/storageAdapter';

class PostgreSQLAdapter implements StorageAdapter {
  get(key: string) { /* Fetch from server db */ }
  set(key: string, value: string) { /* Save to server db */ }
  remove(key: string) { /* Delete from server db */ }
}
```
