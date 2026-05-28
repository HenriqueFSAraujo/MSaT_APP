# CLAUDE.md — Contexto do projeto `edu-bolsas-frontend` (MSaT_APP)

Este arquivo orienta agentes (Claude Code e similares) em sessões futuras. Antes de propor mudanças, leia esta seção inteira.

> **Projeto irmão (backend)**: `C:\workspace-henrique\agenda-service` — Spring Boot 2.5.9 / Java 17. Ver `CLAUDE.md` lá.
> **Mudanças no front que afetam o backend (ou vice-versa) devem ser coordenadas**.

---

## 1. Visão geral

**Domínio**: Front-end do **Cadastro Social de Bolsas** (Educa Bolsas / Rede Agostinianas) — consome a API `agenda-service`. Telas para:

1. Login (admin e aluno)
2. Painel de usuários (CRUD de admins/alunos) — só admin
3. Formulários multi-etapa do aluno (dados pessoais, parentes, endereço, condições habitacionais, bens, composição familiar, documentos, declarações)
4. Geração e visualização do **Parecer Socioeconômico** em PDF — só admin

**Repositório original**: `https://github.com/HenriqueFSAraujo/MSaT_APP`
**Deploy de produção**: `https://educabolsas.netlify.app`
**API consumida**: `VITE_API_URL` (em prod: `https://asap-api-production.up.railway.app/api`)

---

## 2. Stack

| Camada | Tecnologia |
|---|---|
| Bundler | Vite 5 |
| Linguagem | TypeScript 5.5 |
| UI | React 18 |
| Component lib | shadcn/ui (Radix UI primitives) |
| Estilos | Tailwind CSS 3 + tailwind-merge + class-variance-authority |
| Forms | **React Hook Form 7** + Zod (mas `DialogCreateUser` usa `useState` puro — inconsistência) |
| HTTP | Axios |
| Server state | TanStack Query v5 |
| Client state | Zustand 5 (rc) |
| Animações | Framer Motion |
| Routing | React Router DOM v6 |
| Permissões | @casl/ability |
| JWT decode | jwt-decode |
| Ícones | lucide-react |
| Datas | date-fns + dayjs (duas libs — redundante) |

**Aliases**: `@` → `./src` (configurado em `vite.config.ts` e `tsconfig`)

---

## 3. Estrutura de pastas

```
src/
├── main.tsx                     ← Bootstrap (não revisado em detalhe)
├── App.tsx
├── assets/                      ← imagens, fontes
├── Auth/Login/Routes/           ← rotas protegidas por role (CASL)
├── routes/                      ← index.tsx — rotas top-level
├── lib/                         ← utils (ex: cn)
├── store/                       ← Zustand stores
│   ├── useAuthStore.ts          ← user logado, token, firstLogin
│   ├── useScholarshipFormStore.ts ← rascunho de formulários
│   └── tabStore.ts              ← controle de tabs
├── services/
│   ├── api.ts                   ← axios instance (baseURL = VITE_API_URL)
│   ├── endpoints.ts             ← constantes de rotas REST
│   └── queries/                 ← React Query hooks
│       ├── useGetUsers.ts
│       ├── useCreateUser.ts
│       ├── useChangePassword.ts
│       ├── useChangeStatusUser.ts
│       ├── useSocioeconomic.ts
│       └── forms/               ← hooks por formulário
│
├── pages/
│   ├── Login/
│   ├── Users/                   ← Painel de usuários (admin)
│   ├── StudentForm/             ← Formulários multi-etapa do aluno
│   ├── StudentPortal/           ← Portal do aluno
│   ├── SocioeconomicReport/     ← Geração do parecer
│   └── NotFound/
│
├── components/
│   ├── ui/                      ← shadcn primitives (Button, Dialog, Select, Badge, etc.)
│   ├── common/                  ← componentes reutilizáveis do app
│   │   ├── DialogCreateUser/
│   │   ├── DialogChangeStatusUser/
│   │   ├── DialogPerfilAction/
│   │   ├── DialogLogOut/
│   │   ├── DialogAction/
│   │   ├── FormInput/, FormSelect/, FormTextarea/, FormDate/
│   │   ├── InputFile/, MultipleInputFile/
│   │   ├── DynamicInputSection/
│   │   ├── RadioButtonGroup/
│   │   ├── TooltipAction/
│   │   └── AnimatedIconButton/
│   ├── UsersTable/
│   ├── UsersFilters/
│   ├── UsersMetricsCards/
│   ├── Header/, Layout/, Menu/
│   ├── PersonalData/, ParentalData/, AddressResidence/, HousingConditions/,
│   ├── PropertyRelations/, FamilyComposition/, DocumentData/, ScholarshipProcessInfo/
│   └── (cada um com type/ subpasta para tipagem local)
└── utils/
    ├── toast.ts                 ← wrapper do sonner
    ├── transformMasks.ts        ← formatCpf, etc.
    └── outros
```

