# 🎨 Guia de Estilos (Styling Guide)

O **PsyMindAI** não utiliza frameworks de CSS-in-JS (como Tailwind ou Styled Components). O projeto adota uma arquitetura modular de CSS puro nativo dividida por funcionalidade dentro de `src/styles/`. O layout baseia-se em Variáveis CSS declaradas no `root`.

As marcações CSS são injetadas primariamente pelo empacotador (Vite) partindo da `index.css` para montagem final.

## 📏 Princípios Gerais

1.  **Variáveis CSS** (`variables.css` e `base.css`): Cores, fontes, espaçamento, sobras e transições.
2.  **Separação em Componentes**: 
    - Ex: Modais têm seus próprios estilos ex: `mood.css`, `pomodoro.css`, `learning.css`.
    - Componentes de Layout Base como header, mensagens de chat ou input possuem `header.css`, `chat.css` e `components.css`.
3.  **Movimento Reduzido (Motion)** (`animations.css`): Por meio do `ThemeContext` e CSS com `prefers-reduced-motion`, a aplicação respeita utilizadores que desativam ou ativam animações no sistema operacional ou app.
4.  **Acessibilidade**: Contrastes fortes e compatibilidade daltônica encontram-se em `accessibility.css` que altera o tema com as classes (`.high-contrast`, `.colorblind-mode`).

## 🖋️ Regras de Customização

Quando for adicionar novo CSS no projeto, adicione sempre o nome mais focado no próprio arquivo em `src/styles/` e importe ele. Não infle o `base.css` artificialmente.

Exemplos de como um escopo visual é implementado usando o Framer Motion sem colidir com as Transições de Tema:

*   **Framer Motion (`motion.div`)**: Evite usar transições CSS agressivas nos sub-itens se a mãe inteira já sofre manipulação do `framer-motion`. Isso evita saltos na animação.
*   **Transition Duration Base**: Use `var(--transition-base)` e `var(--transition-smooth)` sempre que configurar algo que expande/recolhe no hover ou focus.
