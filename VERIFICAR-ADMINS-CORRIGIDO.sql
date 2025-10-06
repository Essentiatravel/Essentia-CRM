-- ============================================================================
-- VERIFICAR SE OS ADMINS ESTÃO CORRETOS (Query Corrigida)
-- ============================================================================

-- PASSO 1: Ver todos os usuários admin (SEM JOIN)
SELECT
    id,
    email,
    nome,
    user_type,
    created_at
FROM users
WHERE user_type = 'admin'
ORDER BY email;

-- PASSO 2: Verificar consistência entre users e auth.users (com LEFT JOIN)
SELECT
    u.email,
    u.nome,
    u.user_type as tipo_tabela_users,
    au.raw_user_meta_data->>'userType' as tipo_metadata,
    CASE
        WHEN u.user_type = 'admin' AND au.raw_user_meta_data->>'userType' = 'admin'
        THEN '✅ OK'
        WHEN au.id IS NULL
        THEN '⚠️ SEM AUTH'
        ELSE '❌ ERRO'
    END as status
FROM users u
LEFT JOIN auth.users au ON u.id::text = au.id::text
WHERE u.user_type = 'admin'
ORDER BY u.email;

-- PASSO 3: Ver se há usuários na tabela users que NÃO estão no auth.users
SELECT
    u.id,
    u.email,
    u.nome,
    u.user_type,
    CASE
        WHEN au.id IS NULL THEN '❌ NÃO EXISTE NO AUTH'
        ELSE '✅ OK'
    END as status_auth
FROM users u
LEFT JOIN auth.users au ON u.id::text = au.id::text
WHERE au.id IS NULL;

-- PASSO 4: Limpar usuários fantasma (DESCOMENTE SE NECESSÁRIO)
-- Estes são usuários que estão na tabela users mas não no auth.users
-- São inválidos e devem ser removidos

/*
DELETE FROM users
WHERE id IN (
    SELECT u.id
    FROM users u
    LEFT JOIN auth.users au ON u.id::text = au.id::text
    WHERE au.id IS NULL
    AND u.email NOT IN ('admin@turguide.com', 'mara@essentia.com', 'uzualelisson@gmail.com')
);
*/

-- ============================================================================
-- RESULTADO ESPERADO (PASSO 2):
-- ============================================================================
-- admin@turguide.com      | admin | admin | ✅ OK
-- mara@essentia.com       | admin | admin | ✅ OK
-- uzualelisson@gmail.com  | admin | admin | ✅ OK
-- ============================================================================
