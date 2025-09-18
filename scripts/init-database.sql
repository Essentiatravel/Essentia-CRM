-- Script para inicializar o banco PostgreSQL no Replit
-- Execute este script uma vez para criar as tabelas necessárias

-- Extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    profile_image_url VARCHAR,
    user_type VARCHAR NOT NULL DEFAULT 'cliente',
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de sessões (necessária para Replit Auth)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess TEXT NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Índice para performance nas sessões
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Inserir usuário administrador padrão se não existir
INSERT INTO users (email, first_name, last_name, user_type) 
VALUES ('admin@turguide.com', 'Admin', 'Sistema', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Mostrar resultado
SELECT 'Banco inicializado com sucesso!' as status;
SELECT COUNT(*) as total_usuarios FROM users;