---

## 4. Integração com o backend

### Base URL
```ts
api.baseURL = import.meta.env.VITE_API_URL
```

### Endpoints centralizados em `services/endpoints.ts`:
```ts
Endpoints.Users.List          = '/users'
Endpoints.Auth.Login          = '/auth/login'
Endpoints.Forms.Personal_Data = '/forms'
Endpoints.Forms.Parental_Data = '/parentes'
...
```

### Auth
- Login → JWT salvo em `localStorage.token`
- Cada `useMutation` que precisa de auth adiciona `Authorization: Bearer ${token}` manualmente
- **NÃO há interceptor global do Axios** — repetição em cada hook. Candidato a refactor.

### CORS
Backend lista `https://educabolsas.netlify.app`, `http://localhost:5173`, `http://localhost:3000` como origins permitidas.

---

## 5. Mapa de fluxos principais

### Cadastro de novo usuário (admin) — `DialogCreateUser`
1. Admin abre o modal em `/users` (página `pages/Users/Users.tsx`)
2. Preenche: `fullName`, `cpf`, `email`, `roleName` (Admin/Aluno)
3. **Se `roleName = Aluno`** → preenche também `tipoAluno` (Particular/Gratuita)
4. Submit → `POST /api/users` via `useCreateUser`
5. Backend valida (`UserInfoService.validateTipoAluno`)
6. `useCreateUser` invalida cache `['users']` e atualiza a tabela

> **IMPORTANTE**: o `tipoAluno` é obrigatório no backend quando `roleName = ROLE_USER`. Se omitido, retorna `400`.

### Login
1. `POST /auth/login` → recebe JWT
2. JWT vai pro `useAuthStore` e `localStorage`
3. Redirect para `/users` (admin) ou portal do aluno
4. `firstLogin === true` → abre modal de troca de senha

### Formulários do aluno (multi-etapa)
Cada formulário (`PersonalData`, `ParentalData`, `AddressResidence`, etc.) chama um endpoint específico:
- `POST /api/forms` — dados pessoais
- `POST /api/parentes` — parentes
- `POST /api/enderecos` — endereço
- `POST /api/form-condicoes-habitacionais` — condições habitacionais
- `POST /api/bens-posses` — bens (inclui veículos, escolas particulares, PCD, despesas)
- `POST /api/composicao-familiar` — composição familiar
- `POST /api/declaracoes` — declarações
- `POST /api/documentos-gerais-pdf/upload/{campo}` — upload de PDFs

### Geração de parecer (admin)
1. `POST /api/parecer-socioeconomico` cria/atualiza o parecer
2. `GET /api/parecer-socioeconomico/{id}/pdf-base64` retorna o PDF em base64

---

## 6. Dívida técnica conhecida

### 6.1 Inconsistências

| # | Item | Local |
|---|---|---|
| F1 | `DialogCreateUser` usa `useState` puro + Zod, **não** React Hook Form (que está em dependências) | `components/common/DialogCreateUser/DialogCreateUser.tsx` |
| F2 | Toast no `onSuccess` do `useCreateUser` diz **"Senha atualizada com sucesso!"** (texto errado) | `services/queries/useCreateUser.ts:32` |
| F3 | `User.cpf` e `User.email` tipados como `null` literal (deveria ser `string \| null`) — corrigido em 2026-05-27 | `services/queries/useGetUsers.ts` |
| F4 | `Authorization: Bearer` colado manualmente em cada `useMutation`/`useQuery` — duplicação | vários hooks |
| F5 | Two libs de data: `date-fns` + `dayjs` — escolher uma |
| F6 | `RoleFilter` enum + `Role` type + `RoleEnum` strings (`ROLE_ADMIN`, `ROLE_USER`) — três representações para o mesmo conceito |
| F7 | Texto hardcoded para "Aluno" / "Gestor" em vários lugares — sem i18n |
| F8 | `react-dropzone` aparece no `package.json` mas `tsc` reclama de tipos faltando — `npm install` pode resolver |

### 6.2 Segurança / configuração

| # | Item |
|---|---|
| F9 | `VITE_API_URL` no `.env` aponta direto para produção — sem fallback para dev/local |
| F10 | Token JWT em `localStorage` — vulnerável a XSS. Idealmente cookie httpOnly |
| F11 | Sem refresh token — token expira em 10min (ver backend) e usuário é deslogado abruptamente |

### 6.3 Estrutura

