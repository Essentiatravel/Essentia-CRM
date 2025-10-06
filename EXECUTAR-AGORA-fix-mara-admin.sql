-- ============================================================================
-- EXECUTAR NO SUPABASE SQL EDITOR - Corrigir mara@essentia.com para ADMIN
-- ============================================================================

-- 1. Atualizar na tabela users
UPDATE users
SET
    user_type = 'admin',
    nome = 'Mara Harwood',
    updated_at = NOW()
WHERE email = 'mara@essentia.com';

-- 2. Atualizar metadata no auth.users
UPDATE auth.users
SET
    raw_user_meta_data = jsonb_build_object(
        'nome', 'Mara Harwood',
        'userType', 'admin'
    )
WHERE email = 'mara@essentia.com';

-- 3. Verificar se funcionou (deve mostrar 'admin' em ambas as colunas)
SELECT
    u.email,
    u.nome,
    u.user_type as tipo_na_tabela_users,
    au.raw_user_meta_data->>'userType' as tipo_no_metadata
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'mara@essentia.com';

-- ============================================================================
-- RESULTADO ESPERADO:
-- email: mara@essentia.com
-- nome: Mara Harwood
-- tipo_na_tabela_users: admin
-- tipo_no_metadata: admin
-- ============================================================================
