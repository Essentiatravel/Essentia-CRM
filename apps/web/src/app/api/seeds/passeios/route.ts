import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/database";
import { seedPasseios } from "@/shared/data/seedData";

export async function POST() {
  try {
    const client = await getSupabaseClient();

    for (const passeio of seedPasseios) {
      const { data: existing } = await client
        .from("passeios")
        .select("id")
        .eq("id", passeio.id)
        .maybeSingle();

      if (existing) continue;

      await client.from("passeios").insert({
        ...passeio,
        imagens: passeio.imagens,
        inclusoes: passeio.inclusoes,
        idiomas: passeio.idiomas,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao inserir passeios:", error);
    return NextResponse.json({ error: "Erro ao inserir passeios" }, { status: 500 });
  }
}
