# 🔐 Como Criar Usuário Admin

Existem **3 formas** de criar um usuário administrador:

---

## 🚀 Forma 1: Script Automático (Recomendado)

O jeito mais fácil! Use o script que criamos:

```bash
./criar-admin.sh
```

O script vai pedir:
- 📧 Email do admin
- 🔒 Senha (mínimo 6 caracteres)
- 👤 Nome completo

**Exemplo:**
```bash
$ ./criar-admin.sh

==================================================
🔐 CRIAR USUÁRIO ADMINISTRADOR
==================================================

📧 Email do admin: admin@turguide.com
🔒 Senha (min 6 caracteres): ******
👤 Nome completo: Administrador Sistema

📋 Confirmação:
   Email: admin@turguide.com
   Nome: Administrador Sistema

❓ Confirma a criação? (s/N): s

🔄 Criando usuário admin...

✅ Usuário admin criado com sucesso!

📋 Credenciais:
   Email: admin@turguide.com
   Senha: (a que você digitou)

🌐 Acesse: http://localhost:3000/login
```

---

## 💻 Forma 2: cURL (Via Terminal)

Se preferir fazer manualmente via terminal:

```bash
curl -X POST http://localhost:3000/api/users/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@turguide.com",
    "password": "SenhaSegura123!",
    "nome": "Administrador Sistema"
  }'
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Usuário admin criado com sucesso",
  "user": {
    "id": "uuid-aqui",
    "email": "admin@turguide.com",
    "nome": "Administrador Sistema",
    "userType": "admin"
  }
}
```

---

## 🗄️ Forma 3: SQL Direto no Supabase

Se preferir criar direto no banco de dados:

1. Acesse: https://app.supabase.com
2. Vá em **Authentication** → **Users**
3. Clique em **"Add User"** ou **"Invite User"**
4. Digite:
   - Email: `admin@turguide.com`
   - Password: (escolha uma senha)
   - ✅ Marque "Auto Confirm User"

5. Depois, vá em **SQL Editor** e execute:

```sql
-- Inserir ou atualizar usuário como admin
INSERT INTO users (id, email, nome, user_type)
SELECT 
    id,
    email,
    'Administrador Sistema' as nome,
    'admin' as user_type
FROM auth.users
WHERE email = 'admin@turguide.com'
ON CONFLICT (email) 
DO UPDATE SET user_type = 'admin';
```

---

## ✅ Verificar se Funcionou

### Opção 1: Via API
```bash
curl http://localhost:3000/api/users/create-admin
```

Deve retornar lista de admins:
```json
{
  "success": true,
  "admins": [
    {
      "id": "uuid",
      "email": "admin@turguide.com",
      "nome": "Administrador Sistema",
      "user_type": "admin"
    }
  ],
  "count": 1
}
```

### Opção 2: Fazer Login
1. Acesse: http://localhost:3000/login
2. Use as credenciais criadas
3. Se redirecionar para `/admin` → ✅ Sucesso!

---

## 🔧 Criar Múltiplos Admins

Você pode criar vários admins:

```bash
# Admin 1
curl -X POST http://localhost:3000/api/users/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin1@turguide.com",
    "password": "Senha123!",
    "nome": "Admin Principal"
  }'

# Admin 2
curl -X POST http://localhost:3000/api/users/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin2@turguide.com",
    "password": "Senha123!",
    "nome": "Admin Secundário"
  }'
```

---

## ⚠️ Erros Comuns

### Erro: "SUPABASE_SERVICE_ROLE_KEY não configurada"

**Solução:** Adicione a variável de ambiente:

1. Copie a `SUPABASE_SERVICE_ROLE_KEY` do Supabase
2. Adicione no `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
   ```
3. Reinicie o servidor: `npm run dev`

### Erro: "Email já existe"

**Solução:** A API atualiza automaticamente para admin. Só fazer login!

### Erro: "Senha deve ter pelo menos 6 caracteres"

**Solução:** Use senha com 6+ caracteres.

### Erro: "Email inválido"

**Solução:** Use formato válido: `usuario@dominio.com`

---

## 🔒 Segurança em Produção

⚠️ **IMPORTANTE:** Esta API deve ser protegida em produção!

**Opções de proteção:**

1. **Desabilitar após primeiro uso:**
   ```typescript
   // Em route.ts, adicionar no início:
   if (process.env.NODE_ENV === 'production') {
     return NextResponse.json({ error: 'Rota desabilitada' }, { status: 403 });
   }
   ```

2. **Exigir chave secreta:**
   ```typescript
   const secretKey = request.headers.get('X-Admin-Secret');
   if (secretKey !== process.env.ADMIN_SECRET_KEY) {
     return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
   }
   ```

3. **Permitir apenas primeiro admin:**
   ```typescript
   const { data: existingAdmins } = await supabase
     .from('users')
     .select('id')
     .eq('user_type', 'admin');
   
   if (existingAdmins && existingAdmins.length > 0) {
     return NextResponse.json({ error: 'Admin já existe' }, { status: 403 });
   }
   ```

---

## 📝 Checklist de Criação

- [ ] Servidor rodando (`npm run dev`)
- [ ] Variáveis de ambiente configuradas (`.env.local`)
- [ ] Execute o script ou curl
- [ ] Verifique se admin foi criado
- [ ] Teste login
- [ ] Confirme acesso ao `/admin`

---

## 🆘 Suporte

Se nada funcionar:

1. Verifique logs do servidor
2. Verifique console do navegador
3. Verifique tabela `users` no Supabase
4. Verifique `auth.users` no Supabase

**Comando para verificar:**
```bash
# Listar todos admins
curl http://localhost:3000/api/users/create-admin

# Logs do servidor
# Verifique o terminal onde está rodando npm run dev
```
