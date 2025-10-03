import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getSupabaseClient } from "@/lib/database";
import { seedUsers } from "@/shared/data/seedData";

export async function POST(request: NextRequest) {
  try {
    const client = await getSupabaseClient();

    const results = [];
    for (const user of seedUsers) {
      const { data: existing, error: existingError } = await client
        .from("users")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (existing) {
        results.push({ email: user.email, status: "existing" });
        continue;
      }

      const passwordHash = await bcrypt.hash(user.password, 10);
      const { error } = await client.from("users").insert({
        email: user.email,
        nome: user.nome,
        userType: user.userType,
        passwordHash,
        status: "ativo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      results.push({ email: user.email, status: "created" });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Erro ao criar usuários seed:", error);
    return NextResponse.json({ error: "Erro ao criar usuários seed" }, { status: 500 });
  }
}
