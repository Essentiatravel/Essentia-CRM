-- Script para corrigir o user_metadata do usuário admin
-- Execute este script no Supabase SQL Editor

-- 1. Atualizar o user_metadata do usuário admin existente
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{userType}',
  '"admin"'
)
WHERE email = 'admin@turguide.com';

-- 2. Verificar se a atualização foi bem-sucedida
SELECT 
  id,
  email,
  raw_user_meta_data->>'nome' as nome,
  raw_user_meta_data->>'userType' as user_type,
  created_at
FROM auth.users
WHERE email = 'admin@turguide.com';

-- 3. Se você tiver outros usuários admin, use este comando:
-- UPDATE auth.users
-- SET raw_user_meta_data = jsonb_set(
--   COALESCE(raw_user_meta_data, '{}'::jsonb),
--   '{userType}',
--   '"admin"'
-- )
-- WHERE email IN ('seu-email-aqui@exemplo.com', 'outro-admin@exemplo.com');

-- 4. Para verificar todos os usuários e seus tipos:
SELECT 
  id,
  email,
  raw_user_meta_data->>'nome' as nome,
  raw_user_meta_data->>'userType' as user_type,
  created_at
FROM auth.users
ORDER BY created_at DESC;

