# 🔐 Como Criar Usuário Admin (MÉTODO SEGURO)

⚠️ **IMPORTANTE:** Não usamos API pública para criar admins por segurança!

Existem **2 formas SEGURAS** de criar um usuário administrador:

---

## 🚀 Forma 1: Script Automático (Recomendado)

O script usa diretamente a **Admin API do Supabase** (não expõe rota pública).

```bash
./criar-admin.sh
```

**O que o script faz:**
- ✅ Carrega credenciais do `.env.local` automaticamente
- ✅ Cria usuário no Supabase Auth usando Service Role Key
- ✅ Insere perfil admin na tabela `users`
- ✅ Auto-confirma email (não precisa clicar no link)
- ✅ Totalmente seguro (sem API pública)

**Exemplo de uso:**
```bash
$ ./criar-admin.sh

==================================================
🔐 CRIAR USUÁRIO ADMINISTRADOR (VIA SUPABASE)
==================================================

⚠️  Este script cria o admin DIRETAMENTE no Supabase
    Você precisa das credenciais do Supabase

✅ Variáveis de ambiente carregadas

📧 Email do admin: admin@turguide.com
🔒 Senha (min 6 caracteres): ******
👤 Nome completo: Administrador Sistema

📋 Confirmação:
   Email: admin@turguide.com
   Nome: Administrador Sistema

❓ Confirma a criação? (s/N): s

🔄 Criando usuário admin no Supabase...

📝 Passo 1: Criando usuário no Supabase Auth...
   ✅ Usuário criado no Auth (ID: 6490d79c...)

📝 Passo 2: Inserindo na tabela users...
   ✅ Perfil admin criado na tabela users

==================================================
✅ ADMIN CRIADO COM SUCESSO!
==================================================

📋 Credenciais:
   Email: admin@turguide.com
   Senha: (a que você digitou)
   Tipo: Admin

🌐 Próximos passos:
   1. Acesse: http://localhost:3000/login
   2. Use o email e senha criados
   3. Você será redirecionado para: /admin
```

---

## 🗄️ Forma 2: SQL Direto no Supabase (Manual)

⚠️ **IMPORTANTE:** Este método tem **2 PASSOS OBRIGATÓRIOS**:

**Passo 1:** Criar usuário no Auth **COM SENHA** (pela interface)
**Passo 2:** Executar SQL para torná-lo admin

**❌ SEM O PASSO 1, O USUÁRIO NÃO TERÁ SENHA!**

---

### Passo 1: Criar Usuário no Auth (COM SENHA)

**🚨 NÃO PULE ESTE PASSO! É AQUI QUE A SENHA É CRIADA!**

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Authentication** → **Users**
4. Clique em **"Add User"** (botão verde no canto superior direito)
5. **Preencha TODOS os campos:**

   | Campo | Valor |
   |-------|-------|
   | **Email** | `admin@turguide.com` |
   | **Password** | `Admin123!` (ou outra senha forte) |
   | **Auto Confirm User** | ✅ **MARQUE ESTA CAIXA!** |
   | **User Metadata** | Deixe em branco |

6. Clique em **"Create User"**
7. ✅ Aguarde a mensagem de sucesso

**Agora o usuário TEM senha e pode fazer login!**

---

### Passo 2: Tornar o Usuário Admin (SQL)

**Agora execute o SQL para dar permissão de admin:**

1. No menu lateral, vá em **SQL Editor**
2. Clique em **"New Query"**
3. **Cole este SQL:**

```sql
-- ⚠️ ATENÇÃO: Este SQL apenas ATUALIZA a tabela users
-- Ele NÃO cria senha! A senha foi criada no Passo 1.

INSERT INTO users (id, email, nome, user_type)
SELECT
    id,
    email,
    'Administrador Sistema' as nome,
    'admin' as user_type
FROM auth.users
WHERE email = 'admin@turguide.com'
ON CONFLICT (email)
DO UPDATE SET
    user_type = 'admin',
    nome = 'Administrador Sistema';
```

4. Clique em **"Run"** (ou Ctrl/Cmd + Enter)
5. ✅ Deve aparecer: **"Success. 1 row affected"**

---

### ✅ Verificar se Admin Foi Criado Corretamente

Execute este SQL para confirmar:

```sql
-- Verificar se tudo está OK
SELECT
    u.id,
    u.email,
    u.nome,
    u.user_type,
    au.email_confirmed_at as confirmado_em,
    au.created_at
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'admin@turguide.com';
```

**Deve retornar:**
- ✅ `user_type`: `admin`
- ✅ `email_confirmed_at`: uma data (não NULL)
- ✅ `nome`: `Administrador Sistema`

