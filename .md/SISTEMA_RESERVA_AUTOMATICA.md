# 🚀 Sistema de Reserva Automática - TourGuide

## 📋 Objetivo
Implementar um sistema que automaticamente:
1. **Cadastra o cliente** na tabela `clientes` durante o checkout
2. **Cria o agendamento** no Kanban (status "confirmadas")  
3. **Sincroniza** com o calendário global
4. **Otimiza** a experiência do usuário para reservas mais rápidas

---

## 🎯 Estratégia Escolhida: "Checkout Inteligente"

### **Fluxo Atual:**
```
Cliente → Seleciona Passeio → Preenche Dados → Pagamento → Só cria RESERVA
```

### **Fluxo Novo (Otimizado):**
```
Cliente → Seleciona Passeio → Preenche Dados → Pagamento → CRIA TUDO AUTOMATICAMENTE:
  ├── 1. Verifica se cliente já existe (por email)
  ├── 2. Se não existe → Cria cliente na tabela `clientes`
  ├── 3. Cria agendamento na tabela `agendamentos` (status: "confirmadas")
  ├── 4. Aparece automaticamente no Kanban do admin
  └── 5. Sincroniza com o calendário global
```

---

## 📁 Arquivos que Precisam Ser Modificados

### **1. API de Reservas** ⚡
**Arquivo:** `/apps/web/src/app/api/reservas/route.ts`
**O que fazer:**
- ✅ **Verificar cliente existente** por email
- ✅ **Criar cliente automaticamente** se não existir
- ✅ **Criar agendamento** na tabela `agendamentos` 
- ✅ **Calcular comissão** automaticamente
- ✅ **Retornar IDs** do cliente e agendamento criados

### **2. Esquema do Banco** 🗃️
**Arquivo:** `/apps/web/src/lib/db/schema.ts`
**O que verificar:**
- ✅ Tabela `clientes` com campos: nome, email, telefone, status
- ✅ Tabela `agendamentos` linkada com cliente_id
- ✅ Campos de comissão nos agendamentos

### **3. Serviços de Agendamento** 🔧
**Arquivo:** `/apps/web/src/lib/agendamentos-service.ts`
**O que usar:**
- ✅ Função `createAgendamento()` existente
- ✅ Adaptar para receber cliente_id

---

## 🔄 Implementação Detalhada

### **Etapa 1: Modificar API de Reservas**
```typescript
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 1. VERIFICAR/CRIAR CLIENTE
    let cliente = await db.select().from(clientes)
      .where(eq(clientes.email, data.clienteEmail))
      .limit(1);
    
    if (cliente.length === 0) {
      // Criar novo cliente
      cliente = await db.insert(clientes).values({
        id: randomUUID(),
        nome: data.clienteNome,
        email: data.clienteEmail,
        telefone: data.clienteTelefone,
        status: 'ativo'
      }).returning();
    }
    
    // 2. CRIAR AGENDAMENTO NO KANBAN
    const agendamento = await createAgendamento({
      passeioId: data.passeioId,
      clienteId: cliente[0].id,
      dataPasseio: data.data,
      numeroPessoas: data.pessoas,
      observacoes: data.clienteObservacoes,
      percentualComissao: 30 // padrão
    });
    
    // 3. CRIAR RESERVA (histórico)
    const reserva = await db.insert(reservas).values({
      // ... dados da reserva
    }).returning();
    
    return NextResponse.json({
      success: true,
      clienteId: cliente[0].id,
      agendamentoId: agendamento.id,
      reservaId: reserva[0].id
    });
    
  } catch (error) {
    // tratamento de erro
  }
}
```

### **Etapa 2: Verificar Esquemas do Banco**
- ✅ Confirmar campos da tabela `clientes`
- ✅ Confirmar relacionamento `agendamentos.cliente_id`
- ✅ Verificar campos de comissão

### **Etapa 3: Testar Fluxo Completo**
1. ✅ Cliente faz reserva
2. ✅ Verifica se aparece no Kanban admin
3. ✅ Verifica se aparece no calendário global
4. ✅ Verifica se cliente foi cadastrado

---

## 🎁 Benefícios da Implementação

### **Para o Cliente:**
- ✅ **Experiência mais rápida** - não precisa se cadastrar separadamente
- ✅ **Um clique só** - tudo acontece automaticamente
- ✅ **Menos fricção** no processo de compra

### **Para o Admin:**
- ✅ **Kanban atualizado automaticamente** com novas reservas
- ✅ **Clientes cadastrados automaticamente** 
- ✅ **Calendário global sincronizado**
- ✅ **Menos trabalho manual**

### **Para o Sistema:**
- ✅ **Dados consistentes** entre tabelas
- ✅ **Fluxo unificado** de reservas
- ✅ **Comissões calculadas automaticamente**

---

## 🧪 Casos de Teste

### **Cenário 1: Cliente Novo**
```
Input: email não existe no banco
Expected: 
  - Novo cliente criado
  - Agendamento criado linkado ao cliente
  - Aparece no Kanban
  - Aparece no calendário
```

