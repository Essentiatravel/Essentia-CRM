# 🚀 GUIA COMPLETO: REATIVAR SUPABASE E POPULAR BANCO DE DADOS

## ⚠️ PROBLEMA ATUAL

Seu projeto Supabase está **PAUSADO/INATIVO**, por isso a aplicação não consegue conectar ao banco de dados e está usando dados mockados.

```
❌ Erro: getaddrinfo ENOTFOUND db.nvviwqoxeznxpzitpwua.supabase.co
```

---

## 📋 PASSO A PASSO PARA RESOLVER

### **PASSO 1: Reativar o Projeto Supabase** ⚡

1. **Acesse o Supabase Dashboard:**
   ```
   🔗 https://supabase.com/dashboard
   ```

2. **Faça login** com sua conta

3. **Localize seu projeto:**
   - Procure por: `nvviwqoxeznxpzitpwua`
   - Ou procure pelo nome do projeto

4. **Verifique o status:**
   - Se aparecer **"Paused"** ou **"Inactive"**
   - Você verá um botão **"Resume Project"** ou **"Restore"**

5. **Clique em "Resume Project"**
   - ⏳ Aguarde 2-5 minutos
   - O projeto levará alguns minutos para voltar ao estado ativo
   - ✅ Quando estiver verde/ativo, prossiga para o PASSO 2

---

### **PASSO 2: Executar Script SQL** 📝

1. **No painel do Supabase**, vá para:
   ```
   Menu lateral esquerdo → SQL Editor
   ```

2. **Clique em "New Query"** (botão no topo direito)

3. **Abra o arquivo de script:**
   - No seu projeto, abra: `SETUP_SUPABASE.sql`
   - Ou copie o conteúdo abaixo

4. **Cole TODO o conteúdo do script** na área de edição

5. **Clique em "Run"** (ou pressione `Ctrl + Enter`)

6. **Aguarde a execução:**
   - ✅ Você verá mensagens de sucesso
   - ✅ No final, verá 3 tabelas de resultados:
     - Total de passeios (deve ser 12)
     - Resumo por categoria
     - 5 passeios mais caros

---

### **PASSO 3: Verificar se Funcionou** ✅

1. **Teste a conexão no terminal:**
   ```bash
   node test-db-connection.js
   ```

   **Resultado esperado:**
   ```
   ✅ CONEXÃO BEM SUCEDIDA!
   ✅ Tabela "passeios" existe!
   📊 Total de passeios no banco: 12
   ```

2. **Reinicie o servidor Next.js:**
   ```bash
   # Pressione Ctrl+C para parar o servidor
   # Depois execute:
   cd apps/web
   npm run dev
   ```

3. **Acesse a aplicação:**
   ```
   🔗 http://localhost:5000
   ```

4. **Verifique se os passeios aparecem:**
   - ✅ Deve mostrar 12 passeios com nomes reais
   - ✅ Imagens bonitas do Unsplash
   - ✅ Informações completas
   - ❌ Se ainda mostrar "Tour Paris Romântica (demo)", o banco não conectou

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### **Problema 1: Projeto continua pausado após clicar em Resume**

**Solução:**
- Aguarde mais 5 minutos
- Recarregue a página do dashboard
- Verifique se há mensagens de erro no Supabase
- Pode ser necessário adicionar método de pagamento (plano gratuito tem limitações)

---

### **Problema 2: Erro ao executar o script SQL**

**Erro comum:**
```
ERROR: relation "passeios" already exists
```

**Solução:**
- A tabela já existe!
- Role o script até a seção "VERIFICAÇÃO FINAL"
- Execute APENAS as queries SELECT (últimas 3 queries)
- Isso mostrará os dados existentes

---

### **Problema 3: Script executado mas dados não aparecem na aplicação**

**Verificar:**

1. **Reiniciou o servidor?**
   ```bash
   # Parar servidor (Ctrl+C) e reiniciar
   npm run dev
   ```

2. **Limpar cache do navegador:**
   ```
   Pressione: Ctrl + Shift + R (ou Cmd + Shift + R no Mac)
   ```

3. **Verificar logs do servidor:**
   - Deve aparecer: `✅ X passeios encontrados no banco`
   - Se aparecer: `📦 Retornando dados de demonstração` = ainda não conectou

