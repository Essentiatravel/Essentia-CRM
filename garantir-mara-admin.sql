-- ============================================================================
-- GARANTIR QUE MARA@ESSENTIA.COM ESTÁ COMO ADMIN
-- ============================================================================
-- Execute este script para garantir que está tudo correto
-- ============================================================================

-- 1. VERIFICAR ESTADO ATUAL
SELECT
    '=== ESTADO ATUAL ===' as info,
    u.id,
    u.email,
    u.nome,
    u.user_type,
    au.raw_user_meta_data->>'userType' as metadata_userType
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'mara@essentia.com';

-- 2. FORÇAR ATUALIZAÇÃO PARA ADMIN
UPDATE users
SET
    user_type = 'admin',
    nome = 'Mara Harwood',
    updated_at = NOW()
WHERE email = 'mara@essentia.com';

-- 3. ATUALIZAR METADATA
UPDATE auth.users
SET
    raw_user_meta_data = jsonb_build_object(
        'nome', 'Mara Harwood',
        'userType', 'admin'
    ),
    updated_at = NOW()
WHERE email = 'mara@essentia.com';

-- 4. VERIFICAR RESULTADO FINAL
SELECT
    '=== RESULTADO FINAL ===' as info,
    u.id,
    u.email,
    u.nome,
    u.user_type as tipo_tabela_users,
    au.raw_user_meta_data->>'userType' as tipo_metadata,
    au.email_confirmed_at as email_confirmado
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'mara@essentia.com';

-- 5. LISTAR TODOS OS ADMINS PARA CONFIRMAR
SELECT
    '=== TODOS OS ADMINS ===' as info,
    email,
    nome,
    user_type,
    created_at
FROM users
WHERE user_type = 'admin'
ORDER BY created_at DESC;

-- ============================================================================
-- ESPERADO:
-- - tipo_tabela_users = 'admin'
-- - tipo_metadata = 'admin'
-- - email_confirmado = [uma data]
-- ============================================================================
