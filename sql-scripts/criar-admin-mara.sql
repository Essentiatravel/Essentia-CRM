-- ============================================================================
-- CRIAR ADMIN: Mara Harwood (maraharwood5@gmail.com)
-- ============================================================================
-- Execute este script no SQL Editor do Supabase
-- https://supabase.com/dashboard/project/nvviwqoxeznxpzitpwua/sql
-- ============================================================================

-- 1. DESABILITAR RLS TEMPORARIAMENTE (necessário para inserir)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. CRIAR USUÁRIO NO AUTH (com senha e email confirmado)
-- Isso cria o usuário com senha usando a função administrativa
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Verificar se usuário já existe
  SELECT id INTO new_user_id
  FROM auth.users
  WHERE email = 'maraharwood5@gmail.com';

  -- Se não existir, criar
  IF new_user_id IS NULL THEN
    -- Criar usuário no auth.users
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
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'maraharwood5@gmail.com',
      crypt('mara@2025', gen_salt('bf')),  -- Senha hasheada
      NOW(),  -- Email já confirmado
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"nome":"Mara Harwood","userType":"admin"}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO new_user_id;

    RAISE NOTICE 'Usuário criado no Auth com ID: %', new_user_id;
  ELSE
    RAISE NOTICE 'Usuário já existe no Auth com ID: %', new_user_id;
  END IF;

  -- 3. INSERIR/ATUALIZAR NA TABELA USERS
  INSERT INTO users (id, email, nome, user_type, created_at, updated_at)
  SELECT
    new_user_id,
    'maraharwood5@gmail.com',
    'Mara Harwood',
    'admin',
    NOW(),
    NOW()
  ON CONFLICT (email)
  DO UPDATE SET
    user_type = 'admin',
    nome = 'Mara Harwood',
    updated_at = NOW();

  RAISE NOTICE 'Perfil admin criado/atualizado na tabela users';
END $$;

-- 4. REABILITAR RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. VERIFICAR SE FOI CRIADO CORRETAMENTE
SELECT
  u.id,
  u.email,
  u.nome,
  u.user_type,
  au.email_confirmed_at as email_confirmado,
  au.created_at as criado_em
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'maraharwood5@gmail.com';

-- ============================================================================
-- RESULTADO ESPERADO:
-- ============================================================================
-- email: maraharwood5@gmail.com
-- nome: Mara Harwood
-- user_type: admin
-- email_confirmado: [data/hora atual]
-- ============================================================================
