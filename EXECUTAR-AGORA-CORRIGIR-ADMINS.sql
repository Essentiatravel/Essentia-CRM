-- ============================================================================
-- CORRIGIR ADMINS - admin@turguide.com e mara@essentia.com
-- ============================================================================

-- PASSO 1: Atualizar AMBOS os admins na tabela users
UPDATE users
SET
    user_type = 'admin',
    updated_at = NOW()
WHERE email IN (
    'admin@turguide.com',
    'mara@essentia.com'
);

-- PASSO 2: Atualizar metadata no auth.users para AMBOS
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{userType}',
    '"admin"'
)
WHERE email IN (
    'admin@turguide.com',
    'mara@essentia.com'
);

-- PASSO 3: VERIFICAR se ficou correto
SELECT
    u.email,
    u.nome,
    u.user_type as tipo_tabela,
    au.raw_user_meta_data->>'userType' as tipo_metadata,
    au.raw_user_meta_data->>'nome' as nome_metadata,
    CASE
        WHEN u.user_type = 'admin' AND au.raw_user_meta_data->>'userType' = 'admin'
        THEN '✅ CORRETO'
        ELSE '❌ ERRO'
    END as status
FROM users u
JOIN auth.users au ON u.id::uuid = au.id::uuid
WHERE u.email IN (
    'admin@turguide.com',
    'mara@essentia.com'
)
ORDER BY u.email;

-- ============================================================================
-- RESULTADO ESPERADO:
-- admin@turguide.com → tipo_tabela: admin, tipo_metadata: admin, status: ✅
-- mara@essentia.com  → tipo_tabela: admin, tipo_metadata: admin, status: ✅
-- ============================================================================

-- PASSO 4: Verificar triggers (NÃO deve ter nenhum)
SELECT
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'users';

-- Se aparecer algum trigger, ALERTA! Precisa remover!
