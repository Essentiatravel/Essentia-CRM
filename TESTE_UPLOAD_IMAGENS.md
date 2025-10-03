# 🧪 Teste de Upload de Imagens - Diagnóstico

## ✅ Correções Implementadas (Versão 2)

### 1. **Instância Global do Supabase**
- ✅ Criado arquivo `lib/supabase.ts` com instância única
- ✅ AuthContext agora usa a instância global
- ✅ Hook useImageUpload usa a mesma instância
- ✅ Garantia de persistência de sessão consistente

### 2. **Logs de Diagnóstico**
- ✅ Logs detalhados no cliente (hook)
- ✅ Logs detalhados no servidor (API)
- ✅ Verificação de token em cada etapa

## 🔍 Como Testar

### Passo 1: Abrir o Console do Navegador

1. Pressione `F12` ou clique com botão direito → "Inspecionar"
2. Vá para a aba "Console"
3. Limpe o console (ícone 🚫 ou Ctrl+L)

### Passo 2: Verificar Sessão Atual

No console do navegador, execute:

```javascript
// Verificar se está autenticado
const { data: { session } } = await (await import('@supabase/supabase-js')).createClient(
  'https://nvviwqoxeznxpzitpwua.supabase.co',
  'sua_chave_anon_aqui'
).auth.getSession();

console.log('Sessão:', {
  logged: !!session,
  email: session?.user?.email,
  userType: session?.user?.user_metadata?.userType,
  hasToken: !!session?.access_token
});
```

### Passo 3: Tentar Upload

1. Acesse: `http://localhost:5000/admin/passeios`
2. Clique em "Novo Passeio" ou edite um existente
3. Tente fazer upload de uma imagem
4. **Observe os logs no console**

### Passo 4: Analisar Logs

Você deverá ver logs como:

#### **No Cliente (Console do Navegador):**
```
🔍 Verificando token: { hasToken: true, tokenPrefix: 'eyJhbGci...' }
📤 Enviando para API com token: eyJhbGci...
📥 Resposta da API: { status: 200, success: true }
```

#### **No Servidor (Terminal/Console do Servidor):**
```
📤 Upload - Iniciando upload para Supabase Storage
🔐 Upload - Validando autenticação
🔍 Headers: { hasAuthHeader: true, hasToken: true, ... }
👤 Upload - Usuário: admin@exemplo.com Tipo: admin
✅ Upload - Autenticação OK
📁 Upload - Enviando para Supabase Storage: uuid.jpg
✅ Upload - Sucesso: { fileName: '...', publicUrl: '...' }
```

## 🚨 Possíveis Problemas e Soluções

### Problema 1: "Token não encontrado"

**Logs esperados:**
```
❌ Token não encontrado
```

**Solução:**
1. Faça logout: `http://localhost:5000/api/auth/logout`
2. Faça login novamente
3. Tente o upload novamente

### Problema 2: "Apenas administradores podem enviar imagens"

**Logs esperados:**
```
👤 Upload - Usuário: email@exemplo.com Tipo: cliente
❌ Upload - Não é admin
```

**Solução:**
- Certifique-se de estar logado com uma conta de administrador
- Verifique no Supabase Dashboard se o `user_metadata.userType` está como 'admin'

### Problema 3: "Bucket não encontrado"

**Logs esperados:**
```
❌ Erro no upload para Supabase: Bucket not found
```

**Solução:**
1. Acesse o Supabase Dashboard
2. Vá em **Storage**
3. Crie um bucket chamado **"cards turs"** (exatamente com esse nome)
4. Marque como **público**

### Problema 4: "Política de acesso negada"

**Logs esperados:**
```
❌ Erro no upload para Supabase: new row violates row-level security policy
```

**Solução:**
Configure as políticas no Supabase:

```sql
-- No Supabase SQL Editor
CREATE POLICY "Permitir uploads autenticados" 
ON storage.objects 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir leitura pública" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cards turs');
```

## 🎯 Checklist de Verificação

Antes de testar, verifique:

- [ ] Servidor rodando: `npm run dev`
- [ ] Está logado como admin
- [ ] Bucket "cards turs" existe no Supabase
- [ ] Variáveis de ambiente configuradas:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Console do navegador aberto para ver logs

## 📊 Próximos Passos

Se o upload funcionar:
- ✅ Marque a tarefa como concluída
- ✅ Teste com diferentes tipos de imagem (JPG, PNG, WebP)
- ✅ Teste o limite de tamanho (5MB)

Se continuar com erro:
- 📋 Copie os logs do console e do terminal
- 📧 Compartilhe os logs para análise mais detalhada

---

**Última atualização:** Correção da instância global do Supabase
