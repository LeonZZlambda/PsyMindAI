# Ψ PsyMind.AI Ψ

PsyMind.AI is an educational emotional support solution designed to help high school students understand their behaviors and emotions through scientific psychology.

## Introduction

PsyMind.AI interprets student reports and, empathetically, explains possible psychological causes while offering practical improvement guidelines. The proposal seeks to reduce anxiety, procrastination, and self-sabotage, strengthening mental health and school performance.

Developed with **NotebookLM** and **Gemini Gems**, the system relies on studies regarding motivation, focus, and well-being, ensuring theoretical grounding.

The tool includes ethical alerts encouraging the search for professional help and integrates a future module to refer students to volunteer partner psychologists or free services, making the project safe, accessible, and socially responsible.

## Features

-   **Smart Chat**: Friendly conversational interface for venting and guidance.
-   **Accessibility**: Support for themes (Light/Dark), adjustable font size, high contrast mode, and reduced motion.
-   **Voice Input**: Microphone interaction to facilitate feeling reporting.
-   **File Upload**: Ability to analyze images and documents for additional context.
-   **Privacy and Ethics**: Ethical alerts encouraging professional help when necessary.

## Technologies

### Frontend
-   [React](https://reactjs.org/) - UI Framework
-   [Vite](https://vitejs.dev/) - Build Tool
-   [Framer Motion](https://www.framer.com/motion/) - Animations
-   Web Speech API - Voice Recognition

### Google AI Suite
-   **[Google Gemini 1.5 Flash](https://ai.google.dev/)** - Main AI Engine
-   **[NotebookLM](https://notebooklm.google.com/)** - Prompt Engineering & Research
-   **[Gemini Gems](https://blog.google/products/gemini/google-gemini-update-august-2024/)** - Personality Customization

## Getting Started

### Prerequisites

-   Node.js (version 14 or higher)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/LeonZZlambda/PsyMindAI.git
    ```

2.  Install dependencies:
    ```bash
    cd PsyMindAI
    npm install
    ```

3.  Configure Google Gemini API (optional for demo):
    ```bash
    cp .env.example .env
    # Add your VITE_GEMINI_API_KEY in .env file
    ```
    See [SETUP.md](SETUP.md) for detailed instructions.

4.  Start the development server:
    ```bash
    npm run dev
    ```

## Google AI Integration

PsyMind.AI leverages Google's AI suite:

- **Gemini API**: Powers intelligent, context-aware conversations
- **NotebookLM**: Used to develop and refine psychological prompts based on educational research
- **Gemini Gems**: Customizes AI personality for empathetic teen support

The system works in **demo mode** without API key, or with **full AI capabilities** when configured.

## Key Features

### 🧠 Intelligent Chat
- Real-time conversations powered by Google Gemini
- Context-aware responses with conversation history
- Empathetic tone optimized for adolescents

### 🎯 Student Tools
- **Pomodoro Timer**: Focus sessions with break reminders
- **Mood Tracker**: Daily emotional monitoring
- **Guided Breathing**: Multiple meditation techniques with visual guide
- **Reflections**: Curated quotes for self-reflection
- **Soundscapes**: Ambient sounds for concentration

### ♿ Accessibility
- Light/Dark themes
- Adjustable font sizes
- High contrast mode
- Reduced motion support
- Voice input

## Disclaimer

**PsyMind.AI offers educational support and does not replace professional psychological or psychiatric monitoring.** In severe cases, please seek specialized help.

## License

This project is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).

