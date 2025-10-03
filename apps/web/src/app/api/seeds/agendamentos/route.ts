import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/database";
import { seedAgendamentos } from "@/shared/data/seedData";

export async function POST() {
  try {
    const client = await getSupabaseClient();

    for (const agendamento of seedAgendamentos) {
      const { data: existing } = await client
        .from("agendamentos")
        .select("id")
        .eq("id", agendamento.id)
        .maybeSingle();

      if (existing) continue;

      await client.from("agendamentos").insert({
        ...agendamento,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao inserir agendamentos:", error);
    return NextResponse.json({ error: "Erro ao inserir agendamentos" }, { status: 500 });
  }
}
