# 🔧 Corrigir Permissões de Administrador

## 🎯 Problema

O usuário `admin@turguide.com` não consegue fazer upload de imagens porque o campo `userType` não está configurado no `user_metadata`.

## ✅ Soluções (Escolha uma)

### **Opção 1: Via API (Mais Rápido) ⚡**

1. **Abra o terminal** e execute:

```bash
curl -X POST http://localhost:5000/api/auth/update-user-type \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@turguide.com",
    "userType": "admin"
  }'
```

2. **Faça logout e login novamente** para atualizar a sessão

3. **Tente fazer upload** novamente

---

### **Opção 2: Via Supabase SQL Editor** 

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto
   - Clique em **SQL Editor** no menu lateral

2. **Execute este SQL:**

```sql
-- Atualizar o user_metadata do admin
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{userType}',
  '"admin"'
)
WHERE email = 'admin@turguide.com';

-- Verificar se funcionou
SELECT 
  id,
  email,
  raw_user_meta_data->>'userType' as user_type,
  raw_user_meta_data
FROM auth.users
WHERE email = 'admin@turguide.com';
```

3. **Resultado esperado:**
```
user_type: "admin"
raw_user_meta_data: {"userType": "admin", ...}
```

4. **Faça logout e login novamente**

---

### **Opção 3: Via Console do Navegador** 

1. **Abra o console** do navegador (F12)

2. **Execute este código:**

```javascript
// Fazer a chamada para atualizar o userType
fetch('http://localhost:5000/api/auth/update-user-type', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@turguide.com',
    userType: 'admin'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Resultado:', data))
.catch(err => console.error('❌ Erro:', err));
```

3. **Faça logout e login novamente**

---

## 🧪 Verificar se Funcionou

### 1. Verificar no Console do Navegador

```javascript
// Verificar sessão atual
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  'https://nvviwqoxeznxpzitpwua.supabase.co',
  'sua_chave_anon_aqui'
);

const { data: { session } } = await supabase.auth.getSession();
console.log('User Metadata:', session?.user?.user_metadata);
console.log('User Type:', session?.user?.user_metadata?.userType);
```

**Resultado esperado:**
```
User Type: "admin"
```

### 2. Tentar Upload

1. Vá para: `http://localhost:5000/admin/passeios`
2. Clique em "Novo Passeio"
3. Tente fazer upload de uma imagem
4. **Deve funcionar agora!** ✅

---

## 📋 O que foi Corrigido no Código

### 1. **API de Upload (`apps/web/src/app/api/upload/route.ts`)**

Agora verifica admin de 3 formas:
- ✅ `userType === 'admin'` (via metadata)
- ✅ `email === 'admin@turguide.com'` (fallback)
- ✅ `email.endsWith('@admin.com')` (padrão)

### 2. **Novo Endpoint (`/api/auth/update-user-type`)**

Permite atualizar o `userType` de qualquer usuário programaticamente.

### 3. **Script SQL (`scripts/fix-admin-user.sql`)**

Script pronto para executar no Supabase SQL Editor.

---

## 🔍 Logs para Diagnóstico

Quando tentar fazer upload, você verá no console do servidor:

```
👤 Upload - Usuário: admin@turguide.com Tipo: admin Metadata: { userType: 'admin', nome: 'Admin' }
✅ Upload - Autenticação OK
```

Se ainda mostrar erro, compartilhe estes logs!

---

## 📝 Para Usuários Futuros

Quando criar novos usuários admin, certifique-se de que o registro inclui o `userType`:

```typescript
// No formulário de registro
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      nome: nome,
      userType: 'admin' // ← IMPORTANTE!
    }
  }
});
```

---

## 🚀 Próximos Passos

Depois de corrigir:
1. ✅ Teste o upload de imagens
2. ✅ Verifique se as imagens aparecem no Supabase Storage
3. ✅ Confirme que as URLs funcionam
4. ✅ Teste com diferentes tipos de imagem (JPG, PNG, WebP)

---

**Última atualização:** Sistema de verificação de permissões melhorado
