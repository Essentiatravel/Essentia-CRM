#!/bin/bash

# 🔐 Script para Criar Usuário Admin
# Uso: ./criar-admin.sh

echo "=================================================="
echo "🔐 CRIAR USUÁRIO ADMINISTRADOR"
echo "=================================================="
echo ""

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    cd "apps/web" 2>/dev/null || {
        echo "❌ Erro: Execute este script na raiz do projeto"
        exit 1
    }
fi

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
echo "🔄 Criando usuário admin..."
echo ""

# Fazer requisição à API
RESPONSE=$(curl -s -X POST http://localhost:3000/api/users/create-admin \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"nome\": \"$NOME\"
  }")

# Verificar se teve sucesso
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Usuário admin criado com sucesso!"
    echo ""
    echo "📋 Credenciais:"
    echo "   Email: $EMAIL"
    echo "   Senha: (a que você digitou)"
    echo ""
    echo "🌐 Acesse: http://localhost:3000/login"
    echo ""
else
    echo "❌ Erro ao criar admin:"
    echo "$RESPONSE" | grep -o '"error":"[^"]*"' | sed 's/"error":"//' | sed 's/"$//'
    echo ""
    echo "Detalhes completos:"
    echo "$RESPONSE"
fi

echo ""
echo "=================================================="
