# 🔑 CONFIGURAR SUPABASE SERVICE ROLE KEY

## 📋 O QUE É O SERVICE ROLE KEY?

A **Service Role Key** é uma chave especial do Supabase que:
- ✅ Bypassa todas as políticas de RLS (Row Level Security)
- ✅ Tem permissões de administrador total
- ✅ Usado para operações server-side sensíveis
- ⚠️ **NUNCA** deve ser exposta no frontend
- ⚠️ **NUNCA** deve ser commitada no git

## 🔍 ONDE ENCONTRAR A SERVICE ROLE KEY

### Passo a Passo:

1. **Acesse o Dashboard do Supabase**:
   - URL: https://supabase.com/dashboard
   - Projeto: `nvviwqoxeznxpzitpwua`

2. **Navegue até Settings**:
   - Menu lateral esquerdo → ⚙️ **Settings**

3. **Clique em API**:
   - Settings → **API**

4. **Localize "Project API keys"**:
   - Você verá duas chaves:
     - ✅ `anon` / `public` (já temos essa)
     - 🔐 `service_role` (é essa que precisamos!)

5. **Copie a Service Role Key**:
   - Clique em "Reveal" ou no ícone 👁️
   - Copie a chave completa (começa com `eyJ...`)

## 📝 CONFIGURAR NO PROJETO

### Arquivo: `apps/web/.env.local`

Adicione a linha:

```bash
# Abrir arquivo
nano apps/web/.env.local

# OU
code apps/web/.env.local
```

Adicionar ao final do arquivo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nvviwqoxeznxpzitpwua.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dml3cW94ZXpueHB6aXRwd3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjY3MTcsImV4cCI6MjA3NDgwMjcxN30.r3wicWscX1RdwB6p-K0EdQUaB65VEunSfR9NUTYM2Y8
SUPABASE_DB_URL=postgresql://postgres.nvviwqoxeznxpzitpwua:Essentia%402025@aws-1-eu-central-2.pooler.supabase.com:5432/postgres?sslmode=require

# ✅ ADICIONAR ESTA LINHA (substituir pela chave real)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dml3cW94ZXpueHB6aXRwd3VhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODc2NTQzMiwiZXhwIjoyMDE0MzQxNDMyfQ.SEU_SERVICE_ROLE_KEY_AQUI
```

⚠️ **IMPORTANTE**: Substitua `SEU_SERVICE_ROLE_KEY_AQUI` pela chave real do Supabase!

### Salvar e Reiniciar

```bash
# Ctrl+O (salvar) + Enter + Ctrl+X (sair) se usando nano
# Ou Cmd+S se usando VSCode

# Reiniciar servidor Next.js
cd /Users/elissonuzual/Documents/turguide\ replit
npm run dev
```

## 🔒 SEGURANÇA

### ✅ FAZER:
- Adicionar `.env.local` ao `.gitignore`
- Usar variável de ambiente em produção (Vercel/Railway)
- Nunca logar a chave no console
- Usar apenas em server-side code

### ❌ NUNCA FAZER:
- Commitar a chave no git
- Expor em código frontend
- Compartilhar publicamente
- Usar em `NEXT_PUBLIC_*` (essas são públicas!)

## 📊 VERIFICAR SE ESTÁ CONFIGURADO

```bash
cd '/Users/elissonuzual/Documents/turguide replit'

# Verificar se a variável existe (deve mostrar a chave)
grep SUPABASE_SERVICE_ROLE_KEY apps/web/.env.local

# Se não mostrar nada, a variável não está configurada
```

## 🧪 TESTAR APÓS CONFIGURAR

1. **Reiniciar servidor**:
   ```bash
   # Terminal onde está rodando npm run dev
   Ctrl+C
   npm run dev
   ```

2. **Fazer upload**:
   - Ir para: http://localhost:5000/admin/passeios
   - Clicar "Novo Passeio"
   - Fazer upload de imagem
   - Deve funcionar!

3. **Verificar logs no terminal**:
   ```
   📤 Upload - Iniciando upload para Supabase Storage
   🔐 Upload - Validando autenticação
   👤 Upload - Usuário: admin@turguide.com Tipo: admin
   ✅ Upload - Autenticação OK
   📁 Upload - Enviando para Supabase Storage: abc-123.jpg
   ✅ Upload - Sucesso: { fileName: '...', publicUrl: 'https://...' }
   ```

4. **Verificar no Supabase Storage**:
   - Dashboard Supabase → Storage → `cards turs` → `passeios/`
   - Deve ver o arquivo lá!

## 🎯 ESTRUTURA FINAL DO STORAGE

```
Supabase Storage
└── cards turs (bucket público)
    └── passeios/
        ├── abc-123-def-456.jpg
        ├── xyz-789-ghi-012.png
        └── ... (mais imagens)
```

## 📸 URL PÚBLICA DAS IMAGENS

Após upload, a URL será algo como:

```
https://nvviwqoxeznxpzitpwua.supabase.co/storage/v1/object/public/cards%20turs/passeios/abc-123.jpg
```

Essa URL é pública e pode ser acessada de qualquer lugar!

## ⚡ PRÓXIMOS PASSOS

1. **Obter Service Role Key** do Supabase Dashboard
2. **Adicionar** no `apps/web/.env.local`
3. **Reiniciar** servidor
4. **Testar** upload
5. **Verificar** se imagens aparecem nos cards
6. **Celebrar!** 🎉



