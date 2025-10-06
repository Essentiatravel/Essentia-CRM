-- ============================================================================
-- DESABILITAR TRIGGERS QUE FORÇAM USER_TYPE PARA "CLIENTE"
-- ============================================================================

-- 1. DESABILITAR os triggers problemáticos
DROP TRIGGER IF EXISTS trg_sync_auth_user ON users;

-- 2. Ver se há função sync_cliente_from_auth e removê-la
DROP FUNCTION IF EXISTS sync_cliente_from_auth() CASCADE;

-- 3. Verificar se foram removidos
SELECT
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'users';

-- Deve retornar VAZIO (nenhum trigger)

-- ============================================================================
-- FORÇAR MARA COMO ADMIN
-- ============================================================================

-- 4. Atualizar user_type na tabela users
UPDATE users
SET
    user_type = 'admin',
    nome = 'Mara Harwood',
    updated_at = NOW()
WHERE email = 'mara@essentia.com';

-- 5. Atualizar metadata no auth.users
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
    'nome', 'Mara Harwood',
    'userType', 'admin'
)
WHERE email = 'mara@essentia.com';

-- 6. VERIFICAÇÃO FINAL (corrigido para UUID)
SELECT
    u.email,
    u.nome,
    u.user_type as tipo_na_tabela,
    au.raw_user_meta_data->>'userType' as tipo_no_metadata
FROM users u
JOIN auth.users au ON u.id::uuid = au.id::uuid
WHERE u.email = 'mara@essentia.com';

-- ============================================================================
-- RESULTADO ESPERADO:
-- tipo_na_tabela: admin
-- tipo_no_metadata: admin
-- ============================================================================

-- ✅ Agora faça logout e login novamente - deve funcionar!
