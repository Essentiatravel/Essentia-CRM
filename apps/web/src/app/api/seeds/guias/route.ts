import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/database";
import { seedGuias } from "@/shared/data/seedData";

export async function POST() {
  try {
    const client = await getSupabaseClient();

    for (const guia of seedGuias) {
      const { data: existing } = await client
        .from("guias")
        .select("id")
        .eq("id", guia.id)
        .maybeSingle();

      if (existing) continue;

      await client.from("guias").insert({
        ...guia,
        especialidades: guia.especialidades,
        idiomas: guia.idiomas,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao inserir guias:", error);
    return NextResponse.json({ error: "Erro ao inserir guias" }, { status: 500 });
  }
}
