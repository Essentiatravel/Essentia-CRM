import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { clientes } from "../db/schema";
import { publicProcedure, router } from "../lib/trpc";

// Helper function for safe JSON parsing
function safeJsonParse<T>(value: string | unknown, fallback: T): T {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

const clienteSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  telefone: z.string().optional(),
  cpf: z.string().optional(),
  dataNascimento: z.string().optional(),
  endereco: z.object({
    rua: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    cep: z.string().optional(),
    pais: z.string().optional(),
  }).optional(),
  preferencias: z.array(z.string()).optional(),
  observacoes: z.string().optional(),
});

export const clientesRouter = router({
  // Listar todos os clientes
  list: publicProcedure.query(async () => {
    const result = await db.select().from(clientes).where(eq(clientes.status, "ativo"));
    return result.map(cliente => ({
      ...cliente,
      endereco: safeJsonParse(cliente.endereco, null),
      preferencias: safeJsonParse(cliente.preferencias, []),
    }));
  }),

  // Buscar cliente por ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await db.select().from(clientes).where(eq(clientes.id, input.id));
      if (result.length === 0) return null;
      
      const cliente = result[0];
      return {
        ...cliente,
        endereco: safeJsonParse(cliente.endereco, null),
        preferencias: safeJsonParse(cliente.preferencias, []),
      };
    }),

  // Criar novo cliente
  create: publicProcedure
    .input(clienteSchema)
    .mutation(async ({ input }) => {
      const id = crypto.randomUUID();
      const novoCliente = {
        id,
        ...input,
        endereco: input.endereco ? JSON.stringify(input.endereco) : null,
        preferencias: input.preferencias ? JSON.stringify(input.preferencias) : null,
      };

      await db.insert(clientes).values(novoCliente);
      return { id, ...input };
    }),

  // Atualizar cliente
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: clienteSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      const updateData = {
        ...input.data,
        endereco: input.data.endereco ? JSON.stringify(input.data.endereco) : undefined,
        preferencias: input.data.preferencias ? JSON.stringify(input.data.preferencias) : undefined,
        atualizadoEm: new Date(),
      };

      await db.update(clientes).set(updateData).where(eq(clientes.id, input.id));
      return { success: true };
    }),

  // Deletar cliente (soft delete)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.update(clientes).set({ 
        status: "inativo",
        atualizadoEm: new Date(),
      }).where(eq(clientes.id, input.id));
      return { success: true };
    }),

  // Buscar por email
  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const result = await db.select().from(clientes).where(eq(clientes.email, input.email));
      if (result.length === 0) return null;
      
      const cliente = result[0];
      return {
        ...cliente,
        endereco: safeJsonParse(cliente.endereco, null),
        preferencias: safeJsonParse(cliente.preferencias, []),
      };
    }),
});