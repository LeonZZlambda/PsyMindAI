## PsyMind.AI — AI Pair-Programming Instructions

Use these guidelines when generating components, modifying hooks, or updating application behavior. Follow these patterns to maintain codebase consistency and architectural standards.

---

### 🚀 Stack & Core Architecture

- **Stack**: React 19 + TypeScript + Vite + Vanilla CSS (client-only).
- **Build & Launch**: Run `npm install` then `npm run dev`. Node `≥ 18.0.0` required.
- **Entry Points**:
  - `src/main.tsx`: Mounts the React providers shell.
  - `src/routes/AppRoutes.tsx`: Defines routing structures, separating landing layouts from internal dashboard views.
  - `src/App.tsx`: Renders notifications toaster, ripple animation frames, and routes.

---

### 📂 Directory Structure Conventions

When adding or refactoring files, respect this modular structure:
- **`src/components/ui/`**: Atomic visual primitives (e.g. `CustomSelect`, `Snackbar`, `TextField`).
- **`src/components/layout/`**: Structural containers (e.g. `Header`, `Sidebar`, `GlobalRipple`).
- **`src/components/chat/`**: Elements specific to the chat area (e.g. `InputArea`, `MessageList`, `PsyBot`).
- **`src/components/modals/`**: Shared overlay views (e.g. `BaseModal`, `ReflectionsModal`, `HelpModal`).
- **`src/components/features/`**: Code grouped by specific functional modules:
  - `landing/` (Home section frames)
  - `study-dashboard/` (Diagnostic lists, Pomodoro stats, charts)
  - `weekly-schedule/` (Planners, calendars)
- **`src/services/`**: Infrastructure, external clients, prompts, and storage adapters.
- **`src/hooks/`**: Context and custom hooks. Global state context wrappers live inside `src/hooks/context/`.

---

### 🧠 State Management & Data Flow

- **Authoritative States**: Global application states live in dedicated Context files inside `src/context/` (e.g., `ChatContext`, `ThemeContext`, `PomodoroContext`, `SoundContext`, `MoodContext`).
- **State Hooks**: Access global states through custom hooks located in `src/hooks/context/` (e.g. `useChat`, `useTheme`, `usePomodoro`).
- **Local Context Injection**: System prompts in `src/services/prompts/systemPrompts.ts` dynamically load on-device records (Pomodoros, mood logs) from local storage context to inject them into the outgoing system prompt.

---

### 🤖 AI Providers & Clients

- **API Integration**: Production mode utilizes `@google/genai` to stream chunks directly to the UI.
- **Client Configuration**: API client and retry helpers are located in `src/services/api/`.
- **Offline Fallback**: If `VITE_GEMINI_API_KEY` is undefined, the application switches to a local mock streaming flow. Maintain this fallback capability when updating prompt behaviors.

---

### 🎨 Styling & Accessibilities

- **CSS Files**: Avoid global style leaks. Put component-specific rules in modular stylesheets under `src/styles/` (e.g. `chat.css`, `sidebar.css`, `modal-base.css`).
- **Accessibility features**: Elements must support accessibility rules. Respect states exposed by `ThemeContext` such as `reducedMotion`, `highContrast`, and `colorBlindMode`.

---

### 🧪 Tests & Quality Assurance

- **Vitest Testing**: Run unit and integration tests using `npm run test` or `npm run test:ci`.
- **Coverage**: Verify new hooks, helper logic, or utility algorithms have matching test specifications. Mock external API services and use fake timers for time-dependent functions.
- **ESLint Conformance**: Always verify changes by running `npm run lint` before committing.
