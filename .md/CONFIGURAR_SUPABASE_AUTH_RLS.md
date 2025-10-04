# Configuração do Supabase Auth e RLS

## 1. Configurar RLS (Row Level Security) 

Execute estes comandos no **SQL Editor** do Supabase:

```sql
-- 1. Habilitar RLS na tabela users
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

-- 2. Política para admins poderem ler todos os usuários
CREATE POLICY "Admins can read all users" ON "public"."users"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "public"."users" 
    WHERE id = auth.uid()::text 
    AND "userType" = 'admin'
  )
);

-- 3. Política para admins poderem criar usuários
CREATE POLICY "Admins can create users" ON "public"."users"
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."users" 
    WHERE id = auth.uid()::text 
    AND "userType" = 'admin'
  )
);

-- 4. Política para admins poderem atualizar usuários
CREATE POLICY "Admins can update users" ON "public"."users"
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "public"."users" 
    WHERE id = auth.uid()::text 
    AND "userType" = 'admin'
  )
);

-- 5. Política para admins poderem deletar usuários
CREATE POLICY "Admins can delete users" ON "public"."users"
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "public"."users" 
    WHERE id = auth.uid()::text 
    AND "userType" = 'admin'
  )
);

-- 6. Política para usuários verem seus próprios dados
CREATE POLICY "Users can view own profile" ON "public"."users"
FOR SELECT USING (auth.uid()::text = id);

-- 7. Política para usuários atualizarem seus próprios dados
CREATE POLICY "Users can update own profile" ON "public"."users"
FOR UPDATE USING (auth.uid()::text = id);
```

## 2. Configurar Service Role Key

1. Vá para **Settings > API** no dashboard do Supabase
2. Copie a **service_role key** (não a anon key!)
3. Adicione ao `.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 3. Configurar Auth

1. Vá para **Authentication > Settings** no Supabase
2. Desabilite **"Enable email confirmations"** (temporariamente para testes)
3. Configure **Site URL**: `http://localhost:3001` (ou sua URL de produção)

## 4. Criar usuário admin inicial

Execute no **SQL Editor**:

```sql
-- Inserir admin inicial (conectado ao Supabase Auth)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@turguide.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"userType": "admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Inserir na tabela users (linkando com o auth.users)
INSERT INTO "public"."users" (
  id,
  email,
  nome,
  "userType",
  status,
  "createdAt",
  "updatedAt"
) 
SELECT 
  id::text,
  email,
  'Admin TourGuide',
  'admin',
  'ativo',
  now(),
  now()
FROM auth.users 
WHERE email = 'admin@turguide.com';
```