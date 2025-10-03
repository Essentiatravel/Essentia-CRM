import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/database";
import { seedClientes } from "@/shared/data/seedData";

export async function POST() {
  try {
    const client = await getSupabaseClient();

    for (const cliente of seedClientes) {
      const { data: existing } = await client
        .from("clientes")
        .select("id")
        .eq("id", cliente.id)
        .maybeSingle();

      if (existing) continue;

      await client.from("clientes").insert({
        ...cliente,
        endereco: cliente.endereco,
        preferencias: cliente.preferencias,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao inserir clientes:", error);
    return NextResponse.json({ error: "Erro ao inserir clientes" }, { status: 500 });
  }
}
