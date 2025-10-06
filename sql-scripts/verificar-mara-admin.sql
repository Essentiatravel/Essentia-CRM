-- ============================================================================
-- VERIFICAR SE MARA ESTÁ COMO ADMIN
-- ============================================================================

SELECT
    u.id,
    u.email,
    u.nome,
    u.user_type,
    au.email_confirmed_at as email_confirmado,
    au.raw_user_meta_data->>'userType' as metadata_tipo
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'mara@essentia.com';

-- ============================================================================
-- SE user_type NÃO for 'admin', execute este UPDATE:
-- ============================================================================

UPDATE users
SET user_type = 'admin'
WHERE email = 'mara@essentia.com';

-- Verificar novamente
SELECT email, nome, user_type FROM users WHERE email = 'mara@essentia.com';
