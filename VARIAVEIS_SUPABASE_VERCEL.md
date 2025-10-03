# 🔑 Guia Completo: Copiar Variáveis do Supabase para Vercel

## 📍 Passo 1: Acessar o Supabase

1. Acesse: https://app.supabase.com
2. Faça login na sua conta
3. Selecione seu projeto (clique nele)

---

## 🔐 Variáveis do Supabase (API)

### 1️⃣ NEXT_PUBLIC_SUPABASE_URL

**Onde encontrar:**
1. No Supabase Dashboard, vá em **Settings** (ícone de engrenagem no canto inferior esquerdo)
2. Clique em **API**
3. Procure por **"Project URL"**

**Copie este valor:**
```
URL: https://[seu-projeto].supabase.co
```

**Cole na Vercel:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://nvviwqoxeznxpzitpwua.supabase.co
```

---

### 2️⃣ NEXT_PUBLIC_SUPABASE_ANON_KEY

**Onde encontrar:**
1. Mesma tela: **Settings** → **API**
2. Role até **"Project API keys"**
3. Procure pela chave **"anon" "public"**
4. Clique no ícone de **olho** para revelar
5. Clique no ícone de **copiar**

**A chave parece com isso:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dml3cW94ZXpueHB6aXRwd3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg0MjU2MDAsImV4cCI6MjAxNDAwMTYwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Cole na Vercel:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Cole a chave anon completa aqui]
```

---

### 3️⃣ SUPABASE_SERVICE_ROLE_KEY

**Onde encontrar:**
1. Mesma tela: **Settings** → **API**
2. Procure pela chave **"service_role"**
3. ⚠️ **ATENÇÃO**: Clique em **"Reveal"** ou no ícone de olho
4. Clique no ícone de **copiar**

**A chave parece com isso (DIFERENTE da anon):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dml3cW94ZXpueHB6aXRwd3VhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODQyNTYwMCwiZXhwIjoyMDE0MDAxNjAwfQ.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

**Cole na Vercel:**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Cole a chave service_role completa aqui]
```

⚠️ **NUNCA EXPONHA ESTA CHAVE NO FRONTEND OU NO GITHUB!**

---

## 🗄️ Variáveis do Banco de Dados

### 4️⃣ SUPABASE_DB_URL

**Onde encontrar:**
1. No Supabase Dashboard, vá em **Settings** → **Database**
2. Role até **"Connection string"**
3. Selecione a aba **"URI"**
4. Selecione o modo **"Session"** (não Transaction)
5. Clique em **"Copy"**

**A string parece com isso:**
```
postgresql://postgres.nvviwqoxeznxpzitpwua:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**⚠️ IMPORTANTE: Substitua `[YOUR-PASSWORD]` pela senha real do banco!**

**Como encontrar a senha:**
- Se você salvou quando criou o projeto, use ela
- Se não lembra, você pode resetar a senha em **Settings** → **Database** → **Database password** → **Reset database password**

**Exemplo final:**
```
postgresql://postgres.nvviwqoxeznxpzitpwua:MinhaS3nh4Sup3rS3gur4@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Cole na Vercel:**
```
Name: SUPABASE_DB_URL
Value: postgresql://postgres.nvviwqoxeznxpzitpwua:[SUA-SENHA]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

### 5️⃣ DATABASE_URL

**Esta é IGUAL à SUPABASE_DB_URL!**

**Cole na Vercel:**
```
Name: DATABASE_URL
Value: [Cole EXATAMENTE o mesmo valor do SUPABASE_DB_URL]
```

---

## 🔒 Variável de Sessão

### 6️⃣ SESSION_SECRET

**Esta você precisa GERAR!**

**Opção A - No Terminal (Mac/Linux):**
```bash
openssl rand -base64 32
```

**Opção B - Online:**
1. Acesse: https://generate-secret.vercel.app/32
2. Clique em "Generate"
3. Copie o valor gerado

**Exemplo de valor gerado:**
```
xK9mP2vN5qR8sT1wU4yZ7aB3cD6eF0gH2iJ5kL8mN1oP4qR7sT0uV3wX6yZ9aB2c
```

**Cole na Vercel:**
```
Name: SESSION_SECRET
Value: [Cole o valor gerado - NUNCA use o exemplo acima!]
```

---

## 🌐 Variáveis da Aplicação

### 7️⃣ NEXT_PUBLIC_APP_URL

**Esta você vai pegar DEPOIS do primeiro deploy!**

**Opção 1: Deixar vazia agora**
```
Name: NEXT_PUBLIC_APP_URL
Value: [deixe vazio por enquanto]
```

**Opção 2: Usar placeholder**
```
Name: NEXT_PUBLIC_APP_URL
Value: https://localhost:5000
```

**Depois do primeiro deploy:**
1. Veja a URL gerada pela Vercel (ex: `https://essentia-crm.vercel.app`)
2. Volte em **Settings** → **Environment Variables**
3. Edite esta variável e coloque a URL real

---

### 8️⃣ NEXT_PUBLIC_SERVER_URL

**Mesma coisa que NEXT_PUBLIC_APP_URL!**

```
Name: NEXT_PUBLIC_SERVER_URL
Value: [Mesmo valor do NEXT_PUBLIC_APP_URL]
```

---

## 📋 Resumo: Checklist de Cópia

### Do Supabase → Vercel:

- [ ] **NEXT_PUBLIC_SUPABASE_URL**
  - Settings → API → Project URL

- [ ] **NEXT_PUBLIC_SUPABASE_ANON_KEY**
  - Settings → API → Project API keys → anon public

- [ ] **SUPABASE_SERVICE_ROLE_KEY**
  - Settings → API → Project API keys → service_role

- [ ] **SUPABASE_DB_URL**
  - Settings → Database → Connection string → URI → Session
  - **Substituir [YOUR-PASSWORD]!**

- [ ] **DATABASE_URL**
  - Copiar o mesmo valor de SUPABASE_DB_URL

- [ ] **SESSION_SECRET**
  - Gerar com: `openssl rand -base64 32`

- [ ] **NEXT_PUBLIC_APP_URL**
  - Deixar vazio ou usar placeholder
  - Atualizar depois do deploy

- [ ] **NEXT_PUBLIC_SERVER_URL**
  - Mesmo valor de NEXT_PUBLIC_APP_URL

---

## 🎯 Como Adicionar na Vercel

Para CADA variável acima:

1. Vá em: https://vercel.com/dashboard
2. Selecione seu projeto **EssentiaCRM**
3. Clique em **Settings**
4. Clique em **Environment Variables**
5. Clique em **Add New**
6. Preencha:
   - **Name**: Nome exato da variável (copie do checklist)
   - **Value**: O valor que você copiou
   - **Environment**: ✅ **Production** ✅ **Preview** ✅ **Development**
7. Clique em **Save**
8. Repita para todas as 8 variáveis

---

## ✅ Depois de Adicionar TODAS as Variáveis

1. Vá em **Deployments**
2. Clique no último deployment
3. Clique em **"Redeploy"**
4. Aguarde o build completar
5. 🎉 Seu site estará no ar!

---

## 🆘 Problemas Comuns

### ❌ "Invalid connection string"
- Certifique-se de substituir `[YOUR-PASSWORD]` pela senha real
- Use o modo **Session**, não Transaction

### ❌ "Unauthorized"
- Verifique se as chaves anon e service_role estão corretas
- Não confunda uma com a outra!

### ❌ Build ainda falhando
- Certifique-se de marcar **Production**, **Preview** E **Development**
- Verifique se TODAS as 8 variáveis foram adicionadas

---

**Criado para EssentiaCRM** 🚀
