# TourGuide CRM - Documento de Requisitos do Produto (PRD)

## 1. Visão Geral do Produto

### 1.1 Nome do Produto
TourGuide CRM - Sistema de Gerenciamento de Relacionamento com Cliente para Empresas de Turismo

### 1.2 Visão
Revolucionar a gestão de empresas de turismo através de uma plataforma integrada que otimiza operações, maximiza receitas e oferece experiências excepcionais aos clientes.

### 1.3 Missão
Fornecer uma solução completa de CRM especializada em turismo, permitindo que empresas gerenciem eficientemente guias, clientes, passeios e fluxo de trabalho através de uma interface moderna e intuitiva.

## 2. Problema a Ser Resolvido

### 2.1 Dores Atuais
- **Gestão Manual Ineficiente**: Empresas de turismo dependem de planilhas e processos manuais
- **Falta de Visibilidade**: Ausência de dashboards centralizados para tomada de decisões
- **Comunicação Fragmentada**: Coordenação deficiente entre guias, clientes e administradores
- **Perda de Receita**: Oportunidades perdidas por falta de acompanhamento de leads
- **Experiência do Cliente Prejudicada**: Demora na resposta e falta de personalização

### 2.2 Impacto dos Problemas
- Redução da eficiência operacional em até 40%
- Perda de 25% dos leads por falta de follow-up adequado
- Insatisfação de clientes e guias
- Dificuldade de escalar o negócio

## 3. Solução Proposta

### 3.1 Descrição da Solução
O TourGuide CRM é uma plataforma web completa que centraliza todas as operações de uma empresa de turismo, oferecendo:

- **Sistema Kanban** para gestão visual de tarefas e agendamentos
- **Dashboards Personalizados** para diferentes tipos de usuários
- **Gestão Completa de Relacionamentos** (leads, clientes, guias)
- **Automação de Processos** com drag-and-drop workflows
- **Controle Financeiro** integrado com comissões e pagamentos

## 4. Usuários-Alvo

### 4.1 Persona Principal: Administrador da Empresa
- **Perfil**: Proprietário ou gerente de empresa de turismo
- **Idade**: 30-55 anos
- **Objetivos**: Aumentar receita, otimizar operações, melhorar satisfação
- **Frustração**: Processos manuais, falta de controle, perda de oportunidades

### 4.2 Persona Secundária: Guia Turístico
- **Perfil**: Profissional autônomo ou funcionário
- **Idade**: 25-45 anos
- **Objetivos**: Organizar agenda, maximizar ganhos, oferecer bom serviço
- **Frustração**: Comunicação confusa, falta de informações dos clientes

### 4.3 Persona Terciária: Cliente/Turista
- **Perfil**: Pessoa interessada em experiências turísticas
- **Idade**: 25-65 anos
- **Objetivos**: Encontrar passeios únicos, ter experiência personalizada
- **Frustração**: Processos burocráticos, falta de transparência

## 5. Funcionalidades Principais

### 5.1 Sistema de Agendamentos Kanban
**Prioridade: Alta**

- Colunas personalizáveis (Novas Tarefas → Atribuídas → Em Progresso → Pendente → Confirmadas → Concluídas → Canceladas)
- Drag-and-drop para mudança de status
- Cards informativos com todos os detalhes da tarefa
- Modal detalhado para edição completa

### 5.2 Gestão de Usuários Multinível
**Prioridade: Alta**

- **Admin**: Controle total, criação de tarefas, gestão financeira
- **Guia**: Visualização de agendamentos pessoais, atualização de status
- **Cliente**: Exploração de passeios, solicitação de reservas

### 5.3 Dashboards Inteligentes
**Prioridade: Alta**

- **Dashboard Administrativo**: Métricas de negócio, receita, tarefas pendentes
- **Dashboard do Guia**: Agenda pessoal, comissões, performance
- **Dashboard do Cliente**: Passeios disponíveis, histórico, recomendações

### 5.4 Gestão de Passeios
**Prioridade: Alta**

- Cadastro completo (nome, descrição, preço, duração, imagens)
- Categorização por tipo (cultural, aventura, gastronômico, etc.)
- Controle de disponibilidade e capacidade
- Gestão de idiomas e inclusões

### 5.5 Sistema Financeiro
**Prioridade: Média**

- Controle de receitas e comissões
- Relatórios financeiros detalhados
- Gestão de status de pagamento
- Dashboard financeiro com métricas

