-- ============================================================================
-- REMOVER USUÁRIOS FANTASMA (que existem em users mas não em auth.users)
-- ============================================================================

-- PASSO 1: Ver os usuários que serão removidos
SELECT
    id,
    email,
    nome,
    user_type,
    created_at
FROM users
WHERE id IN ('user_guia', 'user_cliente');

-- PASSO 2: REMOVER os usuários fantasma
DELETE FROM users
WHERE id IN ('user_guia', 'user_cliente');

-- PASSO 3: Verificar se foram removidos (deve retornar vazio)
SELECT
    id,
    email,
    nome,
    user_type
FROM users
WHERE id IN ('user_guia', 'user_cliente');

-- PASSO 4: Listar TODOS os usuários restantes
SELECT
    id,
    email,
    nome,
    user_type,
    created_at
FROM users
ORDER BY user_type, email;

-- PASSO 5: Verificar consistência final (todos devem estar OK)
SELECT
    u.email,
    u.nome,
    u.user_type as tipo_tabela,
    au.raw_user_meta_data->>'userType' as tipo_metadata,
    CASE
        WHEN au.id IS NULL THEN '❌ SEM AUTH'
        WHEN u.user_type != au.raw_user_meta_data->>'userType' THEN '⚠️ INCONSISTENTE'
        ELSE '✅ OK'
    END as status
FROM users u
LEFT JOIN auth.users au ON u.id::text = au.id::text
ORDER BY u.user_type, u.email;

-- ============================================================================
-- RESULTADO ESPERADO (PASSO 5):
-- Todos os usuários devem estar ✅ OK
-- NÃO deve haver mais ❌ SEM AUTH
-- ============================================================================
