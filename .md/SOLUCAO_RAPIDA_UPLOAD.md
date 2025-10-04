# ⚡ Solução Rápida - Upload de Imagens

## 🎯 Problema
Erro: **"Apenas administradores podem enviar imagens"**

## ✅ Solução em 3 Passos

### **Passo 1: Atualizar o userType no Supabase**

Abra o **Supabase SQL Editor** e execute:

```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{userType}',
  '"admin"'
)
WHERE email = 'admin@turguide.com';
```

📍 **Link direto:** https://supabase.com/dashboard/project/nvviwqoxeznxpzitpwua/sql

---

### **Passo 2: Verificar se funcionou**

No mesmo SQL Editor, execute:

```sql
SELECT 
  email,
  raw_user_meta_data->>'userType' as user_type
FROM auth.users
WHERE email = 'admin@turguide.com';
```

**Resultado esperado:**
```
email: admin@turguide.com
user_type: admin
```

---

### **Passo 3: Fazer logout e login**

1. **Logout:** http://localhost:5000/api/auth/logout
2. **Login:** http://localhost:5000/login
3. **Teste o upload:** http://localhost:5000/admin/passeios

---

## 🎉 Pronto!

Agora você deve conseguir fazer upload de imagens!

---

## 🔧 Alternativa Via Console do Navegador

Se preferir, abra o console (F12) e execute:

```javascript
fetch('http://localhost:5000/api/auth/update-user-type', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@turguide.com',
    userType: 'admin'
  })
})
.then(res => res.json())
.then(data => console.log('✅', data))
```

Depois faça logout e login!

---

## ❓ Ainda não funciona?

Verifique o console do navegador (F12) quando tentar fazer upload. 

Deve mostrar algo como:
```
🔍 Verificando token: { hasToken: true, ... }
📤 Enviando para API com token: ...
📥 Resposta da API: { status: 200, success: true }
```

Se mostrar erro diferente, me envie os logs! 🚀
