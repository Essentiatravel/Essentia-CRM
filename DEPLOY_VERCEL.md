# 🚀 Deploy na Vercel - EssentiaCRM

Guia completo para fazer deploy do projeto na Vercel.

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Conta no [Supabase](https://supabase.com) com projeto configurado
3. Repositório no GitHub

## 🔧 Configuração do Supabase

Antes do deploy, certifique-se de ter:

1. **URL do Supabase**: `https://seu-projeto.supabase.co`
2. **Anon Key**: Chave pública do Supabase
3. **Service Role Key**: Chave privada (nunca exponha publicamente)
4. **Database URL**: String de conexão PostgreSQL do Supabase

### Como obter as credenciais do Supabase:

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Settings** → **API**
3. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
4. Vá em **Settings** → **Database**
5. Copie a **Connection string** (modo URI) → `SUPABASE_DB_URL` e `DATABASE_URL`

## 📦 Passo 1: Preparar o Repositório

1. **Clone ou atualize o repositório:**
```bash
git clone https://github.com/Elisson78/EssentiaCRM.git
cd EssentiaCRM
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Teste localmente:**
```bash
npm run dev:web
```

## 🌐 Passo 2: Deploy na Vercel

### Opção A: Deploy via Dashboard (Recomendado)

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório `Elisson78/EssentiaCRM`
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `cd ../.. && npm install`

### Opção B: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy
cd apps/web
vercel
```

## 🔐 Passo 3: Configurar Variáveis de Ambiente

No dashboard da Vercel, vá em **Settings** → **Environment Variables** e adicione:

### Variáveis Obrigatórias:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
SUPABASE_DB_URL=postgresql://postgres:senha@host.supabase.co:5432/postgres
DATABASE_URL=postgresql://postgres:senha@host.supabase.co:5432/postgres
SESSION_SECRET=gerar_com_openssl_rand_base64_32
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
NEXT_PUBLIC_SERVER_URL=https://seu-dominio.vercel.app
```

### Como gerar SESSION_SECRET:
```bash
openssl rand -base64 32
```

**⚠️ IMPORTANTE:**
- Marque todas como **Production**, **Preview** e **Development**
- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no código frontend
- Use apenas variáveis com prefixo `NEXT_PUBLIC_` no código do cliente

## 🗄️ Passo 4: Configurar Banco de Dados

Execute as migrations no Supabase:

```bash
# Localmente, com as variáveis de ambiente corretas
npm run db:push
```

Ou execute o SQL diretamente no SQL Editor do Supabase Dashboard.

## 🎨 Passo 5: Configurar Storage do Supabase

1. Vá em **Storage** no Supabase Dashboard
2. Crie um bucket chamado `cards turs`
3. Configure as políticas de acesso:

```sql
-- Permitir leitura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'cards turs');

-- Permitir upload apenas para autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cards turs');
```

## ✅ Passo 6: Verificar Deploy

1. Acesse a URL fornecida pela Vercel
2. Teste:
   - ✅ Login de admin
   - ✅ Criação de passeios
   - ✅ Upload de imagens
   - ✅ Dashboard do cliente
   - ✅ Reservas

## 🔧 Troubleshooting

### Erro: "Module not found"
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Database connection failed"
- Verifique se `SUPABASE_DB_URL` está correto
- Certifique-se de usar a connection string com SSL habilitado
- Adicione `?sslmode=require` no final da URL se necessário

### Erro: "Images not loading"
- Verifique se o domínio do Supabase está em `next.config.ts`
- Confirme que o bucket está público
- Teste a URL da imagem diretamente no navegador

### Erro de Build
```bash
# Teste o build localmente
cd apps/web
npm run build
```

## 🔄 Atualizações

Para fazer deploy de novas alterações:

```bash
git add .
git commit -m "Descrição das alterações"
git push origin main
```

A Vercel fará o deploy automático a cada push para `main`.

## 📱 Domínio Personalizado

1. Vá em **Settings** → **Domains** no dashboard da Vercel
2. Adicione seu domínio
3. Configure os DNS conforme instruções
4. Atualize `NEXT_PUBLIC_APP_URL` com o novo domínio

## 🎯 Checklist de Deploy

- [ ] Repositório no GitHub
- [ ] Projeto no Supabase configurado
- [ ] Variáveis de ambiente na Vercel
- [ ] Migrations executadas
- [ ] Storage bucket criado
- [ ] Políticas de acesso configuradas
- [ ] Build testado localmente
- [ ] Deploy realizado
- [ ] Funcionalidades testadas em produção
- [ ] Domínio personalizado (opcional)

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs na Vercel Dashboard
2. Revise as variáveis de ambiente
3. Teste localmente primeiro
4. Consulte a documentação oficial:
   - [Vercel Docs](https://vercel.com/docs)
   - [Next.js Docs](https://nextjs.org/docs)
   - [Supabase Docs](https://supabase.com/docs)

---

**Desenvolvido para EssentiaCRM** 🚀
