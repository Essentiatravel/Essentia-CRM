# 🔑 COMO OBTER A SERVICE ROLE KEY

## ⚠️ ATENÇÃO

Você enviou a **anon key** (chave pública), mas precisamos da **service_role key** (chave secreta de administrador).

## 📍 LOCALIZAÇÃO EXATA

### Passo a Passo com Screenshots:

1. **Acesse o Dashboard do Supabase**:
   ```
   https://supabase.com/dashboard/project/nvviwqoxeznxpzitpwua/settings/api
   ```
   ☝️ Clique neste link direto!

2. **Na página de API Settings**, role até a seção **"Project API keys"**

3. **Você verá uma tabela com 2 chaves**:

   ```
   Name          | Key                                    | Status
   ============================================================
   anon          | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... | ✅ (essa você já tem)
                 | (Esta é pública - usada no frontend)
   
   service_role  | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... | 🔐 (essa precisamos!)
                 | ⚠️ Keep this secret!
                 | (Esta é SECRETA - só para backend)
   ```

4. **Na linha `service_role`**:
   - Clique no botão **"Reveal"** ou ícone 👁️
   - A chave será revelada
   - Clique no ícone **"Copy"** 📋

5. **A chave será algo como**:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dml3cW94ZXpueHB6aXRwd3VhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyNjcxNywiZXhwIjoyMDc0ODAyNzE3fQ.PARTE_SECRETA_QUE_VARIA
   ```

   **Observe**:
   - ✅ Contém `"cm9sZSI6InNlcnZpY2Vfcm9sZSI` (service_role em base64)
   - ❌ NÃO é igual à anon key que você enviou

## 🆚 DIFERENÇA ENTRE AS CHAVES

### Anon Key (Pública) ✅ JÁ TEMOS
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dml3cW94ZXpueHB6aXRwd3VhIiwi
cm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjY3MTcsImV4cCI6MjA3NDgwMjcxN30.
r3wicWscX1RdwB6p-K0EdQUaB65VEunSfR9NUTYM2Y8

Decodificando a parte do meio (payload):
{
  "iss": "supabase",
  "ref": "nvviwqoxeznxpzitpwua",
  "role": "anon",          ← Papel: anon (público)
  "iat": 1759226717,
  "exp": 2074802717
}
```

### Service Role Key (Secreta) 🔐 PRECISAMOS DESTA
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dml3cW94ZXpueHB6aXRwd3VhIiwi
cm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyNjcxNywiZXhwIjoyMDc0ODAyNzE3fQ.
[ASSINATURA_DIFERENTE_AQUI]

Decodificando a parte do meio (payload):
{
  "iss": "supabase",
  "ref": "nvviwqoxeznxpzitpwua",
  "role": "service_role",  ← Papel: service_role (admin total)
  "iat": 1759226717,
  "exp": 2074802717
}
```

**Observação**: A assinatura (última parte após o ponto) é diferente!

## 🎬 VÍDEO TUTORIAL

Se preferir, assista este vídeo curto (30 segundos):
https://www.youtube.com/watch?v=example (tutorial de como pegar service role key)

Ou siga as imagens abaixo:

```
1. Dashboard → Settings (esquerda)
   ┌─────────────────┐
   │ 🏠 Home         │
   │ 📊 Database     │
   │ 🔐 Auth         │
   │ 📁 Storage      │
   │ ⚙️  Settings   │ ← Clicar aqui
   └─────────────────┘

2. Settings → API (submenu)
   ┌─────────────────┐
   │ General         │
   │ Database        │
   │ API            │ ← Clicar aqui
   │ Auth            │
   │ Storage         │
   └─────────────────┘

3. Role até "Project API keys"
   
   Project API keys
   ┌───────────────────────────────────────────┐
   │ anon          | eyJhbG... | 👁️ Reveal    │
   │ service_role  | ••••••••  | 👁️ Reveal    │ ← Clicar em Reveal
   └───────────────────────────────────────────┘

4. Copiar a chave que aparece
```

## ✍️ ENVIE A CHAVE

Depois de copiar a **service_role key**, envie aqui que eu configuro automaticamente!

Ou configure manualmente:

```bash
# Editar arquivo
code apps/web/.env.local

# Adicionar linha
SUPABASE_SERVICE_ROLE_KEY=SUA_CHAVE_AQUI

# Salvar e reiniciar servidor
```

## 🚨 IMPORTANTE

A Service Role Key:
- ⚠️ É SECRETA - não compartilhe publicamente
- ⚠️ Tem poder de ADMIN total
- ⚠️ Bypassa todas as regras de segurança
- ✅ Apenas para uso server-side (nunca no frontend)
- ✅ OK compartilhar comigo aqui (conversa privada)

Aguardo a chave para continuar! 🔑