### **Cenário 2: Cliente Existente**
```
Input: email já existe no banco  
Expected:
  - Cliente não duplicado
  - Agendamento criado linkado ao cliente existente
  - Aparece no Kanban
  - Aparece no calendário
```

### **Cenário 3: Erro de Pagamento**
```
Input: pagamento falha
Expected:
  - Nenhum registro criado (rollback)
  - Cliente não cadastrado
  - Agendamento não criado
```

---

## 📊 Status do Desenvolvimento

- [x] **Modificar API de Reservas** (`/api/reservas/route.ts`) ✅ **CONCLUÍDO**
- [x] **Verificar Esquema do Banco** (`/lib/db/schema.ts`) ✅ **CONCLUÍDO**  
- [x] **Criar Dashboard do Cliente** (`/app/cliente/dashboard/page.tsx`) ✅ **CONCLUÍDO**
- [x] **APIs de Cliente** (`/api/cliente/*`) ✅ **CONCLUÍDO**
- [x] **Sistema de Login Automático** ✅ **CONCLUÍDO**
- [x] **Geração de Senha Automática** ✅ **CONCLUÍDO**
- [x] **Histórico e Recibos** ✅ **CONCLUÍDO**
- [ ] **Testar Fluxo Cliente Novo**
- [ ] **Testar Fluxo Cliente Existente**
- [ ] **Verificar Kanban Admin**
- [ ] **Verificar Calendário Global**

---

## 🚀 Próximos Passos

1. ✅ **Analisar esquema atual do banco** - CONCLUÍDO
2. ✅ **Modificar API de reservas para criar cliente + agendamento** - CONCLUÍDO
3. **Testar fluxo completo** - PRÓXIMO
4. ✅ **Criar dashboard do cliente com login automático** - CONCLUÍDO
5. ✅ **Implementar visualização de recibo e histórico** - CONCLUÍDO
6. ✅ **Criar sistema de edição de perfil e senha** - CONCLUÍDO
7. **Validar aparição no Kanban** - PRÓXIMO
8. **Validar aparição no calendário global** - PRÓXIMO
9. **Documentar processo finalizado**

---

## 🔧 Implementação Realizada

### **API de Reservas Atualizada** (`/api/reservas/route.ts`)

A API agora executa automaticamente:

1. **Verificação de Cliente**: Busca cliente existente por email
2. **Criação de Cliente**: Se não existe, cria novo cliente na tabela `clientes`
3. **Criação de Agendamento**: Insere no Kanban com status "confirmadas"
4. **Cálculo de Comissão**: Automaticamente calcula 30% sobre valor total
5. **Histórico**: Mantém registro na tabela `reservas`

### **Funcionalidades Implementadas**:
- ✅ Detecção automática de cliente novo vs. existente
- ✅ Criação automática de registro na tabela `clientes`
- ✅ Agendamento aparece automaticamente no Kanban (status: "confirmadas")
- ✅ Comissão calculada automaticamente (30% padrão)
- ✅ Logs detalhados para debug
- ✅ Tratamento de erros robusto
- ✅ Retorna IDs de cliente, agendamento e reserva
- ✅ **NOVO:** Geração automática de senha para cliente
- ✅ **NOVO:** Login automático pós-checkout
- ✅ **NOVO:** Dashboard completo do cliente
- ✅ **NOVO:** Sistema de edição de perfil
- ✅ **NOVO:** Troca de senha com validação
- ✅ **NOVO:** Histórico de reservas e recibos

### **Dashboard do Cliente Implementado** (`/cliente/dashboard`)

O dashboard completo do cliente inclui:

**🏠 Aba Dashboard:**
- Estatísticas do cliente (total de reservas, valor gasto, data cadastro)
- Últimas reservas com resumo visual
- Cards informativos com ícones

**📅 Aba Minhas Reservas:**
- Histórico completo de todas as reservas
- Detalhes: data, pessoas, valor, status, método pagamento
- Botão para baixar recibo em HTML

**✏️ Aba Editar Perfil:**
- Formulário para atualizar: nome, telefone, CPF, endereço
- Email não editável (chave única)
- Validação e feedback visual

**⚙️ Aba Configurações:**
- Sistema de troca de senha seguro
- Alerta para senha temporária (clientes novos)
- Validação de senha atual vs. nova

**🔐 Sistema de Autenticação:**
- Login automático pós-checkout via localStorage
- Senha temporária gerada automaticamente (8 caracteres)
- Hash bcrypt para segurança das senhas
- Sessão persistente no navegador

**📄 Geração de Recibos:**
- Recibos em HTML com design profissional
- Dados completos: passeio, cliente, valores, datas
- Possibilidade de impressão/download

---

## 💡 Melhorias Futuras (Opcional)

- **Login social** (Google/Facebook) para cadastro de 1 clique
- **Guest checkout** com opção de criar conta depois
- **Notificações por email** automáticas
- **WhatsApp integration** para confirmações
- **Sistema de fidelidade** para clientes recorrentes

---

**Data de Criação:** 02/10/2025  
**Status:** Em Planejamento  
**Prioridade:** Alta 🔥