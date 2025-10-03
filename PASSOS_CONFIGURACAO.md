# 🚀 Passos para Configurar Criação de Usuários

## ✅ O que foi implementado:

1. **API `/api/users` atualizada** - Agora usa Supabase Auth corretamente
2. **AuthContext melhorado** - Busca dados da tabela `users` 
3. **Cliente Supabase Admin** - Para operações privilegiadas
4. **Verificação de permissões** - Apenas admins podem criar usuários

## 📋 Passos para configurar:

### 1. Configurar Variáveis de Ambiente

Adicione ao seu `.env.local`:

```bash
# Suas variáveis existentes
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# NOVA - Adicione esta:
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Como obter a Service Role Key:**
1. Vá para [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings > API**
4. Copie a **service_role** key (não a anon key!)

### 2. Configurar RLS no Supabase

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- 1. Habilitar RLS na tabela users
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

-- 2. Política para admins lerem todos os usuários
CREATE POLICY "Admins can read all users" ON "public"."users"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "public"."users" 
    WHERE id = auth.uid()::text 
    AND "userType" = 'admin'
  )
);

-- 3. Política para admins criarem usuários
CREATE POLICY "Admins can create users" ON "public"."users"
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."users" 
    WHERE id = auth.uid()::text 
    AND "userType" = 'admin'
  )
);

-- 4. Política para admins atualizarem usuários
CREATE POLICY "Admins can update users" ON "public"."users"
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "public"."users" 
    WHERE id = auth.uid()::text 
    AND "userType" = 'admin'
  )
);

-- 5. Política para admins deletarem usuários  
CREATE POLICY "Admins can delete users" ON "public"."users"
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "public"."users" 
    WHERE id = auth.uid()::text 
    AND "userType" = 'admin'
  )
);

-- 6. Política para usuários verem próprio perfil
CREATE POLICY "Users can view own profile" ON "public"."users"
FOR SELECT USING (auth.uid()::text = id);

-- 7. Política para usuários atualizarem próprio perfil
CREATE POLICY "Users can update own profile" ON "public"."users"
FOR UPDATE USING (auth.uid()::text = id);
```

### 3. Configurar Auth Settings

No Supabase Dashboard:
1. Vá em **Authentication > Settings**
2. **Desabilite** "Enable email confirmations" (temporariamente)
3. Configure **Site URL**: `http://localhost:5000` ou sua URL

### 4. Criar Admin Inicial

Execute no **SQL Editor**:

```sql
-- Criar usuário admin no auth.users
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

-- Inserir na tabela users (linkando com auth.users)
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

### 5. Testar a Funcionalidade

1. **Reinicie** o servidor de desenvolvimento
2. **Faça login** com `admin@turguide.com` / `admin123`
3. **Vá para** `/admin/usuarios`
4. **Teste criar** um novo usuário
5. **Verifique** se o usuário pode fazer login

## 🔧 Troubleshooting

### Erro "Service role não configurado"
- Verifique se `SUPABASE_SERVICE_ROLE_KEY` está no `.env.local`
- Reinicie o servidor após adicionar a variável

### Erro "Acesso negado"
- Certifique-se que o usuário logado tem `userType = 'admin'`
- Verifique se o RLS foi configurado corretamente

### Erro "Email já está em uso"
- O email já existe no Supabase Auth
- Use um email diferente ou delete o usuário existente

### Login não funciona
- Verifique se o usuário foi criado tanto no `auth.users` quanto na tabela `users`
- Confirme que as senhas estão corretas

## 🎯 Resultado Esperado

Após seguir esses passos:
- ✅ Admins podem criar usuários completos
- ✅ Usuários criados podem fazer login
- ✅ Permissões estão configuradas corretamente
- ✅ Todos os admins têm permissão para criar usuários