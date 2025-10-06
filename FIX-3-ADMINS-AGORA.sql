-- ============================================================================
-- CORRIGIR OS 3 ADMINS - SOLUÇÃO DEFINITIVA
-- ============================================================================
-- Admins identificados:
-- 1. admin@turguide.com
-- 2. uzualelisson@gmail.com
-- 3. mara@essentia.com
-- ============================================================================

-- PASSO 1: Atualizar os 3 admins na tabela users
UPDATE users
SET
    user_type = 'admin',
    updated_at = NOW()
WHERE email IN (
    'admin@turguide.com',
    'uzualelisson@gmail.com',
    'mara@essentia.com'
);

-- PASSO 2: Atualizar metadata no auth.users para os 3 admins
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{userType}',
    '"admin"'
)
WHERE email IN (
    'admin@turguide.com',
    'uzualelisson@gmail.com',
    'mara@essentia.com'
);

-- PASSO 3: VERIFICAR se todos os 3 ficaram corretos
SELECT
    u.email,
    u.nome,
    u.user_type as tipo_tabela,
    au.raw_user_meta_data->>'userType' as tipo_metadata,
    au.raw_user_meta_data->>'nome' as nome_metadata,
    CASE
        WHEN u.user_type = 'admin' AND au.raw_user_meta_data->>'userType' = 'admin'
        THEN '✅ OK'
        ELSE '❌ ERRO'
    END as status
FROM users u
JOIN auth.users au ON u.id::uuid = au.id::uuid
WHERE u.email IN (
    'admin@turguide.com',
    'uzualelisson@gmail.com',
    'mara@essentia.com'
)
ORDER BY u.email;

-- ============================================================================
-- RESULTADO ESPERADO - TODOS DEVEM ESTAR ✅ OK:
-- ============================================================================
-- admin@turguide.com      | admin | admin | ✅ OK
-- mara@essentia.com       | admin | admin | ✅ OK
-- uzualelisson@gmail.com  | admin | admin | ✅ OK
-- ============================================================================

-- PASSO 4: Verificar se há triggers problemáticos (NÃO DEVE TER NENHUM)
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users';

-- Se aparecer trigger 'trg_sync_auth_user', EXECUTAR:
-- DROP TRIGGER IF EXISTS trg_sync_auth_user ON users;
-- DROP FUNCTION IF EXISTS sync_cliente_from_auth() CASCADE;

-- PASSO 5: Ver se há funções problemáticas
SELECT
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines
WHERE routine_name LIKE '%sync%'
   OR routine_name LIKE '%cliente%'
ORDER BY routine_name;

-- ============================================================================
-- APÓS EXECUTAR:
-- 1. Faça LOGOUT no sistema
-- 2. Faça LOGIN com qualquer um dos 3 admins
-- 3. Deve redirecionar para /admin corretamente
-- ============================================================================
