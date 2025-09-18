# 🔌 Documentação da API

Esta documentação descreve todos os endpoints e funcionalidades da API do **TourGuide CRM**, construída com tRPC para comunicação type-safe.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Autenticação](#-autenticação)
- [Routers](#-routers)
- [Tipos de Dados](#-tipos-de-dados)
- [Códigos de Erro](#-códigos-de-erro)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Webhook](#-webhooks)

## 🌐 Visão Geral

A API do TourGuide utiliza **tRPC** para fornecer endpoints type-safe com validação automática usando **Zod**. Todos os dados são validados tanto no cliente quanto no servidor.

### Base URL
```
http://localhost:3000/api/trpc
```

### Características
- **Type-safe**: Tipagem completa em TypeScript
- **Validação automática**: Schemas Zod em todos os inputs
- **Error handling**: Tratamento consistente de erros
- **Relacionamentos**: Dados relacionados incluídos automaticamente
- **Performance**: Queries otimizadas com Drizzle ORM

## 🔐 Autenticação

Atualmente, a API utiliza autenticação simples baseada em sessão. Todos os procedures são públicos (`publicProcedure`).

> **⚠️ Nota de Segurança**: Em produção, implemente autenticação JWT ou similar com middleware de proteção.

### Endpoints de Autenticação

#### Login
```typescript
// POST /api/auth/login
{
  email: string;
  senha: string;
}

// Resposta
{
  success: boolean;
  user: {
    id: string;
    nome: string;
    email: string;
    tipo: 'admin' | 'guia' | 'cliente';
    status: string;
  }
}
```

#### Registro
```typescript
// POST /api/auth/register
{
  nome: string;
  email: string;
  senha: string;
  tipo: 'admin' | 'guia' | 'cliente';
  // Campos específicos por tipo...
}

// Resposta
{
  success: boolean;
  message: string;
}
```

## 🎯 Routers

### 📅 Agendamentos Router

Gerencia o ciclo completo de agendamentos desde criação até conclusão.

#### `agendamentos.list`
Lista todos os agendamentos com dados relacionados.

```typescript
// Query
const agendamentos = await trpc.agendamentos.list.query();

// Resposta
Array<{
  id: string;
  passeioId: string;
  clienteId: string;
  guiaId?: string;
  dataPasseio: string;
  horarioInicio?: string;
  horarioFim?: string;
  numeroPessoas: number;
  valorTotal: number;
  valorComissao: number;
  percentualComissao: number;
  status: 'em_progresso' | 'pendente_cliente' | 'confirmadas' | 'concluidas' | 'canceladas';
  observacoes?: string;
  motivoCancelamento?: string;
  avaliacaoCliente?: number;
  comentarioCliente?: string;
  criadoEm: string;
  atualizadoEm: string;
  // Dados relacionados
  passeio: Passeio;
  cliente: Cliente;
  guia?: Guia;
}>
```

#### `agendamentos.getByStatus`
Filtra agendamentos por status (usado no Kanban).

```typescript
// Input
const agendamentos = await trpc.agendamentos.getByStatus.query({
  status: 'em_progresso'
});
```

#### `agendamentos.getById`
Busca um agendamento específico por ID.

```typescript
// Input
const agendamento = await trpc.agendamentos.getById.query({
  id: 'agendamento-uuid'
});
```

#### `agendamentos.create`
Cria um novo agendamento.

```typescript
// Input
const novoAgendamento = await trpc.agendamentos.create.mutate({
  passeioId: string;
  clienteId: string;
  guiaId?: string;
  dataPasseio: string; // ISO date string
  horarioInicio?: string;
  horarioFim?: string;
  numeroPessoas: number; // min: 1
  valorTotal: number; // positivo
  percentualComissao?: number; // 0-100, default: 30
  observacoes?: string;
});

// Resposta: Agendamento criado com dados relacionados
```

#### `agendamentos.updateStatus`
Atualiza o status de um agendamento (drag & drop do Kanban).

```typescript
// Input
await trpc.agendamentos.updateStatus.mutate({
  id: string;
  status: 'em_progresso' | 'pendente_cliente' | 'confirmadas' | 'concluidas' | 'canceladas';
});
```

#### `agendamentos.update`
Atualiza dados completos de um agendamento.

```typescript
// Input
await trpc.agendamentos.update.mutate({
  id: string;
  data: {
    passeioId?: string;
    clienteId?: string;
    guiaId?: string;
    dataPasseio?: string;
    numeroPessoas?: number;
    valorTotal?: number;
    percentualComissao?: number;
    observacoes?: string;
  };
});
```

#### `agendamentos.assignGuia`
Atribui um guia a um agendamento.

```typescript
// Input
await trpc.agendamentos.assignGuia.mutate({
  id: string;
  guiaId: string;
});
```

#### `agendamentos.cancel`
Cancela um agendamento.

```typescript
// Input
await trpc.agendamentos.cancel.mutate({
  id: string;
  motivo: string;
});
```

#### `agendamentos.addAvaliacao`
Adiciona avaliação do cliente ao agendamento.

```typescript
// Input
await trpc.agendamentos.addAvaliacao.mutate({
  id: string;
  avaliacao: number; // 1-5
  comentario?: string;
});
```

#### `agendamentos.getStats`
Retorna estatísticas para o dashboard.

```typescript
// Query
const stats = await trpc.agendamentos.getStats.query();

// Resposta
{
  total: number;
  pendentes: number;
  confirmados: number;
  concluidos: number;
  receita: number;
}
```

#### `agendamentos.delete`
Remove um agendamento permanentemente.

```typescript
// Input
await trpc.agendamentos.delete.mutate({
  id: string;
});
```

### 👥 Clientes Router

Gerencia informações dos clientes.

#### `clientes.list`
Lista todos os clientes ativos.

```typescript
// Query
const clientes = await trpc.clientes.list.query();

// Resposta
Array<{
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: {
    rua?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    pais?: string;
  };
  preferencias: string[];
  observacoes?: string;
  status: string;
  criadoEm: string;
  atualizadoEm: string;
}>
```

#### `clientes.getById`
Busca cliente por ID.

```typescript
// Input
const cliente = await trpc.clientes.getById.query({
  id: string;
});
```

#### `clientes.getByEmail`
Busca cliente por email.

```typescript
// Input
const cliente = await trpc.clientes.getByEmail.query({
  email: string;
});
```

#### `clientes.create`
Cria novo cliente.

```typescript
// Input
const novoCliente = await trpc.clientes.create.mutate({
  nome: string; // min: 1
  email: string; // formato email
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: {
    rua?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    pais?: string;
  };
  preferencias?: string[];
  observacoes?: string;
});
```

#### `clientes.update`
Atualiza dados do cliente.

```typescript
// Input
await trpc.clientes.update.mutate({
  id: string;
  data: {
    nome?: string;
    email?: string;
    telefone?: string;
    cpf?: string;
    dataNascimento?: string;
    endereco?: object;
    preferencias?: string[];
    observacoes?: string;
  };
});
```

#### `clientes.delete`
Remove cliente (soft delete).

```typescript
// Input
await trpc.clientes.delete.mutate({
  id: string;
});
```

### 🗣️ Guias Router

Gerencia informações dos guias turísticos.

#### `guias.list`
Lista todos os guias.

```typescript
// Query
const guias = await trpc.guias.list.query();

// Resposta
Array<{
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  especialidades: string[];
  idiomas: string[];
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  passeiosRealizados: number;
  comissaoTotal: number;
  percentualComissao: number;
  biografia?: string;
  foto?: string;
  status: 'ativo' | 'inativo' | 'pendente';
  dataRegistro: string;
  criadoEm: string;
  atualizadoEm: string;
}>
```

#### `guias.listActive`
Lista apenas guias ativos.

```typescript
// Query
const guiasAtivos = await trpc.guias.listActive.query();
```

#### `guias.getById`
Busca guia por ID.

```typescript
// Input
const guia = await trpc.guias.getById.query({
  id: string;
});
```

#### `guias.create`
Cria novo guia.

```typescript
// Input
const novoGuia = await trpc.guias.create.mutate({
  nome: string; // min: 1
  email: string; // formato email
  telefone?: string;
  cpf?: string;
  especialidades: string[]; // min: 1
  idiomas: string[]; // min: 1
  percentualComissao?: number; // 0-100
  biografia?: string;
  foto?: string; // URL válida
});
```

#### `guias.update`
Atualiza dados do guia.

```typescript
// Input
await trpc.guias.update.mutate({
  id: string;
  data: {
    nome?: string;
    email?: string;
    telefone?: string;
    cpf?: string;
    especialidades?: string[];
    idiomas?: string[];
    percentualComissao?: number;
    biografia?: string;
    foto?: string;
  };
});
```

#### `guias.updateStatus`
Atualiza status do guia.

```typescript
// Input
await trpc.guias.updateStatus.mutate({
  id: string;
  status: 'ativo' | 'inativo' | 'pendente';
});
```

#### `guias.updateStats`
Atualiza estatísticas do guia após passeio concluído.

```typescript
// Input
await trpc.guias.updateStats.mutate({
  id: string;
  avaliacaoNova: number; // 1-5
  comissaoNova: number;
});
```

#### `guias.delete`
Remove guia (soft delete).

```typescript
// Input
await trpc.guias.delete.mutate({
  id: string;
});
```

### 🗺️ Passeios Router

Gerencia o catálogo de passeios.

#### `passeios.list`
Lista todos os passeios ativos.

```typescript
// Query
const passeios = await trpc.passeios.list.query();

// Resposta
Array<{
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: string;
  categoria: string;
  imagens: string[];
  inclusoes: string[];
  idiomas: string[];
  capacidadeMaxima: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}>
```

#### `passeios.getById`
Busca passeio por ID.

```typescript
// Input
const passeio = await trpc.passeios.getById.query({
  id: string;
});
```

#### `passeios.create`
Cria novo passeio.

```typescript
// Input
const novoPasseio = await trpc.passeios.create.mutate({
  nome: string; // min: 1
  descricao: string; // min: 1
  preco: number; // positivo
  duracao: string; // min: 1
  categoria: string; // min: 1
  imagens?: string[]; // URLs válidas
  inclusoes?: string[];
  idiomas?: string[];
  capacidadeMaxima?: number; // positivo, default: 20
});
```

#### `passeios.update`
Atualiza dados do passeio.

```typescript
// Input
await trpc.passeios.update.mutate({
  id: string;
  data: {
    nome?: string;
    descricao?: string;
    preco?: number;
    duracao?: string;
    categoria?: string;
    imagens?: string[];
    inclusoes?: string[];
    idiomas?: string[];
    capacidadeMaxima?: number;
  };
});
```

#### `passeios.delete`
Remove passeio (soft delete).

```typescript
// Input
await trpc.passeios.delete.mutate({
  id: string;
});
```

## 📊 Tipos de Dados

### Status de Agendamento
```typescript
type StatusAgendamento = 
  | 'em_progresso'     // Recém criado, aguardando atribuição
  | 'pendente_cliente' // Aguardando confirmação do cliente
  | 'confirmadas'      // Confirmado e no calendário
  | 'concluidas'       // Passeio realizado
  | 'canceladas';      // Cancelado
```

### Status de Usuário
```typescript
type StatusUsuario = 
  | 'ativo'    // Usuário ativo
  | 'inativo'  // Usuário desativado
  | 'pendente' // Aguardando aprovação (apenas guias)
  | 'bloqueado'; // Bloqueado por problemas
```

### Tipo de Usuário
```typescript
type TipoUsuario = 
  | 'admin'   // Administrador do sistema
  | 'guia'    // Guia turístico
  | 'cliente'; // Cliente/turista
```

### Categorias de Passeio
```typescript
type CategoriaPasseio = 
  | 'História'     // Tours históricos
  | 'Arte'         // Museus e galerias
  | 'Aventura'     // Atividades radicais
  | 'Romance'      // Experiências românticas
  | 'Gastronomia'  // Experiências culinárias
  | 'Natureza'     // Ecoturismo
  | 'Cultura'      // Imersão cultural
  | 'Religioso';   // Turismo religioso
```

## ⚠️ Códigos de Erro

### Códigos HTTP
- `200` - Sucesso
- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (recurso não encontrado)
- `500` - Internal Server Error (erro do servidor)

### Códigos tRPC
```typescript
type TRPCErrorCode =
  | 'PARSE_ERROR'           // Erro de parsing JSON
  | 'BAD_REQUEST'           // Dados inválidos
  | 'UNAUTHORIZED'          // Não autenticado
  | 'FORBIDDEN'             // Sem permissão
  | 'NOT_FOUND'             // Recurso não encontrado
  | 'METHOD_NOT_SUPPORTED'  // Método não suportado
  | 'TIMEOUT'               // Timeout
  | 'CONFLICT'              // Conflito (ex: email duplicado)
  | 'PRECONDITION_FAILED'   // Pré-condição falhou
  | 'PAYLOAD_TOO_LARGE'     // Payload muito grande
  | 'UNPROCESSABLE_CONTENT' // Conteúdo não processável
  | 'TOO_MANY_REQUESTS'     // Muitas requisições
  | 'CLIENT_CLOSED_REQUEST' // Cliente fechou requisição
  | 'INTERNAL_SERVER_ERROR'; // Erro interno
```

### Estrutura de Erro
```typescript
interface TRPCError {
  code: TRPCErrorCode;
  message: string;
  data?: {
    code: string;
    httpStatus: number;
    stack?: string;
    path: string;
  };
}
```

## 💻 Exemplos de Uso

### Configuração do Cliente tRPC

```typescript
// utils/trpc.ts
import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/src/routers';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/api/trpc',
        }),
      ],
    };
  },
});
```

### Exemplo: Dashboard de Agendamentos

```typescript
// components/Dashboard.tsx
import { trpc } from '@/utils/trpc';

export function Dashboard() {
  // Carregar estatísticas
  const { data: stats, isLoading } = trpc.agendamentos.getStats.useQuery();
  
  // Carregar agendamentos pendentes
  const { data: pendentes } = trpc.agendamentos.getByStatus.useQuery({
    status: 'pendente_cliente'
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3>Total de Agendamentos</h3>
        <p className="text-2xl font-bold">{stats?.total}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3>Pendentes</h3>
        <p className="text-2xl font-bold text-yellow-600">{stats?.pendentes}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3>Confirmados</h3>
        <p className="text-2xl font-bold text-green-600">{stats?.confirmados}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3>Receita Total</h3>
        <p className="text-2xl font-bold text-blue-600">
          R$ {stats?.receita.toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  );
}
```

### Exemplo: Criar Agendamento

```typescript
// components/NovoAgendamento.tsx
import { trpc } from '@/utils/trpc';
import { useState } from 'react';

export function NovoAgendamento() {
  const [formData, setFormData] = useState({
    passeioId: '',
    clienteId: '',
    guiaId: '',
    dataPasseio: '',
    numeroPessoas: 1,
    observacoes: ''
  });

  // Carregar dados para dropdowns
  const { data: passeios } = trpc.passeios.list.useQuery();
  const { data: clientes } = trpc.clientes.list.useQuery();
  const { data: guias } = trpc.guias.listActive.useQuery();

  // Mutation para criar
  const createMutation = trpc.agendamentos.create.useMutation({
    onSuccess: () => {
      alert('Agendamento criado com sucesso!');
      // Recarregar dados
      trpc.useContext().agendamentos.list.invalidate();
    },
    onError: (error) => {
      alert(`Erro: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passeio = passeios?.find(p => p.id === formData.passeioId);
    if (!passeio) return;

    const valorTotal = passeio.preco * formData.numeroPessoas;

    createMutation.mutate({
      ...formData,
      valorTotal,
      percentualComissao: 30 // Padrão
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Passeio</label>
        <select 
          value={formData.passeioId}
          onChange={(e) => setFormData(prev => ({
            ...prev, 
            passeioId: e.target.value
          }))}
          required
        >
          <option value="">Selecione um passeio</option>
          {passeios?.map(passeio => (
            <option key={passeio.id} value={passeio.id}>
              {passeio.nome} - R$ {passeio.preco}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Cliente</label>
        <select 
          value={formData.clienteId}
          onChange={(e) => setFormData(prev => ({
            ...prev, 
            clienteId: e.target.value
          }))}
          required
        >
          <option value="">Selecione um cliente</option>
          {clientes?.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome} - {cliente.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Guia (Opcional)</label>
        <select 
          value={formData.guiaId}
          onChange={(e) => setFormData(prev => ({
            ...prev, 
            guiaId: e.target.value
          }))}
        >
          <option value="">Atribuir depois</option>
          {guias?.map(guia => (
            <option key={guia.id} value={guia.id}>
              {guia.nome} - {guia.especialidades.join(', ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Data do Passeio</label>
        <input
          type="date"
          value={formData.dataPasseio}
          onChange={(e) => setFormData(prev => ({
            ...prev, 
            dataPasseio: e.target.value
          }))}
          required
        />
      </div>

      <div>
        <label>Número de Pessoas</label>
        <input
          type="number"
          min="1"
          value={formData.numeroPessoas}
          onChange={(e) => setFormData(prev => ({
            ...prev, 
            numeroPessoas: parseInt(e.target.value)
          }))}
          required
        />
      </div>

      <div>
        <label>Observações</label>
        <textarea
          value={formData.observacoes}
          onChange={(e) => setFormData(prev => ({
            ...prev, 
            observacoes: e.target.value
          }))}
          placeholder="Observações especiais..."
        />
      </div>

      <button 
        type="submit" 
        disabled={createMutation.isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {createMutation.isLoading ? 'Criando...' : 'Criar Agendamento'}
      </button>
    </form>
  );
}
```

### Exemplo: Sistema Kanban

```typescript
// components/KanbanBoard.tsx
import { trpc } from '@/utils/trpc';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const COLUMNS = [
  { id: 'em_progresso', title: 'Em Progresso' },
  { id: 'pendente_cliente', title: 'Pendente Cliente' },
  { id: 'confirmadas', title: 'Confirmadas' },
  { id: 'concluidas', title: 'Concluídas' }
];

export function KanbanBoard() {
  // Carregar todos os agendamentos
  const { data: agendamentos, refetch } = trpc.agendamentos.list.useQuery();
  
  // Mutation para atualizar status
  const updateStatusMutation = trpc.agendamentos.updateStatus.useMutation({
    onSuccess: () => {
      refetch(); // Recarregar dados
    }
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    
    updateStatusMutation.mutate({
      id: draggableId,
      status: destination.droppableId
    });
  };

  const getAgendamentosByStatus = (status: string) => {
    return agendamentos?.filter(a => a.status === status) || [];
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto">
        {COLUMNS.map(column => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <h3 className="font-semibold mb-4">
              {column.title} ({getAgendamentosByStatus(column.id).length})
            </h3>
            
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-96 space-y-3"
                >
                  {getAgendamentosByStatus(column.id).map((agendamento, index) => (
                    <Draggable
                      key={agendamento.id}
                      draggableId={agendamento.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 rounded-lg shadow border"
                        >
                          <h4 className="font-medium">
                            {agendamento.passeio?.nome}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {agendamento.cliente?.nome}
                          </p>
                          <p className="text-sm text-gray-500">
                            {agendamento.dataPasseio} • {agendamento.numeroPessoas} pessoa(s)
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            R$ {agendamento.valorTotal.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
```

## 🔗 Webhooks

> **📅 Funcionalidade Futura**: Webhooks para notificações em tempo real estão planejados para uma versão futura.

### Eventos Planejados
- `agendamento.criado`
- `agendamento.atualizado`
- `agendamento.confirmado`
- `agendamento.concluido`
- `agendamento.cancelado`
- `cliente.cadastrado`
- `guia.cadastrado`
- `avaliacao.recebida`

---

## 📞 Suporte

Para dúvidas sobre a API:

- **GitHub Issues**: Para bugs e melhorias
- **Email**: uzualelisson@gmail.com
- **Documentação**: Sempre atualizada neste arquivo

---

<div align="center">

**[⬆ Voltar ao topo](#-documentação-da-api)**

Documentação mantida pela equipe TourGuide

</div>
