# 🔐 Fluxo de Cadastro e Login - TourGuide CRM

## 📋 Visão Geral

O sistema possui **3 tipos de usuários** com dashboards diferentes:
- 👨‍💼 **Admin** → Dashboard administrativo completo
- 🧑‍🏫 **Guia** → Dashboard do guia de turismo
- 👤 **Cliente** → Área do cliente

---

## 🆕 FLUXO DE CADASTRO

### 1️⃣ Quando você clica em "Criar Conta" no `/register`

**O que acontece:**

```
┌─────────────────────────────────────────────┐
│  Página de Cadastro (/register)             │
│                                              │
│  Campos do formulário:                       │
│  • Nome                                      │
│  • Sobrenome                                 │
│  • Email                                     │
│  • Senha                                     │
│  • Confirmar Senha                           │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  Você preenche e clica "Criar Conta"        │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  Sistema cria usuário no Supabase Auth      │
│  com userType = "cliente" (PADRÃO)          │
│                                              │
│  Dados salvos:                               │
│  • email: seu@email.com                      │
│  • nome: "Nome Sobrenome"                    │
│  • userType: "cliente" ← AUTOMÁTICO         │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  Mensagem de sucesso aparece:               │
│  "Conta criada com sucesso!                 │
│   Verifique seu email para confirmar"       │
└─────────────────────────────────────────────┘
                    │
                    ▼ (após 2 segundos)
┌─────────────────────────────────────────────┐
│  Redirecionamento para /login               │
└─────────────────────────────────────────────┘
```

**⚠️ IMPORTANTE:**
- Todo usuário criado pelo formulário é criado como **"cliente"**
- Você **NÃO pode escolher** ser admin ou guia no cadastro público
- Isso é por segurança!

---

## 🔑 FLUXO DE LOGIN

### 2️⃣ Quando você faz login no `/login`

**O que acontece:**

```
┌─────────────────────────────────────────────┐
│  Página de Login (/login)                   │
│                                              │
│  Campos:                                     │
│  • Email                                     │
│  • Senha                                     │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  Sistema verifica credenciais no Supabase   │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  AuthContext busca o userType do usuário    │
│  na tabela "users"                           │
└─────────────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼                     ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ userType:    │  │ userType:    │  │ userType:    │
│  "admin"     │  │  "guia"      │  │  "cliente"   │
└──────────────┘  └──────────────┘  └──────────────┘
         │                     │                     │
         ▼                     ▼                     ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Redireciona  │  │ Redireciona  │  │ Redireciona  │
│  para:       │  │  para:       │  │  para:       │
│  /admin      │  │  /guia       │  │  /cliente    │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🎯 PARA QUAL DASHBOARD VOCÊ VAI?

### Se você se cadastrar agora:

```
✅ Cadastro pelo /register
   ↓
👤 Usuário criado como "cliente"
   ↓
🔑 Faz login
   ↓
📍 Redireciona para: /cliente
```

### Se você é Admin:

```
❌ NÃO pode se cadastrar pelo /register
   ↓
✅ Admin deve ser criado manualmente no Supabase
   ↓
🔑 Faz login com email admin
   ↓
📍 Redireciona para: /admin
```

### Se você é Guia:

```
❌ NÃO pode se cadastrar pelo /register
   ↓
✅ Guia deve ser criado pelo Admin
   ↓
🔑 Faz login com email do guia
   ↓
📍 Redireciona para: /guia
```

---

## 🔧 COMO CRIAR USUÁRIOS DE CADA TIPO?

### 👤 CLIENTE (pode se cadastrar sozinho)
1. Acesse: http://localhost:3000/register
2. Preencha o formulário
3. Clique em "Criar Conta"
4. ✅ Automaticamente criado como "cliente"

### 👨‍💼 ADMIN (deve ser criado manualmente)

**Opção 1: Pelo Supabase Dashboard**
1. Acesse: https://app.supabase.com
2. Vá em Authentication → Users
3. Clique em "Invite User"
4. Email: admin@turguide.com
5. Senha: (escolha uma senha segura)
6. Depois, no SQL Editor, execute:

```sql
INSERT INTO users (email, nome, user_type)
VALUES ('admin@turguide.com', 'Administrador', 'admin')
ON CONFLICT (email) 
DO UPDATE SET user_type = 'admin';
```

**Opção 2: Via API (em desenvolvimento)**
```bash
curl -X POST http://localhost:3000/api/users/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@turguide.com",
    "password": "SenhaSegura123!",
    "nome": "Administrador"
  }'
