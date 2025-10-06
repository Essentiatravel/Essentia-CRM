-- ============================================================================
-- CORRIGIR TODOS OS USUÁRIOS ADMIN - SOLUÇÃO DEFINITIVA
-- ============================================================================

-- PASSO 1: Verificar triggers (devem estar removidos)
-- ============================================================================
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users';

-- Se aparecer algum trigger, remover:
-- DROP TRIGGER IF EXISTS nome_do_trigger ON users;

-- PASSO 2: Ver TODOS os usuários que DEVERIAM ser admin
-- ============================================================================
SELECT
    id,
    email,
    nome,
    user_type,
    created_at
FROM users
ORDER BY email;

-- PASSO 3: CORRIGIR TODOS OS ADMINS
-- ============================================================================
-- Ajuste os emails conforme necessário (adicione TODOS os admins)

-- Mara
UPDATE users
SET user_type = 'admin', updated_at = NOW()
WHERE email = 'mara@essentia.com';

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{userType}',
    '"admin"'
)
WHERE email = 'mara@essentia.com';

-- Adicione outros admins aqui (DESCOMENTE e ajuste os emails):
/*
UPDATE users
SET user_type = 'admin', updated_at = NOW()
WHERE email IN (
    'admin@essentia.com',
    'admin@essentia.travel',
    -- adicione outros emails admin aqui
);

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{userType}',
    '"admin"'
)
WHERE email IN (
    'admin@essentia.com',
    'admin@essentia.travel',
    -- adicione outros emails admin aqui
);
*/

-- PASSO 4: VERIFICAR SE CORRIGIU
-- ============================================================================
SELECT
    u.email,
    u.nome,
    u.user_type as tipo_tabela_users,
    au.raw_user_meta_data->>'userType' as tipo_metadata,
    CASE
        WHEN u.user_type = 'admin' AND au.raw_user_meta_data->>'userType' = 'admin'
        THEN '✅ OK'
        ELSE '❌ ERRO'
    END as status
FROM users u
JOIN auth.users au ON u.id::uuid = au.id::uuid
WHERE u.user_type = 'admin' OR au.raw_user_meta_data->>'userType' = 'admin'
ORDER BY u.email;

-- PASSO 5: Garantir que triggers não voltem
-- ============================================================================
-- Ver se existe a função problemática
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name LIKE '%sync%cliente%'
   OR routine_name LIKE '%user%type%';

-- Se existir, remover:
-- DROP FUNCTION IF EXISTS sync_cliente_from_auth() CASCADE;

-- ============================================================================
-- RESULTADO ESPERADO:
-- Todos os admins devem mostrar status ✅ OK
-- ============================================================================
