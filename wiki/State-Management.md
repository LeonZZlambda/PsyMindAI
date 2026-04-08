# 🧠 Gerenciamento de Estado

O PsyMindAI abandona o Redux ou Redux-Toolkit para ser o mais leve possível e, por padrão, utiliza a **React Context API** (`useContext` hook) de modo modular. 

A centralização e as "fontes da verdade" do projeto residem majoritariamente na pasta `src/context/` ou, em alguns casos, serviços utilitários em `src/services/`.

### 🗂️ Estrutura de Contextos

Existem as seguintes *Providers* encadeadas de forma hierárquica na `src/main.jsx`:

*   **`ThemeContext`**: Gerencia temas e definições de acessibilidade (`colorBlindMode`, `highContrast`, `reducedMotion`). A transição ocorre injetando classes na tag HTML (útil para CSS Variables).
*   **`ChatContext`**: Principal provedor de informações de mensagens (`input`, `messages`, `isStreaming`, `isTyping`). Salva as conversas em `localStorage` sob a chave `chatMessages`. *Se houver intenção de plugar em um backend Real de IA, as requisições API nascerão daqui.*
*   **`PomodoroContext`**: Segura dados vivos do cronômetro globalmente (`timeLeft`, `isActive`, `mode`). Permite que o timer seja referenciado mesmo se as modais estiverem fechadas.
*   **`SoundContext`**: Gera e reproduz arquivos sonoros programáticos ou trilhas para ambiente (Sinos, *White Noise*, Sons da natureza).
*   **`EmotionalJournalContext`** / **`MoodContext`**: Contextos isolados específicos de funcionalidades e persistência paralela em `localStorage`, permitindo visualização de histórico de dias passados.

## 💾 Persistência de Dados e Storage

Neste aplicativo *client-side-only*, **todas** as interações persistentes sobrevivem a *refreshes* devido à pasta de utilidade `src/services/storage/`.

Em fluxos importantes (como os quizzes ou mensagens), quando os dados são calculados localmente, eles são instantaneamente salvos no navegador, ou serializados antes pelo `messageFormatter` (`src/services/chat/`).

> Nota de Segurança: A estrutura anterior de aleatoriedade no aplicativo (ID Generation) gerava chaves com `Math.random()`, agora tudo deve usar a API de criptografia do navegador (`crypto.randomUUID()`) ou bibliotecas seguras instaladas.