**Se `email_confirmed_at` for NULL:**
- Você esqueceu de marcar "Auto Confirm User" no Passo 1
- O usuário precisará confirmar email antes de fazer login

---

## ✅ Verificar se Admin Foi Criado

### Via SQL no Supabase:

```sql
-- Listar todos os admins
SELECT id, email, nome, user_type, created_at
FROM users
WHERE user_type = 'admin'
ORDER BY created_at DESC;
```

### Via Login:

1. Acesse: http://localhost:3000/login
2. Digite o email e senha criados
3. Se redirecionar para `/admin` → ✅ Sucesso!

---

## 🔧 Criar Múltiplos Admins

Execute o script várias vezes ou use SQL:

```sql
-- Admin 1
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin1@turguide.com', crypt('Senha123', gen_salt('bf')), now());

INSERT INTO users (id, email, nome, user_type)
SELECT id, email, 'Admin 1', 'admin'
FROM auth.users WHERE email = 'admin1@turguide.com';

-- Admin 2
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin2@turguide.com', crypt('Senha123', gen_salt('bf')), now());

INSERT INTO users (id, email, nome, user_type)
SELECT id, email, 'Admin 2', 'admin'
FROM auth.users WHERE email = 'admin2@turguide.com';
```

---

## ⚠️ Pré-Requisitos

### Para usar o script `criar-admin.sh`:

1. **Arquivo `.env.local` configurado:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
   ```

2. **Service Role Key do Supabase:**
   - Acesse: https://app.supabase.com
   - Vá em **Settings** → **API**
   - Copie a **`service_role` key** (não a `anon` key!)

3. **Permissões:**
   ```bash
   chmod +x criar-admin.sh
   ```

---

## 🔒 Por Que Este Método é Seguro?

### ❌ O QUE NÃO FIZEMOS (inseguro):

- ~~API pública `/api/users/create-admin`~~ → Qualquer um poderia criar admins
- ~~Endpoint sem autenticação~~ → Brechas de segurança
- ~~Rota exposta na internet~~ → Ataques automatizados

### ✅ O QUE FIZEMOS (seguro):

1. **Script local:** Roda apenas na sua máquina
2. **Usa Service Role Key:** Credencial privada do Supabase
3. **Não expõe API:** Nenhuma rota pública para criar admin
4. **Acesso direto ao Supabase:** Bypass do Next.js
5. **Sem interface web:** Não há formulário público de cadastro

---

## 🆘 Erros Comuns

### Erro: "Variáveis de ambiente não configuradas"

**Solução:**
```bash
# Verifique se existe .env.local
ls -la apps/web/.env.local

# Se não existir, crie:
cp apps/web/.env.example apps/web/.env.local

# Edite e adicione suas credenciais:
nano apps/web/.env.local
```

### Erro: "curl: command not found"

**Solução:** Instale curl
```bash
# macOS
brew install curl

# Linux
sudo apt-get install curl
```

### Erro: "Permission denied"

**Solução:**
```bash
chmod +x criar-admin.sh
```

### Erro: "Usuário já existe no Auth"

**Solução:** O usuário já foi criado. Apenas atualize na tabela users:
```sql
UPDATE users 
SET user_type = 'admin' 
WHERE email = 'admin@turguide.com';
```

---

## 📝 Checklist de Criação

- [ ] `.env.local` configurado com credenciais do Supabase
- [ ] `SUPABASE_SERVICE_ROLE_KEY` definida
- [ ] Permissão de execução no script (`chmod +x`)
- [ ] Execute `./criar-admin.sh` ou use SQL
- [ ] Verifique no Supabase Dashboard → Authentication → Users
- [ ] Teste login em http://localhost:3000/login
- [ ] Confirme redirecionamento para `/admin`

---

## 🎯 Fluxo Completo

```
1. Executar Script
   ↓
2. Script carrega .env.local
   ↓
3. Pede email, senha e nome
   ↓
4. Cria usuário no Supabase Auth (Admin API)
   ↓
5. Insere na tabela users com user_type='admin'
   ↓
6. Admin criado!
   ↓
7. Login → Redirecionado para /admin
```

---

## 🔐 Credenciais de Teste

Para desenvolvimento local, você pode usar:

```
Email: admin@turguide.com
Senha: Admin123
```

**⚠️ NUNCA use credenciais simples em produção!**

---

## 📚 Referências

- [Supabase Admin API](https://supabase.com/docs/reference/javascript/auth-admin-createuser)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentação do Projeto](./FLUXO_CADASTRO_LOGIN.md)
