-- ============================================================================
-- DEBUG: Verificar TODOS os dados do usuário mara@essentia.com
-- ============================================================================

-- 1. Verificar na tabela users
SELECT
    id,
    email,
    nome,
    user_type,
    created_at,
    updated_at
FROM users
WHERE email = 'mara@essentia.com';

-- 2. Verificar no auth.users (metadata)
SELECT
    id,
    email,
    email_confirmed_at,
    raw_user_meta_data,
    raw_app_meta_data,
    created_at
FROM auth.users
WHERE email = 'mara@essentia.com';

-- 3. Verificar se existe duplicidade
SELECT COUNT(*) as total FROM users WHERE email = 'mara@essentia.com';

-- ============================================================================
-- FORÇAR ATUALIZAÇÃO PARA ADMIN (execute isto se necessário)
-- ============================================================================

-- Atualizar na tabela users
UPDATE users
SET
    user_type = 'admin',
    nome = 'Mara Harwood',
    updated_at = NOW()
WHERE email = 'mara@essentia.com';

-- Atualizar metadata no auth
UPDATE auth.users
SET
    raw_user_meta_data = jsonb_build_object(
        'nome', 'Mara Harwood',
        'userType', 'admin'
    )
WHERE email = 'mara@essentia.com';

-- Verificar resultado final
SELECT
    u.email,
    u.nome,
    u.user_type as tipo_na_tabela_users,
    au.raw_user_meta_data->>'userType' as tipo_no_metadata
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'mara@essentia.com';

-- Deve retornar: tipo_na_tabela_users = 'admin' E tipo_no_metadata = 'admin'
