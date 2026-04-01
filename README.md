<div align="center">
  <img src="public/psymind.svg" alt="PsyMind.AI Logo" width="96" height="96" />

  <h1>PsyMind.AI</h1>

  <p><strong>AI-assisted psychoeducational system for behavioral awareness in adolescents.</strong></p>

  <p>
    <a href="#overview">Overview</a> ·
    <a href="#features">Features</a> ·
    <a href="#architecture">Architecture</a> ·
    <a href="#getting-started">Getting Started</a> ·
    <a href="#contributing">Contributing</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=flat-square&logo=google" alt="Gemini" />
    <img src="https://img.shields.io/badge/License-CC_BY--SA_4.0-lightgrey?style=flat-square" alt="License" />
  </p>
</div>

---

## Overview

PsyMind.AI is a psychoeducational platform that helps high school students understand, interpret, and regulate their emotions through evidence-based psychology. The system analyzes student self-reports and generates structured, empathetic feedback grounded in established psychological frameworks.

**Scientific foundation:**
- Cognitive Behavioral Therapy (CBT)
- Self-Determination Theory (Deci & Ryan)
- Growth Mindset (Carol Dweck)

> PsyMind.AI is an educational tool. It does not replace professional psychological or psychiatric care.

---

## Features

| Feature | Description |
|---|---|
| 🧠 **Intelligent Chat** | Context-aware conversations powered by Google Gemini 1.5 Flash |
| 🍅 **Pomodoro Timer** | Focus sessions with AI-generated tips per cycle |
| 📊 **Mood Tracker** | Daily emotional monitoring with trend analysis |
| 🌬️ **Guided Breathing** | Visual and timed breathing exercises |
| 📝 **Reflections** | Curated prompts for self-awareness and journaling |
| 🎵 **Soundscapes** | Ambient audio for concentration |
| ♿ **Accessibility** | Dark/light themes, font scaling, high contrast, reduced motion, voice input |

---

## Architecture

```
src/
├── components/        # UI components
├── context/           # React context providers
├── pages/             # Route-level page components
├── services/
│   ├── api/           # Gemini API client, error & retry handlers
│   ├── chat/          # Chat service and message formatter
│   ├── tools/         # Pomodoro, mood, and reflection services
│   ├── storage/       # localStorage adapters for chats and settings
│   ├── prompts/       # System prompt definitions
│   └── adapters/      # Pluggable storage adapters
└── utils/             # Notifications, text streaming, theme transitions
```

**Data flow:**

```
User Input
  → Prompt Builder
  → Gemini API (1.5 Flash)
  → Response Structuring Layer
  → UI
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for module-level documentation.

---

## Getting Started

### Prerequisites

- Node.js ≥ 14
- npm or yarn

### Installation

```bash
git clone https://github.com/LeonZZlambda/PsyMindAI.git
cd PsyMindAI
npm install
```

### Environment

```bash
cp .env.example .env
# Set VITE_GEMINI_API_KEY in .env
```

Without an API key, the app runs in **demo mode** with simulated responses — all UI features remain functional.

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## Deployment

Recommended platforms: **Vercel** or **Netlify**.

Set `VITE_GEMINI_API_KEY` as an environment variable in your deployment dashboard.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines, or visit the [Contribute page](src/pages/ContributePage.jsx) in the app.

---

## Roadmap

- [ ] Mental health support network integration
- [ ] Longitudinal personalization via user history
- [ ] Multilingual support
- [ ] Mobile-first optimization
- [ ] Improved behavioral modeling

See [ROADMAP](src/pages/RoadmapPage.jsx) in the app for the full timeline.

---

## License

[Creative Commons Attribution-ShareAlike 4.0 International](./LICENSE) (CC BY-SA 4.0)

---

<div align="center">
  <sub>Built by <strong>Leonardo</strong> · AI × Psychology × Education</sub>
</div>
