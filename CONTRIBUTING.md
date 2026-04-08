# Contributing to PsyMind.AI

Thank you for considering a contribution to PsyMind.AI. This document explains the expected workflow for code, documentation, and design contributions.

## Quickstart

1. Fork this repository.
2. Create a descriptive branch: `git checkout -b feature/my-feature`.
3. Make small, atomic commits with clear messages.
4. Open a Pull Request (PR) against the `main` branch of the original repository.

## Local development

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Run `npm run lint` before opening a PR.

## Code standards

- Follow the ESLint rules configured in the repository. Run `npm run lint`.
- Avoid large, unrelated formatting changes; keep diffs focused.
- React components should be functional and use hooks where appropriate.

## Tests

There is currently no automated test suite. If you add tests, include instructions in the PR and update `package.json` to expose `npm test`.

## Pull requests

Please include in your PR:

- Traduções: se você estiver contribuindo com traduções da UI, inclua as novas chaves nos arquivos de tradução (pt/translation.json e en/translation.json) e descreva no PR o que foi traduzido.
- A short description of the issue or feature
- Steps to test locally
- Checklist:
  - [ ] Local build works (`npm run dev`)
  - [ ] `npm run lint` passes
  - [ ] Documentation updated (README/SETUP/ARCHITECTURE when applicable)
  - [ ] `CHANGELOG.md` updated with a suitable note

## Security

If you discover a security vulnerability, follow the instructions in `SECURITY.md`. Do not disclose details in a public issue until a coordinated fix is available.

## Code of conduct

Treat maintainers and other contributors respectfully. See `CODE_OF_CONDUCT.md` for details.

Thank you for helping improve PsyMind.AI!