| # | Item |
|---|---|
| F12 | Pasta `Auth/Login/Routes/` com convenção PascalCase divergente do resto (`pages/`, `components/`) |
| F13 | Pasta `services/queries/forms/` mistura por feature; outros hooks na raiz de `queries/` |
| F14 | `usersMock.tsx` em `pages/Users/` — mock antigo, candidato a remover |

---

## 7. Comandos úteis

```bash
# Instalar dependências
npm install

# Rodar em dev (abre browser)
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
npm run lint:fix

# Format
npm run format

# Typecheck
npm run typecheck
```

### Variáveis de ambiente

`.env` (commitado por engano? — verificar):
```
VITE_API_URL=https://asap-api-production.up.railway.app/api
```

Para desenvolvimento local apontando para backend local:
```bash
# Crie .env.local (não vai pro git)
VITE_API_URL=http://localhost:8080/api
```

---

## 8. Convenções a respeitar ao mexer

1. **Aliases**: usar `@/...` em vez de paths relativos profundos
2. **Componentes UI**: usar os primitivos de `components/ui/` (shadcn). Não criar Button/Dialog do zero
3. **Forms novos**: usar React Hook Form + Zod (padrão dos `services/queries/forms/`). Não copiar o padrão de `useState` puro do `DialogCreateUser` — esse é caso legado
4. **Mensagens de toast**: usar `utils/toast.ts` (sonner wrapper)
5. **Auth**: cuidado ao tocar — token JWT é manual em cada hook
6. **Tipagem**: o backend retorna campos camelCase, manter no front também
7. **Hooks de API**: padrão `use<Verb><Resource>` (ex: `useCreateUser`, `useGetUsers`)
8. **Animações**: padrão Framer Motion com `containerVariants` + `itemVariants` (ver `Users.tsx` como referência)

---

## 9. Convenção: `tipoAluno` (espelhada no backend)

Quando criar um usuário via `POST /api/users`:

| `roleName` enviado | `tipoAluno` | Comportamento |
|---|---|---|
| `ROLE_USER` | obrigatório (`ESCOLA_PARTICULAR` ou `ESCOLA_GRATUITA`) | Validado no Zod do form + no backend (`UserInfoService`) |
| `ROLE_ADMIN` | `null` (forçado pelo `handleInputChange`) | Backend ignora |

Tipo TS canônico:
```ts
export type TipoAluno = 'ESCOLA_PARTICULAR' | 'ESCOLA_GRATUITA';
```

Definido em `services/queries/useCreateUser.ts` e `useGetUsers.ts` (deduplicação pendente — pode ir pra `types/`).

Na **tabela de usuários** (`UsersTable.tsx`), o `tipoAluno` aparece como badge secundário sob "Aluno":
- `ESCOLA_PARTICULAR` → badge amarelo "Particular"
- `ESCOLA_GRATUITA` → badge verde "Gratuita"
- `null` → badge cinza "Não classificado" (alunos antigos, 194 cadastrados antes da migration V52)

---

## 10. Histórico de mudanças aplicadas

### 2026-05-27 — Feature `tipoAluno` (sincronizada com backend)

- **`services/queries/useCreateUser.ts`**: tipo `TipoAluno` exportado; `CreateUserPayload.tipoAluno` adicionado
- **`services/queries/useGetUsers.ts`**: `User.tipoAluno` adicionado; `cpf`/`email` corrigidos para `string \| null`
- **`components/common/DialogCreateUser/DialogCreateUser.tsx`**:
  - Schema Zod com `.refine()` validando que `tipoAluno` é obrigatório quando `roleName = ROLE_USER`
  - Campo Select "Tipo de Aluno" renderizado condicionalmente (animado com Framer Motion)
  - `handleInputChange` limpa `tipoAluno` quando admin troca perfil para `ROLE_ADMIN`
  - Payload envia `tipoAluno: null` explícito quando admin
- **`components/UsersTable/UsersTable.tsx`**: badge secundário "Particular" / "Gratuita" / "Não classificado" para alunos
- **Backend pareado**: `agenda-service` migrations V52 (cria `tipo_aluno`) e V53 (alinha `familiar_escola_particular`)

---

## 11. Para o próximo agente

- **Sempre** leia o `CLAUDE.md` do **front** e do **backend** (`C:\workspace-henrique\agenda-service\CLAUDE.md`) antes de mexer em fluxos que cruzam a fronteira
- Para mudanças no payload de qualquer endpoint, coordene com o backend
- Use `TaskCreate`/`TaskUpdate` para tarefas multi-step
- Antes de adicionar dependências, verifique se já não há equivalente (ex: data-fns vs dayjs)
- Mantenha a seção `## 6. Dívida técnica` atualizada — quando uma dívida for paga, mova para `## 10. Histórico`
