
-- Script para atualizar a tabela users com as colunas necessárias
-- Execute este script no console SQL do Replit

-- Adicionar coluna nome se não existir
ALTER TABLE users ADD COLUMN IF NOT EXISTS nome VARCHAR;

-- Atualizar registros existentes para ter nome baseado em first_name e last_name
UPDATE users SET nome = CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, ''))
WHERE nome IS NULL AND (first_name IS NOT NULL OR last_name IS NOT NULL);

-- Adicionar outras colunas se não existirem
ALTER TABLE users ADD COLUMN IF NOT EXISTS telefone VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS endereco TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS data_nascimento TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS cpf VARCHAR;

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;
