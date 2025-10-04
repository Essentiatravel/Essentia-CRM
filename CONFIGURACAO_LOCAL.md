# 🔧 Configuração Local

## 📁 Pasta Local

Criamos uma pasta `local/` para organizar todos os arquivos de configuração local que **NÃO** são commitados para o repositório.

### 🎯 Objetivo:
- Manter configurações locais separadas do código
- Evitar commits acidentais de credenciais
- Facilitar a configuração para novos desenvolvedores

## 🚀 Como configurar o projeto localmente:

### Opção 1: Script automático (Recomendado)
```bash
bash local/setup-local.sh
```

### Opção 2: Manual
```bash
# 1. Copiar template
cp local/config-local.txt .env.local

# 2. Editar com suas credenciais
nano .env.local

# 3. Iniciar servidor
npm run dev
```

## 🔑 Credenciais do Supabase:

### Como obter:
1. **Acesse:** https://supabase.com/dashboard
2. **Selecione:** Projeto `nvviwqoxeznxpzitpwua`
3. **Vá em:** Settings > API
4. **Copie:**
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### Template do .env.local:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nvviwqoxeznxpzitpwua.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_AQUI
SUPABASE_SERVICE_ROLE_KEY=SUA_CHAVE_SERVICE_AQUI

# Database Configuration
SUPABASE_DB_URL=postgresql://postgres:Essentia%402025@db.nvviwqoxeznxpzitpwua.supabase.co:5432/postgres
DATABASE_URL=${SUPABASE_DB_URL}

# Environment
NODE_ENV=development
```

## 📋 Estrutura da pasta local/:

```
local/
├── README.md              # Documentação da pasta local
├── config-local.txt       # Template de configuração
├── setup-local.sh         # Script de configuração automática
└── env-local-template.txt # Template alternativo
```

## 🔒 Segurança:

- ✅ Pasta `local/` está no `.gitignore`
- ✅ Arquivos `.env.local` são ignorados
- ✅ Credenciais não vão para o repositório
- ✅ Cada desenvolvedor tem suas próprias configurações

## 🎯 URLs do projeto:

- **Local:** http://localhost:5000
- **Admin:** http://localhost:5000/admin/passeios
- **Login:** http://localhost:5000/login
- **Registro:** http://localhost:5000/register

## 🛠️ Comandos úteis:

```bash
# Configurar ambiente
bash local/setup-local.sh

# Iniciar servidor
npm run dev

# Parar servidor
pkill -f "next dev"

# Verificar porta em uso
lsof -ti:5000

# Matar processo na porta
kill -9 $(lsof -ti:5000)

# Verificar se .env.local existe
ls -la .env.local
```

## 📝 Notas importantes:

1. **Sempre** edite o arquivo `.env.local` com suas credenciais reais
2. **Nunca** commite arquivos `.env.local` ou da pasta `local/`
3. **Cada desenvolvedor** deve ter suas próprias credenciais
4. **Em produção** (Vercel), as variáveis são configuradas no painel da Vercel

---

**🎉 Agora você pode configurar o projeto localmente sem se preocupar com commits acidentais de credenciais!**
