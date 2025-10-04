# 🚨 Configurar Variáveis de Ambiente na Vercel

## ❌ Problema Identificado

**Local:** ✅ Funcionando  
**Vercel:** ❌ Não funciona (faltam variáveis de ambiente)

## 📋 Passo a Passo

### 1. Acessar Vercel
```
https://vercel.com/dashboard
```

### 2. Selecionar Projeto
- Clique em: **essentia-crm-web**

### 3. Ir para Configurações
- Menu: **Settings** → **Environment Variables**

### 4. Adicionar as 6 Variáveis

**Para cada variável:**
1. Clique em **"Add New"**
2. Cole o **nome**
3. Cole o **valor**  
4. Selecione **todos os ambientes** (Production, Preview, Development)
5. Clique em **"Save"**

---

## 🔑 Variáveis para Adicionar

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://nvviwqoxeznxpzitpwua.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dml3cW94ZXpueHB6aXRwd3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjY3MTcsImV4cCI6MjA3NDgwMjcxN30.r3wicWscX1RdwB6p-K0EdQUaB65VEunSfR9NUTYM2Y8
```

### 3. SUPABASE_DB_URL
```
postgresql://postgres:Essentia%402025@db.nvviwqoxeznxpzitpwua.supabase.co:5432/postgres
```

### 4. DATABASE_URL
```
postgresql://postgres:Essentia%402025@db.nvviwqoxeznxpzitpwua.supabase.co:5432/postgres
```

### 5. SUPABASE_SERVICE_ROLE_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dml3cW94ZXpueHB6aXRwd3VhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyNjcxNywiZXhwIjoyMDc0ODAyNzE3fQ.8M1uH5AIERrlFJVyaEil3Pzirp_jqJKUBs34SM7yhTo
```

### 6. NODE_ENV (apenas Production)
```
production
```

---

## 🔄 5. Fazer Redeploy

Após adicionar todas as variáveis:

1. Vá em **Deployments**
2. Clique nos 3 pontinhos do último deploy
3. Clique em **"Redeploy"**
4. Aguarde 2-3 minutos

---

## ✅ Testar

Após redeploy:
```
https://essentia-crm-web.vercel.app/login
```

Deve:
- ✅ Fazer login
- ✅ Redirecionar para /admin
- ✅ Dashboard carregar
- ✅ Menu lateral funcionar

---

## 📝 Arquivo com Variáveis

Veja também: `local/VARIAVEIS_VERCEL_COPIAR.txt`

---

**Configuração completa = Site funcionando na Vercel!** 🚀
