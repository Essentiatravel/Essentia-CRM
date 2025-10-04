# 🚀 Guia de Deploy na Vercel

## ⚠️ Problemas Comuns e Soluções

### 1. Erro de Login na Vercel

**Problema:** Usuários não conseguem fazer login na versão da Vercel

**Causas Prováveis:**
- Variáveis de ambiente não configuradas
- URL do Supabase incorreta
- Chaves de API inválidas

**Solução:**

1. **Configurar Variáveis de Ambiente na Vercel:**
   
   Acesse: `Settings` → `Environment Variables` e adicione:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_key_aqui
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
   ```

2. **Configurar Redirect URLs no Supabase:**

   No painel do Supabase, vá em:
   `Authentication` → `URL Configuration` → `Redirect URLs`

   Adicione:
   ```
   https://seu-dominio.vercel.app/
   https://seu-dominio.vercel.app/admin
   https://seu-dominio.vercel.app/login
   http://localhost:3000/ (para desenvolvimento)
   ```

3. **Site URL no Supabase:**

   Configure o Site URL como:
   ```
   https://seu-dominio.vercel.app
   ```

### 2. Lentidão na Vercel

**Causas:**
- Cold starts do Serverless
- Queries não otimizadas
- Falta de cache

**Soluções Implementadas:**
- ✅ Queries otimizadas com Supabase
- ✅ Endpoint `/api/agendamentos/all-data` que busca tudo em paralelo
- ✅ Navegação client-side com Next.js Link
- ✅ Select específico apenas com colunas necessárias

**Melhorias Adicionais Recomendadas:**
```typescript
// Adicionar em next.config.ts
export default {
  experimental: {
    serverActions: true,
  },
  // Cache de imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}
```

### 3. Checklist de Deploy

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Redirect URLs configurados no Supabase  
- [ ] Site URL configurado no Supabase
- [ ] Banco de dados populado com dados (usar `/api/seed-data`)
- [ ] Políticas RLS (Row Level Security) configuradas no Supabase
- [ ] Usuário admin criado no Supabase Auth

### 4. Criar Usuário Admin

Execute no SQL Editor do Supabase:

```sql
-- 1. Criar usuário no Supabase Auth
-- Faça isso pela interface: Authentication → Users → Invite User
-- Email: admin@turguide.com
-- Password: (defina uma senha segura)

-- 2. Inserir na tabela users com tipo admin
INSERT INTO users (email, nome, user_type)
VALUES ('admin@turguide.com', 'Administrador', 'admin')
ON CONFLICT (email) 
DO UPDATE SET user_type = 'admin';
```

### 5. Configurar RLS (Row Level Security)

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE guias ENABLE ROW LEVEL SECURITY;
ALTER TABLE passeios ENABLE ROW LEVEL SECURITY;

-- Política para admin ver tudo
CREATE POLICY "Admin tem acesso total" ON agendamentos
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.user_type = 'admin'
  )
);

-- Replicar para outras tabelas
CREATE POLICY "Admin tem acesso total" ON clientes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.user_type = 'admin'
  )
);

CREATE POLICY "Admin tem acesso total" ON guias
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.user_type = 'admin'
  )
);

CREATE POLICY "Admin tem acesso total" ON passeios
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.user_type = 'admin'
  )
);
```

### 6. Testar Deploy

1. Faça login com usuário admin
2. Teste navegação entre páginas
3. Teste criação de agendamento
4. Verifique console do navegador para erros
5. Verifique logs da Vercel

### 7. Comandos Úteis

```bash
# Rodar localmente
npm run dev

# Build para produção
npm run build

# Testar build de produção localmente
npm run build && npm start

# Popular dados de teste
curl -X POST https://seu-dominio.vercel.app/api/seed-data
```

## 📊 Monitoramento

- **Logs da Vercel:** https://vercel.com/dashboard
- **Logs do Supabase:** https://app.supabase.com
- **Console do Navegador:** F12 → Console

## 🆘 Suporte

Se ainda tiver problemas:

1. Verifique logs da Vercel
2. Verifique console do navegador
3. Verifique se as variáveis de ambiente estão corretas
4. Teste login local primeiro
