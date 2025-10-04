# 🚨 CONFIGURAÇÃO URGENTE - SERVICE ROLE KEY

## ⚠️ ATENÇÃO: Para criar usuários que possam fazer login, você PRECISA configurar a Service Role Key!

### 1. Obter a Service Role Key do Supabase

1. **Acesse:** [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Selecione** seu projeto TourGuide
3. **Vá em:** Settings → API
4. **Copie** a **service_role** key (NÃO a anon key!)

### 2. Configurar no arquivo .env.local

No arquivo `apps/web/.env.local`, adicione:

```bash
# Suas variáveis existentes (mantenha)
NEXT_PUBLIC_SUPABASE_URL=your_existing_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_existing_anon_key

# NOVA - OBRIGATÓRIA para criar usuários:
SUPABASE_SERVICE_ROLE_KEY=supabase_service_role_key_aqui
```

### 3. Reiniciar o servidor

Após adicionar a variável:

```bash
# Parar o servidor (Ctrl+C)
# Depois reiniciar:
npm run dev
```

### 4. Testar

1. **Acesse:** http://localhost:5000/admin/usuarios
2. **Tente criar** um usuário teste:
   - Nome: João
   - Sobrenome: Silva
   - Email: joao@teste.com
   - Tipo: Guia
   - Senha: 123456

3. **Verificar logs** no console (F12)

## 🎯 RESULTADO ESPERADO:

Com a Service Role Key configurada:
- ✅ Usuários são criados no Supabase Auth
- ✅ Usuários são criados na tabela users  
- ✅ Usuários podem fazer login
- ✅ Sistema funciona completamente

## ❌ SEM A SERVICE ROLE KEY:

- ❌ Erro "Service role não configurado"
- ❌ Usuários não conseguem fazer login
- ❌ Sistema não funciona

## 🔍 Verificar se funcionou:

Execute no terminal:
```bash
echo "SERVICE KEY: $([ -n "$SUPABASE_SERVICE_ROLE_KEY" ] && echo "✅ CONFIGURADA" || echo "❌ NÃO CONFIGURADA")"
```

**Configure AGORA para o sistema funcionar!**