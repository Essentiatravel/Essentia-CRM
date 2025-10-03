# Essentia-CRM

> Sistema de Gerenciamento de Relacionamento com Cliente para Empresas de Turismo

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io/)
[![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API](#-api)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Contato](#-contato)

## 🎯 Sobre o Projeto

O **TourGuide CRM** é uma plataforma completa para gestão de empresas de turismo, desenvolvida para otimizar operações, maximizar receitas e oferecer experiências excepcionais aos clientes. O sistema centraliza todas as operações através de uma interface moderna e intuitiva.

### 🚀 Objetivos

- **Automatizar** processos manuais de gestão
- **Centralizar** informações de clientes, guias e passeios
- **Otimizar** o fluxo de trabalho com sistema Kanban
- **Maximizar** receitas através de controle financeiro
- **Melhorar** a experiência do cliente

## ✨ Funcionalidades

### 🎯 Sistema Kanban de Agendamentos
- Gestão visual de tarefas com drag-and-drop
- Fluxo de status: Em Progresso → Pendente → Confirmado → Concluído
- Cards informativos com todos os detalhes
- Ações rápidas: editar, aprovar, remover

### 👥 Gestão Multi-usuário
- **Administrador**: Controle total do sistema
- **Guia**: Visualização de agendamentos e comissões
- **Cliente**: Exploração e solicitação de passeios

### 📊 Dashboard Inteligente
- Métricas em tempo real
- Estatísticas de negócio
- Gráficos e indicadores
- Ações rápidas personalizadas

### 🗺️ Gestão de Passeios
- Cadastro completo com imagens
- Categorização por tipo
- Controle de disponibilidade
- Gestão de idiomas e inclusões

### 💰 Sistema Financeiro
- Controle de receitas e comissões
- Relatórios detalhados
- Gestão de status de pagamento
- Calculadora automática de valores

### 📱 Interface Responsiva
- Design mobile-first
- Componentes adaptativos
- Navegação otimizada para touch
- Animações suaves

## 🛠 Tecnologias

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework React com SSR
- **[React 19](https://reactjs.org/)** - Biblioteca para interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes reutilizáveis
- **[Framer Motion](https://www.framer.com/motion/)** - Animações
- **[@hello-pangea/dnd](https://github.com/hello-pangea/dnd)** - Drag and Drop

### Backend
- **[tRPC](https://trpc.io/)** - API type-safe
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM TypeScript-first
- **[SQLite](https://www.sqlite.org/)** - Banco de dados
- **[Zod](https://zod.dev/)** - Validação de schemas

### Ferramentas
- **[Turbo](https://turbo.build/)** - Build system para monorepos
- **[Lucide React](https://lucide.dev/)** - Ícones
- **[Sonner](https://sonner.emilkowal.ski/)** - Notificações toast

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** (versão 8 ou superior)
- **Git**

```bash
# Verificar versões
node --version
npm --version
git --version
```

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/Elisson78/turguide.git
cd turguide
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
```bash
# Gerar migrações
npm run db:generate

# Aplicar migrações
npm run db:migrate

# Popular com dados de exemplo
npm run db:seed
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

### 5. Acesse a aplicação
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3000
- **Database Studio**: http://localhost:4983

## 🎮 Uso

### Primeiro Acesso

1. **Acesse** http://localhost:3001
2. **Clique** em "Acesso Admin" no canto inferior direito
3. **Use** as credenciais padrão:
   - Email: `admin@turguide.com`
   - Senha: `admin123`

### Navegação Principal

- **Dashboard**: Visão geral das métricas
- **Agendamentos**: Sistema Kanban de tarefas
- **Clientes**: Gestão de clientes
- **Guias**: Gestão de guias turísticos
- **Passeios**: Catálogo de experiências
- **Financeiro**: Controle financeiro
- **Calendário**: Visualização temporal

### Fluxo de Trabalho

1. **Cadastre** passeios no sistema
2. **Registre** clientes e guias
3. **Crie** agendamentos no Kanban
4. **Acompanhe** o progresso das tarefas
5. **Finalize** e avalie os serviços

## 📜 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Inicia ambos os servidores
npm run dev:web      # Apenas frontend (porta 3001)
npm run dev:server   # Apenas backend (porta 3000)
```

### Build
```bash
npm run build        # Build de produção
npm run start        # Inicia servidores de produção
```

### Banco de Dados
```bash
npm run db:generate  # Gera migrações
npm run db:migrate   # Aplica migrações
npm run db:push      # Push direto para o banco
npm run db:studio    # Interface visual do banco
npm run db:seed      # Popula com dados de exemplo
```

### Qualidade
```bash
npm run check-types  # Verificação de tipos TypeScript
npm run lint         # Linting do código
```

## 🏗 Estrutura do Projeto

```
turguide/
├── apps/
│   ├── server/                 # Backend API
│   │   ├── src/
│   │   │   ├── app/           # Rotas Next.js API
│   │   │   ├── db/            # Configuração do banco
│   │   │   │   ├── migrations/ # Migrações SQL
│   │   │   │   ├── schema.ts  # Schema Drizzle
│   │   │   │   └── seed.ts    # Dados de exemplo
│   │   │   ├── lib/           # Configuração tRPC
│   │   │   └── routers/       # Routers da API
│   │   ├── drizzle.config.ts  # Configuração Drizzle
│   │   └── package.json
│   │
│   └── web/                   # Frontend
│       ├── src/
│       │   ├── app/           # App Router Next.js
│       │   │   ├── admin/     # Páginas administrativas
│       │   │   ├── api/       # API Routes
│       │   │   ├── cliente/   # Área do cliente
│       │   │   └── guia/      # Área do guia
│       │   ├── components/    # Componentes React
│       │   │   └── ui/        # Componentes shadcn/ui
│       │   ├── contexts/      # Contextos React
│       │   ├── lib/           # Utilitários
│       │   └── utils/         # Helpers
│       ├── components.json    # Configuração shadcn/ui
│       └── package.json
│
├── scripts/                   # Scripts SQL
├── docs/                      # Documentação
├── turbo.json                 # Configuração Turbo
├── package.json               # Dependências raiz
└── README.md                  # Este arquivo
```

## 🔌 API

O projeto utiliza **tRPC** para comunicação type-safe entre frontend e backend.

### Routers Disponíveis

#### 📅 Agendamentos (`/trpc/agendamentos`)
```typescript
// Listar agendamentos
trpc.agendamentos.list.useQuery()

// Criar agendamento
trpc.agendamentos.create.useMutation({
  passeioId: string,
  clienteId: string,
  guiaId?: string,
  dataPasseio: string,
  numeroPessoas: number,
  valorTotal: number
})

// Atualizar status
trpc.agendamentos.updateStatus.useMutation({
  id: string,
  status: 'em_progresso' | 'pendente_cliente' | 'confirmadas' | 'concluidas' | 'canceladas'
})
```

#### 👥 Clientes (`/trpc/clientes`)
```typescript
// Listar clientes
trpc.clientes.list.useQuery()

// Criar cliente
trpc.clientes.create.useMutation({
  nome: string,
  email: string,
  telefone?: string,
  endereco?: object,
  preferencias?: string[]
})
```

#### 🗣️ Guias (`/trpc/guias`)
```typescript
// Listar guias ativos
trpc.guias.listActive.useQuery()

// Criar guia
trpc.guias.create.useMutation({
  nome: string,
  email: string,
  especialidades: string[],
  idiomas: string[],
  biografia?: string
})
```

#### 🗺️ Passeios (`/trpc/passeios`)
```typescript
// Listar passeios
trpc.passeios.list.useQuery()

// Criar passeio
trpc.passeios.create.useMutation({
  nome: string,
  descricao: string,
  preco: number,
  duracao: string,
  categoria: string,
  imagens?: string[],
  inclusoes?: string[]
})
```

### Exemplo de Uso

```typescript
import { trpc } from '@/utils/trpc'

function AgendamentosPage() {
  const { data: agendamentos, isLoading } = trpc.agendamentos.list.useQuery()
  const createMutation = trpc.agendamentos.create.useMutation()

  const handleCreate = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        // Recarregar dados
        trpc.useContext().agendamentos.list.invalidate()
      }
    })
  }

  if (isLoading) return <div>Carregando...</div>

  return (
    <div>
      {agendamentos?.map(agendamento => (
        <div key={agendamento.id}>
          {agendamento.passeio?.nome}
        </div>
      ))}
    </div>
  )
}
```

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

### Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: Minha nova feature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. **Abra** um Pull Request

### Padrões de Commit

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para detalhes.

## 📞 Contato

**Elisson Uzual**
- Email: uzualelisson@gmail.com
- GitHub: [@Elisson78](https://github.com/Elisson78)
- LinkedIn: [Elisson Uzual](https://linkedin.com/in/elissonuzual)

**Link do Projeto**: [https://github.com/Elisson78/turguide](https://github.com/Elisson78/turguide)

---

<div align="center">

**[⬆ Voltar ao topo](#-tourguide-crm)**

Feito com ❤️ por [Elisson Uzual](https://github.com/Elisson78)

</div>
