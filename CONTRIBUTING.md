# Contributing to PsyMind.AI

Thank you for contributing to PsyMind.AI! We welcome community contributions to help improve our psychoeducational self-regulation tools, OBI evaluations, and accessibility features.

To maintain professional, senior-level open-source quality (similar to Google/MIT repositories), please follow these guidelines when opening issues, submitting code, or writing documentation.

---

## 🤝 Code Standards

We use a modern TypeScript (React 19) client-side stack. When writing code:
- **TypeScript Strictness**: Define proper interfaces/types for all component properties, hooks, and services. Avoid the use of `any` types.
- **Path Aliases**: Utilize Vite absolute path imports mapped to the `@/` alias (e.g. `import { CustomSelect } from '@/components/ui/CustomSelect'`).
- **Separation of Concerns**: UI components should be thin and declarative. Business logic must be encapsulated in React Context Providers (`src/context/`), Custom Hooks (`src/hooks/`), or pure logic services (`src/services/`).
- **Linter & Formatting**: All files must comply with ESLint configurations. Verify syntax by running `npm run lint`.

---

## 🌐 Localization & Translations

PsyMind.AI supports multiple international languages. Translations are organized in JSON files under:
```text
src/i18n/locales/<lang_code>/translation.json
```
If you add UI labels or text parameters:
1. Add matching translation keys to the relevant language translation files (e.g., `src/i18n/locales/pt/translation.json`, `src/i18n/locales/en/translation.json`).
2. Utilize the `useTranslation` hook inside your components to interpolate translations dynamically.

---

## 🧪 Testing with Vitest

We run automated unit and integration tests using **Vitest** and **jsdom** to prevent regressions across self-regulation logic and the memory engine.

### 1. Running Tests
```bash
# Run tests in watch mode
npm run test

# Run tests once with code coverage analysis
npm run test:ci
```

### 2. Testing Strategies & Engineering
A senior-level PR is expected to have appropriate test coverage. Write tests following these core principles:
- **Service & Logic Mocking**: When writing tests for modules that make external API requests (such as the Gemini client), mock the service layer to avoid hitting Google AI quotas:
  ```typescript
  import { vi, describe, it, expect } from 'vitest';
  import { sendChatMessage } from '@/services/chat/chatService';

  vi.mock('@/services/api/providers/GeminiProvider', () => ({
    GeminiProvider: vi.fn().mockImplementation(() => ({
      generateStream: vi.fn().mockResolvedValue(['Mock response chunk'])
    }))
  }));
  ```
- **Temporal Mocks (Fake Timers)**: For tools containing interval timing or time decay calculations (like Pomodoro timers or Spaced Repetition logs), use fake timers to evaluate time offsets deterministically:
  ```typescript
  vi.useFakeTimers();
  // ... trigger interval start
  vi.advanceTimersByTime(25 * 60 * 1000); // Advance 25 minutes
  expect(timerState.completed).toBe(true);
  vi.useRealTimers();
  ```
- **Accessibility & Focus Tests**: Verify keyboard navigation and modals. For example, testing that our modal renderer locks keyboard tab index focus and closes cleanly when hitting the `Escape` key.
- **State Ingestion Tests**: Check that context state values are properly formatted and correctly appended into system prompt builders.

---

## 🚀 Pull Request Checklist

Before submitting a Pull Request, verify your branch complies with the development standards:

- [ ] **Type-checking passes**: Run `npm run type-check` to confirm no compiler errors.
- [ ] **Linter passes**: Run `npm run lint` to guarantee syntax formatting conforms to rules.
- [ ] **Vitest passes**: Run `npm run test:ci` to verify all 32 tests compile and pass successfully.
- [ ] **Production builds successfully**: Run `npm run build` and `npm run preview` to verify Vite asset compression compiles without asset load failures.
- [ ] **Documentation is updated**: Document any changes to configuration keys or architectures.
- [ ] **Translations are mapped**: Check that all new UI text fields have corresponding translation entries.