```

### 🧑‍🏫 GUIA (criado pelo Admin)
1. Login como Admin
2. Acesse: /admin/usuarios
3. Clique em "Adicionar Guia"
4. Preencha dados do guia
5. ✅ Guia criado com userType="guia"

---

## 🔒 PROTEÇÃO DE ROTAS

O sistema usa o componente `ProtectedRoute` para garantir que:

```typescript
/admin/*      → Só admin pode acessar
/guia/*       → Só guia pode acessar  
/cliente/*    → Só cliente pode acessar
```

Se você tentar acessar uma rota sem permissão:
```
❌ Cliente tenta acessar /admin
   ↓
🚫 ProtectedRoute bloqueia
   ↓
↩️  Redireciona para /cliente
```

---

## 📝 EXEMPLO PRÁTICO

### Cenário 1: Novo Cliente se Cadastrando

```
1. Você acessa: http://localhost:3000/register

2. Preenche:
   Nome: João
   Sobrenome: Silva
   Email: joao@email.com
   Senha: 123456

3. Clica em "Criar Conta"

4. Sistema cria:
   ✅ Email: joao@email.com
   ✅ Nome: "João Silva"
   ✅ userType: "cliente" (automático)

5. Você recebe email de confirmação

6. Confirma email no Supabase

7. Faz login

8. Sistema redireciona para: /cliente
   (Dashboard do Cliente)
```

### Cenário 2: Admin Fazendo Login

```
1. Admin foi criado manualmente no Supabase
   Email: admin@turguide.com
   userType: "admin"

2. Admin acessa: http://localhost:3000/login

3. Digita:
   Email: admin@turguide.com
   Senha: (senha definida)

4. Sistema verifica:
   ✅ Credenciais corretas
   ✅ userType = "admin"

5. Redireciona para: /admin
   (Dashboard Administrativo Completo)
```

---

## 🎨 DASHBOARDS DISPONÍVEIS

### 👨‍💼 Dashboard Admin (/admin)
- ✅ Ver todos agendamentos
- ✅ Gerenciar clientes
- ✅ Gerenciar guias
- ✅ Gerenciar passeios
- ✅ Ver financeiro
- ✅ Calendário global
- ✅ Criar usuários

### 🧑‍🏫 Dashboard Guia (/guia)
- ✅ Ver meus agendamentos
- ✅ Ver meu calendário
- ✅ Ver minhas comissões
- ✅ Atualizar perfil

### 👤 Dashboard Cliente (/cliente)
- ✅ Ver minhas reservas
- ✅ Fazer novas reservas
- ✅ Ver histórico
- ✅ Atualizar perfil

---

## ⚡ RESUMO RÁPIDO

| Ação | Resultado |
|------|-----------|
| Cadastro pelo /register | Cria usuário como **"cliente"** |
| Login com email admin | Redireciona para **/admin** |
| Login com email guia | Redireciona para **/guia** |
| Login com email cliente | Redireciona para **/cliente** |

---

## 🆘 FAQ

**P: Posso me cadastrar como admin?**
R: Não. Admin deve ser criado manualmente no Supabase.

**P: Como sei qual é meu userType?**
R: Depois de fazer login, o sistema redireciona automaticamente para o dashboard correto.

**P: Posso mudar meu userType depois?**
R: Apenas um admin pode mudar o userType de outros usuários.

**P: O que acontece se eu não tiver userType?**
R: O sistema assume "cliente" como padrão e redireciona para /cliente.

**P: Preciso confirmar email?**
R: Depende da configuração do Supabase. Por padrão, sim.