### 5.6 Gestão de Leads e Clientes
**Prioridade: Média**

- Captura e qualificação de leads
- Acompanhamento do funil de conversão
- Histórico completo de interações
- Segmentação por interesses

## 6. Fluxos de Trabalho Principais

### 6.1 Fluxo de Criação de Tarefa (Admin)
1. Admin acessa página "Agendamentos"
2. Clica em "Nova Tarefa"
3. Seleciona passeio, cliente, guia, data
4. Define percentual de comissão
5. Tarefa criada na coluna "Novas Tarefas"
6. Sistema calcula automaticamente valores

### 6.2 Fluxo de Gestão de Tarefa
1. Admin ou guia arrasta tarefa entre colunas
2. Status atualizado automaticamente
3. Notificações enviadas aos envolvidos
4. Quando "Confirmada" → Redirecionamento para calendário
5. Histórico mantido para auditoria

### 6.3 Fluxo de Solicitação de Cliente
1. Cliente explora passeios disponíveis
2. Seleciona passeio de interesse
3. Preenche formulário de solicitação
4. Solicitação criada como "Nova Tarefa"
5. Admin recebe e pode atribuir guia

## 7. Requisitos Técnicos

### 7.1 Frontend
- **Framework**: React com componentes shadcn/ui
- **Styling**: Tailwind CSS
- **Animações**: Framer Motion
- **Drag & Drop**: @hello-pangea/dnd
- **Ícones**: Lucide React

### 7.2 Responsividade
- Design mobile-first
- Breakpoints: 768px (tablet), 1024px (desktop)
- Componentes adaptáveis
- Navegação otimizada para touch

## 8. Métricas de Sucesso

### 8.1 KPIs Operacionais
- **Taxa de Conversão de Leads**: >25%
- **Tempo Médio de Resposta**: <2 horas
- **Satisfação do Cliente**: >4.5/5.0
- **Utilização de Guias**: >80%

### 8.2 KPIs de Negócio
- **Crescimento de Receita**: +30% trimestral
- **Número de Passeios Realizados**: +40% mensal
- **Retenção de Clientes**: >70%
- **Comissão Média dos Guias**: R$ 500/mês

## 9. Roadmap de Desenvolvimento

### 9.1 Fase 1 - MVP (Concluída)
- ✅ Sistema de autenticação
- ✅ Dashboards por tipo de usuário
- ✅ CRUD completo de passeios
- ✅ Sistema Kanban de agendamentos
- ✅ Gestão básica de usuários

### 9.2 Fase 2 - Melhorias (Em Desenvolvimento)
- 🔄 Sistema financeiro avançado
- 🔄 Relatórios e analytics
- 🔄 Notificações em tempo real
- 🔄 Calendário integrado

### 9.3 Fase 3 - Expansão
- 📅 Sistema de avaliações
- 📅 Chat integrado
- 📅 App mobile nativo
- 📅 Integração com pagamentos

## 10. Considerações de UX/UI

### 10.1 Princípios de Design
- **Simplicidade**: Interfaces limpas e intuitivas
- **Consistência**: Padrões visuais unificados
- **Feedback Visual**: Confirmações claras de ações
- **Acessibilidade**: Suporte a diferentes dispositivos

### 10.2 Paleta de Cores
- **Primária**: Azul (#0B4F6C) - Confiança e profissionalismo
- **Secundária**: Dourado (#F4A261) - Luxo e qualidade
- **Sucesso**: Verde (#10B981) - Confirmações
- **Alerta**: Âmbar (#F59E0B) - Atenção
- **Erro**: Vermelho (#EF4444) - Problemas

## 11. Considerações de Segurança

### 11.1 Proteção de Dados
- Dados pessoais criptografados
- Conformidade com LGPD
- Backups automáticos
- Logs de auditoria

### 11.2 Controle de Acesso
- Autenticação obrigatória
- Permissões baseadas em roles
- Sessões com timeout
- Validação de dados no backend

## 12. Próximos Passos

### 12.1 Melhorias Imediatas
- **Notificações Push**: Alertas em tempo real
- **Filtros Avançados**: Busca por múltiplos critérios
- **Exportação de Dados**: Relatórios em PDF/Excel
- **Integração WhatsApp**: Comunicação direta

---

*Documento criado em: 18 de setembro de 2025*
*Versão: 1.0*
*Última atualização: 18 de setembro de 2025*

