-- ============================================================================
-- VERIFICAR TRIGGERS QUE PODEM ESTAR MUDANDO USER_TYPE
-- ============================================================================

-- 1. Ver TODOS os triggers na tabela users
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users';

-- 2. Ver TODAS as funções relacionadas a users
SELECT
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines
WHERE routine_name LIKE '%user%'
   OR routine_name LIKE '%auth%';

-- 3. Ver triggers no auth.users
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth';

-- ============================================================================
-- SE ENCONTRAR ALGUM TRIGGER PROBLEMÁTICO, DESABILITAR ASSIM:
-- ============================================================================

-- DROP TRIGGER IF EXISTS nome_do_trigger ON users;
-- DROP TRIGGER IF EXISTS nome_do_trigger ON auth.users;

-- ============================================================================
-- FORÇAR MARA COMO ADMIN NOVAMENTE (executar depois de remover triggers)
-- ============================================================================

UPDATE users
SET user_type = 'admin'
WHERE email = 'mara@essentia.com';

UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
    'nome', 'Mara Harwood',
    'userType', 'admin'
)
WHERE email = 'mara@essentia.com';

-- Verificar
SELECT u.email, u.user_type, au.raw_user_meta_data
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'mara@essentia.com';
