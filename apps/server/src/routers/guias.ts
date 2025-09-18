import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { guias } from "../db/schema";
import { publicProcedure, router } from "../lib/trpc";

const guiaSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  telefone: z.string().optional(),
  cpf: z.string().optional(),
  especialidades: z.array(z.string()).min(1),
  idiomas: z.array(z.string()).min(1),
  percentualComissao: z.number().min(0).max(100).optional(),
  biografia: z.string().optional(),
  foto: z.string().url().optional(),
});

export const guiasRouter = router({
  // Listar todos os guias
  list: publicProcedure.query(async () => {
    const result = await db.select().from(guias);
    return result.map(guia => ({
      ...guia,
      especialidades: guia.especialidades ? JSON.parse(guia.especialidades) : [],
      idiomas: guia.idiomas ? JSON.parse(guia.idiomas) : [],
    }));
  }),

  // Listar apenas guias ativos
  listActive: publicProcedure.query(async () => {
    const result = await db.select().from(guias).where(eq(guias.status, "ativo"));
    return result.map(guia => ({
      ...guia,
      especialidades: guia.especialidades ? JSON.parse(guia.especialidades) : [],
      idiomas: guia.idiomas ? JSON.parse(guia.idiomas) : [],
    }));
  }),

  // Buscar guia por ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await db.select().from(guias).where(eq(guias.id, input.id));
      if (result.length === 0) return null;
      
      const guia = result[0];
      return {
        ...guia,
        especialidades: guia.especialidades ? JSON.parse(guia.especialidades) : [],
        idiomas: guia.idiomas ? JSON.parse(guia.idiomas) : [],
      };
    }),

  // Criar novo guia
  create: publicProcedure
    .input(guiaSchema)
    .mutation(async ({ input }) => {
      const id = crypto.randomUUID();
      const novoGuia = {
        id,
        ...input,
        especialidades: JSON.stringify(input.especialidades),
        idiomas: JSON.stringify(input.idiomas),
        dataRegistro: new Date().toISOString(),
      };

      await db.insert(guias).values(novoGuia);
      return { id, ...input };
    }),

  // Atualizar guia
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: guiaSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      const updateData = {
        ...input.data,
        especialidades: input.data.especialidades ? JSON.stringify(input.data.especialidades) : undefined,
        idiomas: input.data.idiomas ? JSON.stringify(input.data.idiomas) : undefined,
        atualizadoEm: new Date().toISOString(),
      };

      await db.update(guias).set(updateData).where(eq(guias.id, input.id));
      return { success: true };
    }),

  // Atualizar status do guia
  updateStatus: publicProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["ativo", "inativo", "pendente"]),
    }))
    .mutation(async ({ input }) => {
      await db.update(guias).set({ 
        status: input.status,
        atualizadoEm: new Date().toISOString(),
      }).where(eq(guias.id, input.id));
      return { success: true };
    }),

  // Atualizar estatísticas do guia (após passeio concluído)
  updateStats: publicProcedure
    .input(z.object({
      id: z.string(),
      avaliacaoNova: z.number().min(1).max(5),
      comissaoNova: z.number(),
    }))
    .mutation(async ({ input }) => {
      const guia = await db.select().from(guias).where(eq(guias.id, input.id));
      if (guia.length === 0) throw new Error("Guia não encontrado");

      const guiaAtual = guia[0];
      const totalAvaliacoesAtual = guiaAtual.totalAvaliacoes || 0;
      const avaliacaoMediaAtual = guiaAtual.avaliacaoMedia || 0;
      const totalAvaliacoes = totalAvaliacoesAtual + 1;
      const avaliacaoMedia = ((avaliacaoMediaAtual * totalAvaliacoesAtual) + input.avaliacaoNova) / totalAvaliacoes;
      
      await db.update(guias).set({
        avaliacaoMedia: Number(avaliacaoMedia.toFixed(1)),
        totalAvaliacoes,
        passeiosRealizados: (guiaAtual.passeiosRealizados || 0) + 1,
        comissaoTotal: (guiaAtual.comissaoTotal || 0) + input.comissaoNova,
        atualizadoEm: new Date().toISOString(),
      }).where(eq(guias.id, input.id));

      return { success: true };
    }),

  // Deletar guia (soft delete)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.update(guias).set({ 
        status: "inativo",
        atualizadoEm: new Date().toISOString(),
      }).where(eq(guias.id, input.id));
      return { success: true };
    }),
});