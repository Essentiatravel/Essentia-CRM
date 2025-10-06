-- ============================================================================
-- VERIFICAR TODOS OS USUÁRIOS ADMIN NO BANCO
-- ============================================================================

-- 1. Ver TODOS os usuários e seus tipos
SELECT
    id,
    email,
    nome,
    user_type,
    created_at
FROM users
ORDER BY user_type, created_at DESC;

-- 2. Ver especificamente os ADMINS
SELECT
    id,
    email,
    nome,
    user_type
FROM users
WHERE user_type = 'admin';

-- 3. Verificar metadata dos admins
SELECT
    u.email,
    u.nome,
    u.user_type as tipo_tabela_users,
    au.raw_user_meta_data->>'userType' as tipo_metadata
FROM users u
JOIN auth.users au ON u.id::uuid = au.id::uuid
WHERE u.user_type = 'admin';

-- 4. Se não houver NENHUM admin, criar um:
-- DESCOMENTE E EXECUTE APENAS SE NÃO HOUVER ADMINS:

/*
-- Primeiro, criar usuário no auth se não existir
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@essentia.travel',
    crypt('Admin@123', gen_salt('bf')),
    NOW(),
    jsonb_build_object('nome', 'Admin', 'userType', 'admin'),
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Depois inserir na tabela users (use o ID retornado acima)
INSERT INTO users (id, email, nome, user_type, created_at, updated_at)
VALUES (
    'COLE_O_ID_AQUI',
    'admin@essentia.travel',
    'Admin',
    'admin',
    NOW(),
    NOW()
);
*/
