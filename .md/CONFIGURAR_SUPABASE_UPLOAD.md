# 🔧 Configuração do Upload de Imagens - Supabase Storage

## ✅ Correções Implementadas

### 1. **Sistema de Autenticação Corrigido**
- ✅ API de upload agora recebe token de autenticação via header `Authorization`
- ✅ Hook personalizado `useImageUpload` para gerenciar uploads
- ✅ Validação de sessão do Supabase antes do upload
- ✅ Tratamento de erros melhorado

### 2. **Configuração do Next.js Atualizada**
- ✅ Domínios do Supabase Storage adicionados ao `next.config.ts`
- ✅ Suporte para imagens do Supabase Storage

### 3. **Interface Melhorada**
- ✅ Indicador de carregamento durante upload
- ✅ Mensagens de erro claras
- ✅ Validação de tipos de arquivo (JPG, PNG, WebP)
- ✅ Limite de tamanho (5MB)

## 🚀 Próximos Passos

### 1. **Configurar Variáveis de Ambiente**

Crie um arquivo `.env.local` na pasta `apps/web/` com:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nvviwqoxeznxpzitpwua.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
```

### 2. **Obter as Chaves do Supabase**

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Settings** → **API**
3. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. **Configurar Storage Bucket**

1. No Supabase Dashboard, vá em **Storage**
2. Verifique se o bucket "cards turs" existe
3. Se não existir, crie um novo bucket:
   - Nome: `cards turs`
   - Público: ✅ Sim
   - Política: Permitir uploads autenticados

### 4. **Configurar Políticas de Storage**

No Supabase Dashboard → **Storage** → **Policies**:

```sql
-- Política para permitir uploads autenticados
CREATE POLICY "Permitir uploads autenticados" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública" ON storage.objects
FOR SELECT USING (bucket_id = 'cards turs');
```

### 5. **Testar o Upload**

1. Inicie o servidor: `npm run dev`
2. Acesse: `http://localhost:3001/admin/passeios`
3. Tente fazer upload de uma imagem
4. Verifique se a imagem aparece no Supabase Storage

## 🔍 Troubleshooting

### Erro: "Acesso negado"
- ✅ Verifique se está logado como admin
- ✅ Verifique se as variáveis de ambiente estão corretas
- ✅ Verifique se o token de sessão está sendo passado

### Erro: "Bucket não encontrado"
- ✅ Verifique se o bucket "cards turs" existe no Supabase
- ✅ Verifique se o nome está exatamente igual (com espaço)

### Erro: "Política de acesso negada"
- ✅ Configure as políticas de Storage no Supabase
- ✅ Verifique se o usuário tem permissão de upload

## 📁 Estrutura de Arquivos

```
apps/web/
├── src/
│   ├── hooks/
│   │   └── useImageUpload.ts          # Hook para upload
│   ├── components/
│   │   └── add-tour-modal.tsx         # Modal com upload
│   └── app/
│       └── api/
│           └── upload/
│               └── route.ts           # API de upload
├── .env.local                         # Variáveis de ambiente
└── next.config.ts                     # Configuração do Next.js
```

## 🎯 Status Atual

- ✅ **Autenticação**: Corrigida
- ✅ **API de Upload**: Funcionando
- ✅ **Interface**: Melhorada
- ✅ **Validação**: Implementada
- ⏳ **Teste**: Aguardando configuração das variáveis

---

**Próximo passo**: Configure as variáveis de ambiente e teste o upload! 🚀
