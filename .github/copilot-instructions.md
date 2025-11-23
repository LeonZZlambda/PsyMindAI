## PsyMind.AI — AI-assistant instructions

Keep this short and actionable. Focus on repository-specific patterns, conventions, and where to edit behavior.

- **Project type & run**: Vite + React (client-only). Start with:
  - `npm install` then `npm run dev` (see `package.json`). Node >=14.

- **Entry points**: `src/main.jsx` mounts providers and `src/App.jsx` contains routes and top-level UI layout.

- **Global state / where logic lives**:
  - Context providers live in `src/context/` and are authoritative for app behavior: `ThemeContext`, `ChatContext`, `PomodoroContext`, `SoundContext`, `MoodContext`.
  - If you need to change message persistence, modify `ChatContext` — it reads/writes `localStorage` key `chatMessages` and simulates AI streaming in `sendMessage`.

- **Routing & pages**:
  - Routes are defined in `src/App.jsx`. Public landing routes are listed in the `publicRoutes` array; update that when adding/removing public pages.
  - Add pages under `src/pages/` and routes in `App.jsx` (example: `ChatPage` is at `/chat`).

- **UI conventions**:
  - Components live in `src/components/`. Modals are lazy-loaded via `React.lazy` and rendered inside a `Suspense` block in `App.jsx` — follow that pattern for new large components to keep initial bundle size small.
  - Styles are split by feature in `src/styles/` (e.g., `chat.css`, `sidebar.css`). Prefer adding component-specific styles there.

- **Accessibility & motion**:
  - `ThemeContext` exposes flags like `reducedMotion`, `highContrast`, and `colorBlindMode`. Components respect `reducedMotion` (see `ChatContext` streaming behavior) and `MotionConfig` in `App.jsx`.

- **Keyboard shortcuts & global hotkeys**:
  - Global hotkeys (new chat, toggle sidebar, open settings/help) are implemented in `src/App.jsx` — if you change shortcuts, update that file.

- **Third-party libs used**: `framer-motion`, `sonner` (Toaster), `react-error-boundary`, `react-router-dom`. Follow their usage patterns as already used in `App.jsx` and `main.jsx`.

- **No server code**: This repo is client-only. The AI behavior is simulated in `ChatContext`. To integrate a real API, replace `sendMessage` logic and add a new network client module (e.g., `src/api/aiClient.js`) and move message serialization there.

- **Common edits examples**:
  - Add a modal: create `src/components/MyModal.jsx`, lazy-import in `App.jsx`, add state toggle and render inside the existing `Suspense` block.
  - Persist new chat metadata: update `ChatContext` (where `localStorage` is read/written) and ensure any new fields are serialized/deserialized consistently.
  - Add a new route: add page under `src/pages/`, import in `App.jsx`, add route and update `publicRoutes` if it should be treated as landing/public.

- **Testing & linting**: No test suite detected. Linting runs with `npm run lint` (ESLint configured). Run lint before PRs.

- **PR guidance**:
  - Keep changes focused: styling is separated by file in `src/styles/` so avoid large multi-file style changes.
  - For behavior changes to user-facing flows (chat, keyboard shortcuts, theme), update the matching context first and keep UI components thin.

If anything here is unclear or you'd like the instructions to include more examples (e.g., adding a real AI backend, or the Provider dependency order in `src/main.jsx`), tell me what to expand.
