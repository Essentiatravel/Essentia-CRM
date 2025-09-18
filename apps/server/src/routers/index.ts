import {
  publicProcedure,
  router,
} from "../lib/trpc";
import { passeiosRouter } from "./passeios";
import { clientesRouter } from "./clientes";
import { guiasRouter } from "./guias";
import { agendamentosRouter } from "./agendamentos";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  passeios: passeiosRouter,
  clientes: clientesRouter,
  guias: guiasRouter,
  agendamentos: agendamentosRouter,
});
export type AppRouter = typeof appRouter;
