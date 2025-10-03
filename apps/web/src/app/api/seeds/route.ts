import { NextResponse } from "next/server";
import { POST as seedUsers } from "./users/route";
import { POST as seedPasseios } from "./passeios/route";
import { POST as seedClientes } from "./clientes/route";
import { POST as seedGuias } from "./guias/route";
import { POST as seedAgendamentos } from "./agendamentos/route";

export async function POST() {
  try {
    await seedUsers(new Request(""));
    await seedPasseios();
    await seedClientes();
    await seedGuias();
    await seedAgendamentos();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao executar seed completo:", error);
    return NextResponse.json({ error: "Erro ao executar seed completo" }, { status: 500 });
  }
}
