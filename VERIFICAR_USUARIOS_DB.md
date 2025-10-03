# 🔍 Verificar Usuários no Banco de Dados

## Passos para diagnosticar o problema:

### 1. Verificar se existem usuários na tabela

Execute no **SQL Editor** do Supabase:

```sql
-- Verificar se a tabela users existe e tem dados
SELECT 
  COUNT(*) as total_usuarios,
  COUNT(CASE WHEN "userType" = 'admin' THEN 1 END) as total_admins,
  COUNT(CASE WHEN "userType" = 'guia' THEN 1 END) as total_guias,
  COUNT(CASE WHEN "userType" = 'cliente' THEN 1 END) as total_clientes
FROM "public"."users";
```

### 2. Ver todos os usuários existentes

```sql
-- Listar todos os usuários
SELECT 
  id,
  email,
  nome,
  "userType",
  status,
  "createdAt"
FROM "public"."users"
ORDER BY "createdAt" DESC;
```

### 3. Verificar estrutura da tabela

```sql
-- Verificar colunas da tabela users
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

### 4. Verificar RLS (Row Level Security)

```sql
-- Verificar se RLS está ativo
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- Ver políticas RLS
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users';
```

### 5. Testar acesso direto via API de debug

Acesse esta URL no navegador:
```
http://localhost:5000/api/users/debug
```

Isso vai mostrar:
- Se a service role key está configurada
- Quantos usuários existem no banco
- Erros específicos se houver

### 6. Verificar variáveis de ambiente

No terminal, execute:

```bash
# Verificar se as variáveis estão configuradas
echo "SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "SERVICE_KEY configurada: $([ -n "$SUPABASE_SERVICE_ROLE_KEY" ] && echo "SIM" || echo "NÃO")"
```

### 7. Se não existirem usuários, criar dados de teste

```sql
-- Inserir usuário admin de teste
INSERT INTO "public"."users" (
  id,
  email,
  nome,
  "userType",
  status,
  "createdAt",
  "updatedAt"
) VALUES 
(
  'admin-test-' || gen_random_uuid()::text,
  'admin@turguide.com',
  'Admin TourGuide',
  'admin',
  'ativo',
  now(),
  now()
),
(
  'guia-test-' || gen_random_uuid()::text,
  'guia@turguide.com',
  'João Silva',
  'guia',
  'ativo',
  now(),
  now()
),
(
  'cliente-test-' || gen_random_uuid()::text,
  'cliente@turguide.com',
  'Maria Santos',
  'cliente',
  'ativo',
  now(),
  now()
);
```

## ⚠️ Possíveis Problemas:

1. **Tabela vazia** - Não há usuários cadastrados
2. **RLS muito restritivo** - Políticas bloqueando acesso
3. **Service role key incorreta** - Não consegue acessar como admin
4. **Estrutura da tabela diferente** - Colunas com nomes diferentes
5. **Conexão com banco incorreta** - URL do Supabase errada

Execute esses comandos na ordem e me informe os resultados!