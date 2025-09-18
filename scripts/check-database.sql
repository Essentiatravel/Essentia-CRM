
-- Verificar se a tabela users existe
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Verificar se há dados na tabela
SELECT COUNT(*) as total_users FROM users;

-- Listar primeiros registros
SELECT id, email, nome, "userType", status, "createdAt" 
FROM users 
LIMIT 5;