---

### **Problema 4: Erro "password authentication failed"**

**Solução:**
1. No Supabase Dashboard, vá em `Settings → Database`
2. Clique em `Reset Database Password`
3. Copie a nova senha
4. Atualize o arquivo `.env.local`:
   ```env
   DATABASE_URL=postgresql://postgres:NOVA_SENHA@db.nvviwqoxeznxpzitpwua.supabase.co:5432/postgres
   ```
   (Substitua `NOVA_SENHA` pela senha que você copiou)

---

## 📊 O QUE O SCRIPT FAZ

### **Cria a tabela `passeios` com:**
- ✅ 12 passeios de exemplo
- ✅ Categorias variadas: Romance, Aventura, Gastronomia, História, Cultural, Natureza, Religioso
- ✅ Imagens reais do Unsplash
- ✅ Preços realistas (R$ 340 a R$ 4.500)
- ✅ Descrições detalhadas
- ✅ Inclusões (o que está incluído)
- ✅ Idiomas disponíveis
- ✅ Capacidade máxima

### **Passeios incluídos:**
1. 🌹 Tour Paris Romântica - R$ 450
2. ⛰️ Aventura nos Alpes Suíços - R$ 680
3. 🍷 Tour Gastronômico Toscana - R$ 520
4. 🏛️ História de Roma - R$ 380
5. 🎨 Arte e Cultura Florença - R$ 420
6. 🦁 Safari Fotográfico África - R$ 890
7. ⛪ Caminho de Santiago - R$ 750
8. 🚢 Cruzeiro Mediterrâneo - R$ 3.200
9. 🏔️ Expedição Patagônia - R$ 1.450
10. 🍣 Culinária Japonesa Tóquio - R$ 580
11. 🖼️ Museus de Londres - R$ 340
12. 🧗 Escalada Aconcágua - R$ 4.500

---

## 🎯 CHECKLIST FINAL

Antes de considerar tudo funcionando:

- [ ] Projeto Supabase está ATIVO (verde no dashboard)
- [ ] Script SQL executado sem erros
- [ ] Teste de conexão passou (`node test-db-connection.js`)
- [ ] Servidor Next.js reiniciado
- [ ] Aplicação abre em http://localhost:5000
- [ ] Mostra 12 passeios com imagens reais
- [ ] Pode clicar em "Ver Detalhes" e abre a página
- [ ] Formulário de reserva funciona
- [ ] Pode avançar para checkout

---

## 💡 DICAS IMPORTANTES

### **Evitar que o projeto pause novamente:**

1. **Projetos Supabase gratuitos pausam após:**
   - 7 dias de inatividade
   - Sem requisições ao banco

2. **Para manter ativo:**
   - Use a aplicação regularmente
   - Ou considere upgrade para plano pago (US$ 25/mês)
   - Ou configure um cron job para fazer requisições periódicas

### **Backup dos dados:**

Depois de popular o banco, faça backup:

```sql
-- Execute no SQL Editor para exportar dados
SELECT * FROM passeios;
-- Copie o resultado e salve em um arquivo
```

---

## 📞 PRECISA DE AJUDA?

Se após todos esses passos ainda não funcionar:

1. **Tire screenshots:**
   - Dashboard do Supabase (mostrando status do projeto)
   - Erro no terminal
   - Console do navegador (F12)

2. **Copie os logs:**
   ```bash
   # Logs do servidor
   npm run dev 2>&1 | tee debug.log
   ```

3. **Teste a conexão:**
   ```bash
   node test-db-connection.js > conexao.log 2>&1
   ```

Com essas informações podemos diagnosticar o problema exato!

---

## ✅ RESUMO RÁPIDO

```bash
# 1. Reativar projeto no Supabase Dashboard
https://supabase.com/dashboard → Resume Project

# 2. Executar script SQL
SQL Editor → New Query → Colar SETUP_SUPABASE.sql → Run

# 3. Testar conexão
node test-db-connection.js

# 4. Reiniciar servidor
npm run dev

# 5. Acessar aplicação
http://localhost:5000
```

🎉 **Pronto! Seu sistema estará funcionando com dados reais do banco!**
