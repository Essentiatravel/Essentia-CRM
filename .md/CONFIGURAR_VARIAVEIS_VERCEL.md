# 🔐 Como Configurar Variáveis de Ambiente na Vercel

## 📋 Passo a Passo

### 1️⃣ Acessar o Dashboard da Vercel

1. Acesse: https://vercel.com/dashboard
2. Faça login com sua conta
3. Encontre o projeto **EssentiaCRM**
4. Clique no projeto para abrir

### 2️⃣ Ir para Configurações

1. No menu superior do projeto, clique em **"Settings"**
2. No menu lateral esquerdo, clique em **"Environment Variables"**

### 3️⃣ Adicionar Cada Variável

Para cada variável abaixo, siga este processo:

1. Clique em **"Add New"** ou **"Add Another"**
2. Preencha os campos:
   - **Name**: Nome da variável (copie exatamente como está abaixo)
   - **Value**: O valor correspondente
   - **Environment**: Marque **Production**, **Preview** e **Development**
3. Clique em **"Save"**

---

## 🔑 Variáveis para Configurar

### 1. NEXT_PUBLIC_SUPABASE_URL

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://nvviwqoxeznxpzitpwua.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

**Como obter:**
- Supabase Dashboard → Settings → API → Project URL

---

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Sua chave anon do Supabase]
Environment: ✅ Production ✅ Preview ✅ Development
```

**Como obter:**
- Supabase Dashboard → Settings → API → Project API keys → `anon` `public`
- É uma chave JWT longa que começa com `eyJhbGc...`

---

### 3. SUPABASE_SERVICE_ROLE_KEY

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Sua chave service_role do Supabase]
Environment: ✅ Production ✅ Preview ✅ Development
```

**Como obter:**
- Supabase Dashboard → Settings → API → Project API keys → `service_role`
- É uma chave JWT longa diferente da anon
- ⚠️ **NUNCA EXPONHA ESTA CHAVE NO FRONTEND!**

---

### 4. SUPABASE_DB_URL

```
Name: SUPABASE_DB_URL
Value: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
Environment: ✅ Production ✅ Preview ✅ Development
```

**Como obter:**
- Supabase Dashboard → Settings → Database → Connection string
- Selecione **"URI"** e **"Session mode"**
- Substitua `[YOUR-PASSWORD]` pela senha do seu projeto

**Exemplo:**
```
postgresql://postgres.nvviwqoxeznxpzitpwua:SuaSenhaAqui@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

### 5. DATABASE_URL

```
Name: DATABASE_URL
Value: [MESMO VALOR DO SUPABASE_DB_URL]
Environment: ✅ Production ✅ Preview ✅ Development
```

**Nota:** Use exatamente o mesmo valor da variável `SUPABASE_DB_URL`

---

### 6. SESSION_SECRET

```
Name: SESSION_SECRET
Value: [String aleatória e segura]
Environment: ✅ Production ✅ Preview ✅ Development
```

**Como gerar no seu terminal:**
```bash
openssl rand -base64 32
```

**Exemplo de valor gerado:**
```
xK9mP2vN5qR8sT1wU4yZ7aB3cD6eF0gH2iJ5kL8mN1oP4qR7sT0uV3wX6yZ9aB2c
```

⚠️ **Gere uma nova chave! Nunca use este exemplo!**

---

### 7. NEXT_PUBLIC_APP_URL

```
Name: NEXT_PUBLIC_APP_URL
Value: https://seu-projeto.vercel.app
Environment: ✅ Production ✅ Preview ✅ Development
```

**Como obter:**
1. Faça o primeiro deploy
2. A Vercel vai gerar uma URL (ex: `https://essentia-crm.vercel.app`)
3. Copie essa URL
4. Adicione esta variável
5. Faça redeploy

**Para Production:**
- Use a URL de produção da Vercel

**Para Preview/Development:**
- Pode usar a mesma URL ou `http://localhost:5000`

---

### 8. NEXT_PUBLIC_SERVER_URL

```
Name: NEXT_PUBLIC_SERVER_URL
Value: [MESMO VALOR DO NEXT_PUBLIC_APP_URL]
Environment: ✅ Production ✅ Preview ✅ Development
```

**Nota:** Use exatamente o mesmo valor da variável `NEXT_PUBLIC_APP_URL`

---

## ✅ Checklist de Configuração

Copie e marque conforme for adicionando:

- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] SUPABASE_DB_URL
- [ ] DATABASE_URL (mesmo valor do SUPABASE_DB_URL)
- [ ] SESSION_SECRET (gerar com openssl)
- [ ] NEXT_PUBLIC_APP_URL (depois do primeiro deploy)
- [ ] NEXT_PUBLIC_SERVER_URL (mesmo valor do NEXT_PUBLIC_APP_URL)

---

## 🔄 Após Adicionar as Variáveis

### Opção 1: Redeploy Automático
1. Vá em **"Deployments"**
2. Clique no último deployment
3. Clique em **"Redeploy"**
4. Aguarde o build completar

### Opção 2: Git Push (Recomendado)
```bash
# Fazer qualquer pequena alteração
echo "" >> README.md
git add .
git commit -m "Update env vars"
git push
```

---

## 📸 Tutorial Visual

### Passo 1: Acessar Environment Variables
```
Dashboard → Seu Projeto → Settings → Environment Variables
```

### Passo 2: Adicionar Nova Variável
```
[Add New] → Name: [NOME] → Value: [VALOR] → Environments: ✅✅✅ → Save
```

### Passo 3: Verificar
```
Você deve ver todas as 8 variáveis listadas
```

---

## 🆘 Problemas Comuns

### ❌ Build ainda falhando?
- Verifique se TODAS as 8 variáveis estão configuradas
- Certifique-se de marcar os 3 ambientes (Production, Preview, Development)
- Faça redeploy após adicionar

### ❌ Erro de conexão com banco?
- Verifique se a `SUPABASE_DB_URL` está correta
- Certifique-se de que a senha está correta (sem `[YOUR-PASSWORD]`)
- Teste a conexão no Supabase Dashboard

### ❌ Erro de autenticação?
- Verifique se `SUPABASE_SERVICE_ROLE_KEY` está correta
- Não confunda com a `ANON_KEY`

---

## 🎯 Ordem Recomendada de Configuração

1. Configure as 6 primeiras variáveis (Supabase + Session)
2. Faça o primeiro deploy
3. Copie a URL gerada pela Vercel
4. Adicione `NEXT_PUBLIC_APP_URL` e `NEXT_PUBLIC_SERVER_URL`
5. Faça redeploy

---

## 🔗 Links Úteis

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Documentação Vercel**: https://vercel.com/docs/environment-variables
- **Documentação Supabase**: https://supabase.com/docs/guides/database/connecting-to-postgres

---

**Desenvolvido para EssentiaCRM** 🚀
