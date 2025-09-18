# 🚀 Guia de Deploy

Este guia apresenta as melhores práticas e opções para fazer deploy do **TourGuide CRM** em produção.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Pré-requisitos](#-pré-requisitos)
- [Opções de Deploy](#-opções-de-deploy)
- [Deploy com Vercel (Recomendado)](#-deploy-com-vercel-recomendado)
- [Deploy com Docker](#-deploy-com-docker)
- [Deploy Manual (VPS)](#-deploy-manual-vps)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Monitoramento](#-monitoramento)
- [Backup e Recuperação](#-backup-e-recuperação)
- [Troubleshooting](#-troubleshooting)

## 🌐 Visão Geral

O TourGuide CRM é um monorepo com duas aplicações Next.js que podem ser deployadas separadamente ou em conjunto. A arquitetura permite flexibilidade na escolha da plataforma de deploy.

### Estrutura de Deploy
```
📦 TourGuide CRM
├── 🖥️  Frontend (apps/web)    → Vercel/Netlify
├── 🔧  Backend (apps/server)  → Vercel/Railway/VPS
└── 🗄️  Database              → Turso/PlanetScale/PostgreSQL
```

## 📋 Pré-requisitos

### Contas Necessárias
- [ ] **GitHub**: Para código fonte
- [ ] **Vercel**: Deploy automático (recomendado)
- [ ] **Turso**: Banco de dados SQLite distribuído
- [ ] **Upstash**: Redis para cache (opcional)

### Configurações Locais
- [ ] Node.js 18+ instalado
- [ ] npm/yarn configurado
- [ ] Git configurado
- [ ] Variáveis de ambiente definidas

## 🎯 Opções de Deploy

### 🥇 Vercel (Recomendado)
**Prós**: Deploy automático, CDN global, fácil configuração  
**Contras**: Limitações no plano gratuito  
**Ideal para**: Projetos pequenos a médios

### 🐳 Docker
**Prós**: Consistência entre ambientes, escalável  
**Contras**: Mais complexo de configurar  
**Ideal para**: Projetos enterprise, múltiplos ambientes

### 🖥️ VPS Manual
**Prós**: Controle total, custo previsível  
**Contras**: Manutenção manual, segurança própria  
**Ideal para**: Projetos com requisitos específicos

### ☁️ Outras Opções
- **Railway**: Deploy simples com banco incluso
- **Netlify**: Foco em frontend, bom para JAMstack
- **Digital Ocean**: App Platform com containers
- **AWS**: Escalabilidade máxima com complexidade

## 🚀 Deploy com Vercel (Recomendado)

### Passo 1: Preparar o Repositório

1. **Commit todas as mudanças**
```bash
git add .
git commit -m "feat: preparar para deploy"
git push origin main
```

2. **Criar arquivo de configuração Vercel**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next",
      "config": {
        "distDir": ".next"
      }
    },
    {
      "src": "apps/server/package.json", 
      "use": "@vercel/next",
      "config": {
        "distDir": ".next"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "apps/server/$1"
    },
    {
      "src": "/(.*)",
      "dest": "apps/web/$1"
    }
  ]
}
```

### Passo 2: Configurar Banco de Dados

1. **Criar conta no Turso**
```bash
# Instalar Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Criar banco
turso db create turguide-prod

# Obter URL de conexão
turso db show turguide-prod --url
```

2. **Executar migrações**
```bash
# Aplicar schema
turso db shell turguide-prod < apps/server/src/db/migrations/0000_flimsy_reaper.sql

# Popular dados (opcional para produção)
npm run db:seed
```

### Passo 3: Deploy no Vercel

1. **Conectar repositório**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte seu repositório GitHub

2. **Configurar variáveis de ambiente**
```env
# Database
DATABASE_URL=libsql://your-database-url.turso.io
DATABASE_AUTH_TOKEN=your-auth-token

# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Security (gerar senhas fortes)
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_SECRET=your-nextauth-secret
```

3. **Configurar build settings**
```bash
# Build Command
npm run build

# Output Directory
.next

# Install Command
npm install

# Development Command  
npm run dev
```

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Teste a aplicação

### Passo 4: Configurar Domínio (Opcional)

1. **Adicionar domínio customizado**
   - Vá para Settings > Domains
   - Adicione seu domínio
   - Configure DNS conforme instruções

2. **Configurar SSL**
   - SSL é automático no Vercel
   - Certificado Let's Encrypt gratuito

## 🐳 Deploy com Docker

### Dockerfile para Frontend
```dockerfile
# apps/web/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN npm run build --workspace=apps/web

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Dockerfile para Backend
```dockerfile
# apps/server/Dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/server/package.json ./apps/server/
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build --workspace=apps/server

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/server/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/server/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://backend:3001
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./turguide.db
    volumes:
      - db_data:/app/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  db_data:
```

### Comandos Docker
```bash
# Build e executar
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Atualizar
docker-compose pull
docker-compose up -d
```

## 🖥️ Deploy Manual (VPS)

### Passo 1: Configurar Servidor

1. **Conectar ao servidor**
```bash
ssh user@your-server-ip
```

2. **Instalar dependências**
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install nginx -y

# Instalar certbot para SSL
sudo apt install certbot python3-certbot-nginx -y
```

### Passo 2: Clonar e Configurar Projeto

```bash
# Clonar repositório
git clone https://github.com/Elisson78/turguide.git
cd turguide

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.production
nano .env.production

# Build da aplicação
npm run build
```

### Passo 3: Configurar PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'turguide-frontend',
      cwd: './apps/web',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'turguide-backend',
      cwd: './apps/server', 
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
```

```bash
# Iniciar aplicações
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Configurar auto-start
pm2 startup
```

### Passo 4: Configurar Nginx

```nginx
# /etc/nginx/sites-available/turguide
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/turguide /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Configurar SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🗄️ Configuração do Banco de Dados

### SQLite (Desenvolvimento)
```bash
# Aplicar migrações
npm run db:migrate

# Popular dados
npm run db:seed
```

### Turso (Produção Recomendada)
```bash
# Criar banco
turso db create turguide-prod --location lhr

# Aplicar schema
turso db shell turguide-prod < schema.sql

# Configurar replicação (opcional)
turso db replicate turguide-prod --location gru
```

### PostgreSQL (Alternativa)
```sql
-- Criar banco
CREATE DATABASE turguide_prod;
CREATE USER turguide_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE turguide_prod TO turguide_user;
```

```bash
# Configurar variável de ambiente
DATABASE_URL=postgresql://turguide_user:secure_password@localhost:5432/turguide_prod
```

## 🔧 Variáveis de Ambiente

### Arquivo .env.production
```env
# Database
DATABASE_URL=your-database-connection-string
DATABASE_AUTH_TOKEN=your-database-auth-token

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
API_URL=https://your-domain.com/api

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
NEXTAUTH_SECRET=your-nextauth-secret-key
ENCRYPTION_KEY=your-encryption-key-32-chars

# External Services (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Analytics (opcional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn

# Upload (opcional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Gerar Chaves Seguras
```bash
# JWT Secret (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# NextAuth Secret
openssl rand -base64 32

# Encryption Key
openssl rand -hex 32
```

## 📊 Monitoramento

### Health Check Endpoint
```typescript
// apps/server/src/app/health/route.ts
export async function GET() {
  try {
    // Testar conexão com banco
    const result = await db.select().from(passeios).limit(1);
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version
    });
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    }, { status: 503 });
  }
}
```

### Uptime Monitoring
- **UptimeRobot**: Monitoramento gratuito
- **Pingdom**: Monitoramento profissional
- **StatusPage**: Página de status pública

### Logs
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Sistema
journalctl -f -u nginx
```

## 💾 Backup e Recuperação

### Backup Automático
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/turguide"

# Criar diretório
mkdir -p $BACKUP_DIR

# Backup do banco
turso db dump turguide-prod > $BACKUP_DIR/db_$DATE.sql

# Backup dos uploads (se houver)
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /path/to/uploads

# Limpar backups antigos (manter 30 dias)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

```bash
# Configurar cron job
crontab -e

# Backup diário às 2h
0 2 * * * /path/to/backup.sh
```

### Recuperação
```bash
# Restaurar banco
turso db shell turguide-prod < backup_file.sql

# Restaurar aplicação
git pull origin main
npm install
npm run build
pm2 restart all
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Build Falha
```bash
# Limpar cache
npm run clean
rm -rf node_modules package-lock.json
npm install

# Verificar versões
node --version
npm --version
```

#### 2. Banco de Dados Não Conecta
```bash
# Testar conexão
npm run db:studio

# Verificar variáveis
echo $DATABASE_URL

# Verificar permissões
ls -la database/
```

#### 3. PM2 Não Inicia
```bash
# Verificar status
pm2 status

# Ver logs detalhados
pm2 logs --lines 50

# Reiniciar processo
pm2 restart all
```

#### 4. Nginx Erro 502
```bash
# Verificar se aplicação está rodando
curl http://localhost:3000
curl http://localhost:3001

# Testar configuração Nginx
sudo nginx -t

# Ver logs
sudo tail -f /var/log/nginx/error.log
```

### Comandos Úteis

```bash
# Verificar portas em uso
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :3001

# Verificar espaço em disco
df -h

# Verificar memória
free -h

# Verificar CPU
top

# Verificar logs do sistema
journalctl -f
```

### Contatos de Suporte

- **GitHub Issues**: Para bugs e problemas técnicos
- **Email**: uzualelisson@gmail.com
- **Documentação**: Sempre atualizada no repositório

---

## 📈 Próximos Passos

Após o deploy bem-sucedido:

1. **Configurar monitoramento** de uptime
2. **Implementar backup automático**
3. **Configurar CI/CD** para deploys automáticos
4. **Otimizar performance** com CDN
5. **Implementar analytics** para métricas
6. **Configurar alertas** para problemas

---

<div align="center">

**[⬆ Voltar ao topo](#-guia-de-deploy)**

Deploy feito com ❤️ para o TourGuide CRM

</div>
