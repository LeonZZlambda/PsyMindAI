# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

Formato seguindo "Keep a Changelog" e versionamento semântico.

## [Unreleased]

### 🏗️ Enterprise Architecture & Production Readiness (May 30, 2026)
- **Advanced Automated Testing Suite**:
  - Implemented end-to-end (**E2E**) testing architecture using **Playwright**, featuring real-browser simulations for critical UI paths like the Chat Journey and App boot sequences.
  - Deployed **Promptfoo** to continuously test, assert, and prevent behavioral backsliding and prompt regressions across the Gemini models.
  - Setup structured Unit/Integration tests with **Vitest** + React Testing Library (verified with coverage).
- **Comprehensive Observability Stack**:
  - Integrated **Sentry** for full-stack error tracking, including advanced browser tracing and privacy-filtered session replays.
  - Embedded **PostHog** for granular auto-capture product analytics and usage flow telemetry.
  - Setup **Langfuse/Helicone** foundations to monitor LLM token usage, prompt variations, and API latency, ensuring structured debuggability of AI responses.
- **PWA & Edge Performance Mastery**:
  - Added strict bundle analysis via `rollup-plugin-visualizer` to surgically split heavy vendor chunks (React, MUI, GenAI SDK) via Vite's `manualChunks`, eliminating Total Blocking Time (TBT).
  - Configured advanced **Workbox** PWA Service Workers with discrete cache strategies: `CacheFirst` for static assets/fonts, `StaleWhileRevalidate` for application scripts, and explicit offline SPA fallback routing (`NetworkOnly` for streaming API integration).
  - Achieved structural preparedness for **Lighthouse 95+** consistency.

### 🚀 Features & Core Enhancements
- **Meta-Insight AI Engine (`generateMetaInsight`)**: Introduced a secondary AI pass that autonomously cross-references local usage data (Mood Tracker, Pomodoro sessions, Learning Trails) to surface behavioral patterns and synthesize individualized cognitive insights.
- **Embedded Privacy-First Analytics**: Transitioned from a generic analytics placeholder to a dual-view architecture (Global Mock-up vs. Local "Meu Uso" dashboard), explicitly communicating the frontend-only state via a clear _Mockup Warning_, whilst delivering robust on-device metric analysis.
- **Connected Tool Ecosystem (State Contextualization)**: Re-engineered `systemPrompts.js` to passively ingest real-time `localStorage` contexts (`psymind_mood_history`, `psymind_pomodoro_stats`, `completedTrails`), unifying isolated tools into a highly contextualized AI agent memory model.
- **Psychological & Clinical Guardrails**: Refactored the core system prompts dictating strict boundaries against diagnosing or utilizing clinical terminology (e.g., phrasing "burnout" as "tensão habitual"). Hardcoded instructions emphasize canonical educational tactics — *Active Recall* and *Spaced Repetition* — optimizing student focus over prolonged therapeutic discourse.
- **Enhanced UX & Perceived Latency (Streaming Placeholders)**: Overhauled the AI loading state in `MessageList.jsx` by swapping static spinners for context-aware placeholders (e.g., *"Buscando estratégias de auto-regulação..."*), dynamically transitioning to simulate the AI's internal cognition pipeline prior to stream execution.
- **Strict Anonymous Mode Iteration**: Upgraded the incognito chat experience to clearly demarcate the cessation of all telemetry tracking and session retention, via explicitly deployed UI verbiage ("Private Mode ON – No analytics – No history").
- **Transparency Center (`TransparencyPage.jsx`)**: Designed and integrated a comprehensive legal and technical manifesto dissecting the project's zero-trust/edge-only data localization and safe AI boundaries.

### 🛡️ Security & Privacy
- **Telemetry Consent Engine (`TelemetryConsent.jsx`)**: Standardized a non-intrusive explicit opt-in toast for user metrics, ensuring compliance with global privacy expectations before deriving on-device aggregate calculations (`telemetry.js`).

### 🧹 Cleanup & Documentation
- Limpeza: remoção de scripts de manutenção e arquivos de teste obsoletos.
- Documentação: adição de CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md e modernização estrutural do ARCHITECTURE.md ressaltando injeção de contexto em LLMs de Borda.

## [0.0.0] - 2026-04-07

- Projeto inicial (estado atual do repositório).
