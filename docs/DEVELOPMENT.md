# 🛠️ Guia de Configuração de Desenvolvimento

Este guia fornece instruções detalhadas para configurar o ambiente de desenvolvimento do **TourGuide CRM**.

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Instalação Rápida](#-instalação-rápida)
- [Configuração Detalhada](#-configuração-detalhada)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Comandos Disponíveis](#-comandos-disponíveis)
- [Ferramentas de Desenvolvimento](#-ferramentas-de-desenvolvimento)
- [Debugging](#-debugging)
- [Testes](#-testes)
- [Banco de Dados](#-banco-de-dados)
- [Workflow de Desenvolvimento](#-workflow-de-desenvolvimento)
- [Troubleshooting](#-troubleshooting)

## 📋 Pré-requisitos

### Software Necessário

#### Node.js e npm
```bash
# Verificar versões instaladas
node --version  # >= 18.0.0
npm --version   # >= 8.0.0

# Instalar Node.js (recomendado via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Git
```bash
# Verificar instalação
git --version

# Configurar (se necessário)
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"
```

#### Editor de Código
**Recomendado: Visual Studio Code**
- [Download VSCode](https://code.visualstudio.com/)
- Extensões recomendadas (ver seção de ferramentas)

### Contas/Serviços (Opcional)
- **GitHub**: Para contribuições
- **Turso**: Banco de dados em produção
- **Vercel**: Deploy automático

## 🚀 Instalação Rápida

### 1. Clonar o Repositório
```bash
# Via HTTPS
git clone https://github.com/Elisson78/turguide.git

# Via SSH (recomendado se tiver chave configurada)
git clone git@github.com:Elisson78/turguide.git

cd turguide
```

### 2. Instalar Dependências
```bash
# Instalar todas as dependências do monorepo
npm install

# Verificar se tudo foi instalado corretamente
npm run check-types
```

### 3. Configurar Banco de Dados
```bash
# Gerar migrações
npm run db:generate

# Aplicar migrações
npm run db:migrate

# Popular com dados de exemplo
npm run db:seed
```

### 4. Iniciar Servidores
```bash
# Iniciar ambos os servidores (frontend + backend)
npm run dev

# OU iniciar separadamente
npm run dev:web     # Frontend na porta 3001
npm run dev:server  # Backend na porta 3000
```

### 5. Verificar Instalação
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api/trpc
- **Database Studio**: http://localhost:4983

## ⚙️ Configuração Detalhada

### Estrutura de Pastas
```
turguide/
├── 📁 apps/
│   ├── 📁 server/          # Backend API (Next.js + tRPC)
│   │   ├── 📁 src/
│   │   │   ├── 📁 app/     # App Router (API Routes)
│   │   │   ├── 📁 db/      # Database (Drizzle ORM)
│   │   │   ├── 📁 lib/     # Configurações tRPC
│   │   │   └── 📁 routers/ # Endpoints da API
│   │   ├── 📄 drizzle.config.ts
│   │   └── 📄 package.json
│   │
│   └── 📁 web/             # Frontend (Next.js + React)
│       ├── 📁 src/
│       │   ├── 📁 app/     # App Router (Páginas)
│       │   ├── 📁 components/ # Componentes React
│       │   ├── 📁 contexts/   # Context API
│       │   ├── 📁 lib/        # Utilitários
│       │   └── 📁 utils/      # Helpers
│       ├── 📄 components.json # shadcn/ui config
│       └── 📄 package.json
│
├── 📁 docs/               # Documentação
├── 📁 scripts/            # Scripts SQL
├── 📄 turbo.json          # Configuração Turbo
├── 📄 package.json        # Dependências raiz
└── 📄 README.md
```

### Variáveis de Ambiente

#### 1. Servidor (apps/server/.env.local)
```env
# Database
DATABASE_URL="file:./turguide.db"
DATABASE_AUTH_TOKEN=""

# Development
NODE_ENV="development"
PORT=3000

# tRPC
TRPC_URL="http://localhost:3000/api/trpc"
```

#### 2. Frontend (apps/web/.env.local)
```env
# API
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_TRPC_URL="http://localhost:3000/api/trpc"

# Development
NODE_ENV="development"
PORT=3001

# Features (opcional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SENTRY=false
```

### Configuração do TypeScript

#### tsconfig.json (raiz)
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

## 📝 Comandos Disponíveis

### Comandos Globais (Raiz)
```bash
# Desenvolvimento
npm run dev              # Iniciar ambos os servidores
npm run dev:web          # Apenas frontend
npm run dev:server       # Apenas backend

# Build
npm run build            # Build de produção
npm run start            # Iniciar servidores de produção

# Qualidade
npm run check-types      # Verificar tipos TypeScript
npm run lint             # Linting (quando configurado)

# Database
npm run db:generate      # Gerar migrações
npm run db:migrate       # Aplicar migrações
npm run db:push          # Push direto (desenvolvimento)
npm run db:studio        # Interface visual do banco
npm run db:seed          # Popular dados de exemplo
```

### Comandos Específicos

#### Frontend (apps/web)
```bash
cd apps/web

npm run dev              # Servidor de desenvolvimento
npm run build            # Build de produção
npm run start            # Servidor de produção
npm run lint             # ESLint
```

#### Backend (apps/server)
```bash
cd apps/server

npm run dev              # Servidor de desenvolvimento
npm run build            # Build de produção
npm run start            # Servidor de produção
npm run db:local         # Banco local com Turso CLI
```

## 🔧 Ferramentas de Desenvolvimento

### Visual Studio Code

#### Extensões Recomendadas
Crie `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss",
    "gruntfuggly.todo-tree"
  ]
}
```

#### Configurações do Workspace
Crie `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Prettier
Crie `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### ESLint
Crie `.eslintrc.json`:
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error"
  }
}
```

## 🐛 Debugging

### Next.js Debugging

#### 1. VS Code Launch Configuration
Crie `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3001"
    }
  ]
}
```

#### 2. Browser DevTools
```typescript
// Adicionar breakpoints no código
debugger;

// Console logs estruturados
console.log('🔍 Debug:', { variable, state });
console.table(arrayData);
console.group('API Call');
console.log('Request:', request);
console.log('Response:', response);
console.groupEnd();
```

### tRPC Debugging
```typescript
// Habilitar logs detalhados
const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    };
  },
});
```

### Database Debugging
```bash
# Visualizar schema
npm run db:studio

# Executar queries manualmente
sqlite3 turguide.db
.schema
SELECT * FROM agendamentos LIMIT 5;

# Logs de queries (desenvolvimento)
DEBUG=drizzle:* npm run dev
```

## 🧪 Testes

### Configuração Jest (Futuro)
```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

### Testes Manuais
```bash
# Testar endpoints da API
curl http://localhost:3000/api/trpc/agendamentos.list

# Testar com dados
curl -X POST http://localhost:3000/api/trpc/agendamentos.create \
  -H "Content-Type: application/json" \
  -d '{"passeioId":"1","clienteId":"1","numeroPessoas":2}'
```

## 🗄️ Banco de Dados

### Drizzle Studio
```bash
# Abrir interface visual
npm run db:studio
# Acesse: http://localhost:4983
```

### Migrações
```bash
# Gerar nova migração após mudanças no schema
npm run db:generate

# Aplicar migrações pendentes
npm run db:migrate

# Push direto (apenas desenvolvimento)
npm run db:push
```

### Seed Data
```bash
# Popular banco com dados de exemplo
npm run db:seed

# Limpar e repopular
rm turguide.db
npm run db:migrate
npm run db:seed
```

### Queries Manuais
```bash
# Conectar ao banco SQLite
sqlite3 turguide.db

# Comandos úteis
.tables                    # Listar tabelas
.schema agendamentos       # Ver estrutura da tabela
SELECT * FROM passeios;    # Query simples
.exit                      # Sair
```

## 🔄 Workflow de Desenvolvimento

### 1. Iniciar Nova Feature
```bash
# Atualizar main
git checkout main
git pull origin main

# Criar nova branch
git checkout -b feature/nome-da-feature

# Iniciar desenvolvimento
npm run dev
```

### 2. Durante o Desenvolvimento
```bash
# Verificar tipos frequentemente
npm run check-types

# Testar mudanças
npm run build

# Commit frequente
git add .
git commit -m "feat: adiciona funcionalidade X"
```

### 3. Antes de Fazer Push
```bash
# Verificar se tudo funciona
npm run build
npm run check-types

# Atualizar com main
git checkout main
git pull origin main
git checkout feature/nome-da-feature
git rebase main

# Push da branch
git push origin feature/nome-da-feature
```

### 4. Code Review
- Criar Pull Request no GitHub
- Aguardar revisão
- Fazer ajustes se necessário
- Merge após aprovação

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. "Module not found"
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar paths no tsconfig.json
# Reiniciar TypeScript server no VSCode: Cmd+Shift+P > "TypeScript: Restart TS Server"
```

#### 2. "Port already in use"
```bash
# Encontrar processo usando a porta
lsof -ti:3000
lsof -ti:3001

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
PORT=3002 npm run dev:web
```

#### 3. Database locked
```bash
# Parar todos os processos
pkill -f "npm run"

# Remover lock (cuidado!)
rm turguide.db-wal turguide.db-shm

# Reiniciar
npm run dev
```

#### 4. TypeScript Errors
```bash
# Verificar versão do TypeScript
npx tsc --version

# Reinstalar dependências de tipos
npm install --save-dev @types/node @types/react @types/react-dom

# Limpar cache TypeScript
rm -rf .next
npm run dev
```

#### 5. Build Failures
```bash
# Verificar logs detalhados
npm run build --verbose

# Limpar tudo e reconstruir
npm run clean  # Se disponível
rm -rf .next
npm run build
```

### Logs Úteis

```bash
# Logs do Next.js
tail -f .next/server/trace

# Logs do banco
DEBUG=drizzle:* npm run dev

# Logs do sistema
console.log('🔍 Debug Info:', {
  nodeVersion: process.version,
  platform: process.platform,
  memory: process.memoryUsage(),
  uptime: process.uptime()
});
```

### Performance

```bash
# Analisar bundle
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build

# Verificar performance
npm install -g lighthouse
lighthouse http://localhost:3001
```

## 📚 Recursos Adicionais

### Documentação Oficial
- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

### Ferramentas Online
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind Play](https://play.tailwindcss.com/)
- [tRPC Playground](https://trpc.io/docs/playground)
- [Regex101](https://regex101.com/)

### Comunidade
- [Next.js GitHub](https://github.com/vercel/next.js)
- [tRPC Discord](https://trpc.io/discord)
- [Tailwind Discord](https://discord.gg/7NF8GNe)

---

## 🤝 Precisa de Ajuda?

- **GitHub Issues**: Para bugs específicos
- **Discussions**: Para perguntas gerais
- **Email**: uzualelisson@gmail.com

---

<div align="center">

**[⬆ Voltar ao topo](#-guia-de-configuração-de-desenvolvimento)**

Desenvolvido com ❤️ para a comunidade TourGuide

</div>
