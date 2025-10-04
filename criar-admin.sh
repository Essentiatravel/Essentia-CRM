#!/bin/bash

# 🔐 Script SEGURO para Criar Usuário Admin
# Este script cria admin diretamente no Supabase (não usa API pública)

echo "=================================================="
echo "🔐 CRIAR USUÁRIO ADMINISTRADOR (VIA SUPABASE)"
echo "=================================================="
echo ""
echo "⚠️  Este script cria o admin DIRETAMENTE no Supabase"
echo "    Você precisa das credenciais do Supabase"
echo ""

# Carregar variáveis de ambiente
if [ -f "apps/web/.env.local" ]; then
    export $(cat apps/web/.env.local | grep -v '^#' | xargs)
elif [ -f ".env.local" ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
else
    echo "❌ Arquivo .env.local não encontrado"
    exit 1
fi

# Verificar se tem as variáveis necessárias
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Variáveis de ambiente não configuradas"
    echo "   Verifique se NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY"
    echo "   estão no arquivo .env.local"
    exit 1
fi

echo "✅ Variáveis de ambiente carregadas"
echo ""

# Solicitar dados do admin
read -p "📧 Email do admin: " EMAIL
read -s -p "🔒 Senha (min 6 caracteres): " PASSWORD
echo ""
read -p "👤 Nome completo: " NOME

echo ""
echo "📋 Confirmação:"
echo "   Email: $EMAIL"
echo "   Nome: $NOME"
echo ""

read -p "❓ Confirma a criação? (s/N): " CONFIRM

if [ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ]; then
    echo "❌ Cancelado pelo usuário"
    exit 0
fi

echo ""
echo "🔄 Criando usuário admin no Supabase..."
echo ""

# Gerar UUID para o usuário
USER_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')

# 1. Criar usuário no Supabase Auth usando Admin API
echo "📝 Passo 1: Criando usuário no Supabase Auth..."

AUTH_RESPONSE=$(curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/admin/users" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"email_confirm\": true,
    \"user_metadata\": {
      \"nome\": \"$NOME\",
      \"userType\": \"admin\"
    }
  }")

# Verificar se criou com sucesso
if echo "$AUTH_RESPONSE" | grep -q '"id"'; then
    USER_ID=$(echo "$AUTH_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   ✅ Usuário criado no Auth (ID: ${USER_ID:0:8}...)"
else
    echo "   ❌ Erro ao criar no Auth:"
    echo "$AUTH_RESPONSE"
    exit 1
fi

# 2. Inserir na tabela users
echo "📝 Passo 2: Inserindo na tabela users..."

DB_RESPONSE=$(curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/users" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{
    \"id\": \"$USER_ID\",
    \"email\": \"$EMAIL\",
    \"nome\": \"$NOME\",
    \"user_type\": \"admin\"
  }")

# Verificar se inseriu com sucesso
if echo "$DB_RESPONSE" | grep -q '"user_type":"admin"'; then
    echo "   ✅ Perfil admin criado na tabela users"
else
    echo "   ❌ Erro ao inserir na tabela users:"
    echo "$DB_RESPONSE"
    echo ""
    echo "   ⚠️  Usuário foi criado no Auth mas não na tabela users"
    echo "   Execute este SQL no Supabase Dashboard:"
    echo ""
    echo "   INSERT INTO users (id, email, nome, user_type)"
    echo "   VALUES ('$USER_ID', '$EMAIL', '$NOME', 'admin');"
    exit 1
fi

echo ""
echo "=================================================="
echo "✅ ADMIN CRIADO COM SUCESSO!"
echo "=================================================="
echo ""
echo "📋 Credenciais:"
echo "   Email: $EMAIL"
echo "   Senha: (a que você digitou)"
echo "   Tipo: Admin"
echo ""
echo "🌐 Próximos passos:"
echo "   1. Acesse: http://localhost:3000/login"
echo "   2. Use o email e senha criados"
echo "   3. Você será redirecionado para: /admin"
echo ""
echo "=================================================="
