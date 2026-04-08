# 🌟 Funcionalidades (Features)

O PsyMindAI não é apenas uma ferramenta de chat, ele incorpora múltiplas funcionalidades terapêuticas e de aprendizado focadas no bem-estar, estudos e autoconhecimento. Cada módulo é lazy-loaded (`React.lazy`) para economizar recursos iniciais da aplicação.

## Módulos Principais

### 1. 💬 Chat (IA Assitente)
*   **Assistente IA Simulado:** Interações fluídas e baseadas em `localStorage` para a retenção do histórico (`ChatContext`).
*   **Streaming (Digitando):** A experiência de leitura é feita caractere a caractere, simulando uma real interação LLM (implementado pelo `sendMessage`).
*   **Menu de Ações Rápidas:** A barra de input (InputArea) carrega ferramentas com atalhos de teclado (ex: `Cmd+K`).

### 2. ⏲️ Pomodoro (`PomodoroModal.jsx` / `PomodoroContext.jsx`)
*   **Contador Progressivo:** Foco, pausa curta e pausa longa. Alertas sonoros (sino suave) habilitados pelo Contexto de Sons.
*   **Estados Temporais:** Temporizador atualizado de perto, rodando como background service.

### 3. 📖 Repertório Emocional / Journal (`EmotionalJournalModal.jsx`)
*   Um diário interativo onde os usuários podem documentar suas emoções de forma guiada, processando medos e sentimentos baseados em prompts cognitivos.

### 4. 🎭 Rastreador de Humor (`MoodTrackerModal.jsx`)
*   Registro cronológico da taxa de humor diária (De péssimo a muito bem).
*   Visualizações semanais com acompanhamento estatístico do usuário.

### 5. 📚 Aprendizado Guiado & Vestibulares (`GuidedLearningModal.jsx` e `ExamsModal.jsx`)
*   Módulo focado em preparação para provas (ENEM, Vestibulares) e revisão espaçada.
*   **Flashcards e Quizzes:** Permite ao usuário interagir com questões de múltipla escolha. Randomizações criptograficamente seguras incluídas (sem `Math.random()`).

### 6. ❤️ Atos de Bondade (`KindnessModal.jsx`)
*   Gerador de pequenos atos de bondade diários para incentivar a compaixão (randomização segura dos desafios).

---

> Todas essas modais são servidas dentro de limites do `Suspense` na `App.jsx`, separando contextos visuais do estado global que lhes dá "vida".
