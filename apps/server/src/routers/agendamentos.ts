import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { agendamentos, passeios, clientes, guias } from "../db/schema";
import { publicProcedure, router } from "../lib/trpc";

const agendamentoSchema = z.object({
  passeioId: z.string(),
  clienteId: z.string(),
  guiaId: z.string().optional(),
  dataPasseio: z.string(),
  horarioInicio: z.string().optional(),
  horarioFim: z.string().optional(),
  numeroPessoas: z.number().int().positive(),
  valorTotal: z.number().positive(),
  percentualComissao: z.number().min(0).max(100).optional(),
  observacoes: z.string().optional(),
});

export const agendamentosRouter = router({
  // Listar todos os agendamentos com dados relacionados
  list: publicProcedure.query(async () => {
    const result = await db
      .select({
        agendamento: agendamentos,
        passeio: passeios,
        cliente: clientes,
        guia: guias,
      })
      .from(agendamentos)
      .leftJoin(passeios, eq(agendamentos.passeioId, passeios.id))
      .leftJoin(clientes, eq(agendamentos.clienteId, clientes.id))
      .leftJoin(guias, eq(agendamentos.guiaId, guias.id));

    return result.map(row => ({
      ...row.agendamento,
      passeio: row.passeio,
      cliente: row.cliente,
      guia: row.guia,
    }));
  }),

  // Buscar agendamentos por status (para Kanban)
  getByStatus: publicProcedure
    .input(z.object({
      status: z.enum(["em_progresso", "pendente_cliente", "confirmadas", "concluidas", "canceladas"]),
    }))
    .query(async ({ input }) => {
      const result = await db
        .select({
          agendamento: agendamentos,
          passeio: passeios,
          cliente: clientes,
          guia: guias,
        })
        .from(agendamentos)
        .leftJoin(passeios, eq(agendamentos.passeioId, passeios.id))
        .leftJoin(clientes, eq(agendamentos.clienteId, clientes.id))
        .leftJoin(guias, eq(agendamentos.guiaId, guias.id))
        .where(eq(agendamentos.status, input.status));

      return result.map(row => ({
        ...row.agendamento,
        passeio: row.passeio,
        cliente: row.cliente,
        guia: row.guia,
      }));
    }),

  // Buscar agendamento por ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select({
          agendamento: agendamentos,
          passeio: passeios,
          cliente: clientes,
          guia: guias,
        })
        .from(agendamentos)
        .leftJoin(passeios, eq(agendamentos.passeioId, passeios.id))
        .leftJoin(clientes, eq(agendamentos.clienteId, clientes.id))
        .leftJoin(guias, eq(agendamentos.guiaId, guias.id))
        .where(eq(agendamentos.id, input.id));

      if (result.length === 0) return null;

      const row = result[0];
      return {
        ...row.agendamento,
        passeio: row.passeio,
        cliente: row.cliente,
        guia: row.guia,
      };
    }),

  // Criar novo agendamento
  create: publicProcedure
    .input(agendamentoSchema)
    .mutation(async ({ input }) => {
      const id = crypto.randomUUID();
      
      // Calcular comissão
      const valorComissao = input.valorTotal * ((input.percentualComissao || 30) / 100);
      
      const novoAgendamento = {
        id,
        ...input,
        valorComissao,
        percentualComissao: input.percentualComissao || 30,
      };

      await db.insert(agendamentos).values(novoAgendamento);
      
      // Retornar o agendamento criado com dados relacionados
      const result = await db
        .select({
          agendamento: agendamentos,
          passeio: passeios,
          cliente: clientes,
          guia: guias,
        })
        .from(agendamentos)
        .leftJoin(passeios, eq(agendamentos.passeioId, passeios.id))
        .leftJoin(clientes, eq(agendamentos.clienteId, clientes.id))
        .leftJoin(guias, eq(agendamentos.guiaId, guias.id))
        .where(eq(agendamentos.id, id));

      const row = result[0];
      return {
        ...row.agendamento,
        passeio: row.passeio,
        cliente: row.cliente,
        guia: row.guia,
      };
    }),

  // Atualizar status do agendamento (para drag & drop do Kanban)
  updateStatus: publicProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["em_progresso", "pendente_cliente", "confirmadas", "concluidas", "canceladas"]),
    }))
    .mutation(async ({ input }) => {
      await db.update(agendamentos).set({
        status: input.status,
        atualizadoEm: new Date(),
      }).where(eq(agendamentos.id, input.id));

      return { success: true };
    }),

  // Atualizar agendamento completo
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: agendamentoSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      const updateData = {
        ...input.data,
        valorComissao: input.data.valorTotal && input.data.percentualComissao 
          ? input.data.valorTotal * (input.data.percentualComissao / 100)
          : undefined,
        atualizadoEm: new Date(),
      };

      await db.update(agendamentos).set(updateData).where(eq(agendamentos.id, input.id));
      return { success: true };
    }),

  // Atribuir guia ao agendamento
  assignGuia: publicProcedure
    .input(z.object({
      id: z.string(),
      guiaId: z.string(),
    }))
    .mutation(async ({ input }) => {
      await db.update(agendamentos).set({
        guiaId: input.guiaId,
        atualizadoEm: new Date(),
      }).where(eq(agendamentos.id, input.id));

      return { success: true };
    }),

  // Cancelar agendamento
  cancel: publicProcedure
    .input(z.object({
      id: z.string(),
      motivo: z.string(),
    }))
    .mutation(async ({ input }) => {
      await db.update(agendamentos).set({
        status: "canceladas",
        motivoCancelamento: input.motivo,
        atualizadoEm: new Date(),
      }).where(eq(agendamentos.id, input.id));

      return { success: true };
    }),

  // Adicionar avaliação do cliente
  addAvaliacao: publicProcedure
    .input(z.object({
      id: z.string(),
      avaliacao: z.number().min(1).max(5),
      comentario: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await db.update(agendamentos).set({
        avaliacaoCliente: input.avaliacao,
        comentarioCliente: input.comentario,
        atualizadoEm: new Date(),
      }).where(eq(agendamentos.id, input.id));

      return { success: true };
    }),

  // Estatísticas do dashboard
  getStats: publicProcedure.query(async () => {
    const totalAgendamentos = await db.select({ count: sql`count(*)` }).from(agendamentos);
    const pendentes = await db.select({ count: sql`count(*)` }).from(agendamentos)
      .where(eq(agendamentos.status, "pendente_cliente"));
    const confirmados = await db.select({ count: sql`count(*)` }).from(agendamentos)
      .where(eq(agendamentos.status, "confirmadas"));
    const concluidos = await db.select({ count: sql`count(*)` }).from(agendamentos)
      .where(eq(agendamentos.status, "concluidas"));
    const receita = await db.select({ total: sql`sum(${agendamentos.valorTotal})` }).from(agendamentos)
      .where(eq(agendamentos.status, "concluidas"));

    return {
      total: Number(totalAgendamentos[0].count),
      pendentes: Number(pendentes[0].count),
      confirmados: Number(confirmados[0].count),
      concluidos: Number(concluidos[0].count),
      receita: Number(receita[0].total) || 0,
    };
  }),

  // Deletar agendamento
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.delete(agendamentos).where(eq(agendamentos.id, input.id));
      return { success: true };
    }),
});