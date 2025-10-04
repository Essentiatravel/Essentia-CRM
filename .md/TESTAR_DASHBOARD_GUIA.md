# 🧪 Como Testar o Dashboard do Guia

## 📋 Pré-requisitos:

1. **Criar um usuário guia** no dashboard admin
2. **Fazer login com o usuário guia**
3. **Acessar** http://localhost:5000/guia

## 🚀 Passos para testar:

### 1. Criar usuário guia
No dashboard admin (como admin@turguide.com):
- Vá em `/admin/usuarios`
- Crie um novo usuário:
  - **Nome:** Maria
  - **Sobrenome:** Silva
  - **Email:** maria.guia@turguide.com
  - **Tipo:** Guia
  - **Senha:** 123456

### 2. Fazer login como guia
- **Saia** da conta admin
- **Faça login** com:
  - Email: maria.guia@turguide.com
  - Senha: 123456

### 3. Acessar dashboard do guia
- Vá para: http://localhost:5000/guia
- Deve mostrar o dashboard do guia

## 🎯 O que você deve ver:

### ✅ **Cards de Estatísticas:**
- Total de Passeios: 0
- Este Mês: 0  
- Receita do Mês: R$ 0,00
- Avaliação Média: 4.5 (valor padrão)

### ✅ **Seções:**
- **Próximos Passeios:** "Nenhum passeio próximo"
- **Passeios Pendentes:** "Nenhum passeio pendente"

### ✅ **Navegação:**
- Header "Dashboard do Guia"
- Botão "Sair" funcionando
- Menu com Dashboard, Perfil, Configurações

## 🐛 **Se houver erro:**

1. **Verifique os logs** no console (F12)
2. **Teste a API diretamente:**
   ```
   http://localhost:5000/api/guia/dashboard?guiaId=ID_DO_GUIA
   ```
3. **Substitua ID_DO_GUIA** pelo ID real do usuário guia criado

## 📊 **Dados Mostrados:**

Como ainda não há agendamentos reais, o dashboard mostrará:
- Estatísticas zeradas
- Mensagens de "nenhum passeio"
- Estrutura completa funcionando

## 🎨 **Layout Esperado:**

- **Header azul** com navegação
- **4 cards** de estatísticas em linha
- **2 colunas** com próximos e pendentes
- **Design responsivo** e profissional

## ⚠️ **Problemas Comuns:**

1. **"Guia não encontrado":** Usuário não tem `user_type = 'guia'`
2. **"Service role não configurado":** Falta `SUPABASE_SERVICE_ROLE_KEY`
3. **Erro de login:** Usuário não foi criado corretamente no Supabase Auth

**Teste agora e confirme se está funcionando!**