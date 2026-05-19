# Account Modal - Estrutura Modular

## 📁 Estrutura de Arquivos

```
account-modal/
├── index.ts                    # Exportações públicas
├── types.ts                    # Tipos e interfaces
├── useAccountModal.ts          # Hook customizado para lógica de estado
├── SegmentedControl.tsx        # Componente reutilizável de controle segmentado
├── AccountView.tsx             # View principal da conta
└── PersonalizationView.tsx     # View de personalização
```

## 🎯 Padrão de Design

### Modularização
- **Separação de Responsabilidades**: Cada arquivo tem uma única responsabilidade
- **Componentes Reutilizáveis**: SegmentedControl pode ser usado em outros contextos
- **Lógica Isolada**: Hook customizado gerencia todo o estado e lógica de negócio
- **Tipos Centralizados**: Todas as interfaces em um único arquivo

### Integração com BaseModal
O AccountModal agora usa o `BaseModal` como wrapper, seguindo o padrão dos outros modais do projeto:
- Animações gerenciadas pelo BaseModal
- ESC key handling automático
- Overlay click handling
- Focus management
- Acessibilidade (ARIA)

### Views Separadas
- **AccountView**: Tela principal com avatar, menu e footer
- **PersonalizationView**: Tela de configurações de personalização

Transições entre views são gerenciadas com `framer-motion` (AnimatePresence).

## 🔧 Como Usar

### Importação Básica
```tsx
import AccountModal from './components/AccountModal'
// ou
import AccountModal from './components/account-modal'
```

### Props
```tsx
interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenStudyStats?: () => void
  initialView?: 'account' | 'personalization'
}
```

### Exemplo de Uso
```tsx
<AccountModal
  isOpen={isAccountOpen}
  onClose={() => setIsAccountOpen(false)}
  onOpenStudyStats={() => setIsStatsOpen(true)}
  initialView="account"
/>
```

## 🎨 Customização

### Adicionar Nova View
1. Criar componente em `account-modal/NovaView.tsx`
2. Adicionar tipo em `useAccountModal.ts`: `'account' | 'personalization' | 'nova'`
3. Adicionar case no `AnimatePresence` do `AccountModal.tsx`

### Adicionar Novo Campo de Perfil
1. Atualizar interface `ProfileSettings` em `types.ts`
2. Atualizar `DEFAULT_PROFILE` em `types.ts`
3. Adicionar campo na UI em `PersonalizationView.tsx`

## 📦 Exportações

O arquivo `index.ts` exporta:
- `default`: Componente AccountModal
- `useAccountModal`: Hook customizado
- Todos os tipos de `types.ts`

## ✅ Benefícios

1. **Escalável**: Fácil adicionar novas views e funcionalidades
2. **Modularizado**: Componentes pequenos e focados
3. **Padronizado**: Segue o padrão BaseModal do projeto
4. **Testável**: Lógica isolada em hooks facilita testes
5. **Manutenível**: Código organizado e bem documentado
6. **Reutilizável**: Componentes podem ser usados em outros contextos

## 🔄 Migração

O modal foi refatorado de uma implementação monolítica para uma estrutura modular, mantendo:
- ✅ Todas as funcionalidades originais
- ✅ Animações e transições
- ✅ Estilos e aparência
- ✅ Acessibilidade
- ✅ Compatibilidade com o resto do projeto

## 🎯 Padrões do Projeto

Este modal agora segue os mesmos padrões de:
- `SettingsModal.tsx`
- `HelpModal.tsx`
- `MoodTrackerModal.tsx`
- `PomodoroModal.tsx`

Todos usam `BaseModal` como wrapper e seguem a mesma estrutura de código.
