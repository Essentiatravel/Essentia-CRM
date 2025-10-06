-- ============================================================================
-- VERIFICAR E LIMPAR USUÁRIO EXISTENTE
-- ============================================================================
-- Execute este script PRIMEIRO para verificar se o usuário já existe
-- ============================================================================

-- 1. VERIFICAR SE USUÁRIO JÁ EXISTE NO AUTH
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'maraharwood5@gmail.com';

-- 2. VERIFICAR SE USUÁRIO JÁ EXISTE NA TABELA USERS
SELECT
  id,
  email,
  nome,
  user_type,
  created_at
FROM users
WHERE email = 'maraharwood5@gmail.com';

-- ============================================================================
-- SE O USUÁRIO JÁ EXISTIR, EXECUTE ESTE BLOCO PARA ATUALIZAR:
-- ============================================================================

-- 3. ATUALIZAR USUÁRIO EXISTENTE PARA ADMIN (se já existir)
UPDATE users
SET
  user_type = 'admin',
  nome = 'Mara Harwood',
  updated_at = NOW()
WHERE email = 'maraharwood5@gmail.com';

-- 4. ATUALIZAR METADATA NO AUTH
UPDATE auth.users
SET
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{userType}',
    '"admin"'
  ),
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{nome}',
    '"Mara Harwood"'
  ),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'maraharwood5@gmail.com';

-- ============================================================================
-- SE NÃO EXISTIR E VOCÊ QUER RESETAR A SENHA:
-- ============================================================================

-- 5. RESETAR SENHA (se o usuário existir mas você esqueceu a senha)
UPDATE auth.users
SET
  encrypted_password = crypt('mara@2025', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'maraharwood5@gmail.com';

-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================

-- 6. CONFIRMAR QUE ESTÁ TUDO OK
SELECT
  u.id,
  u.email,
  u.nome,
  u.user_type,
  au.email_confirmed_at as email_confirmado,
  au.raw_user_meta_data->>'userType' as metadata_tipo,
  au.created_at as criado_em
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'maraharwood5@gmail.com';

-- ============================================================================
-- RESULTADO ESPERADO:
-- ============================================================================
-- Se retornar dados: o usuário existe e foi atualizado para admin
-- Se não retornar nada: o usuário NÃO existe no banco
-- ============================================================================
