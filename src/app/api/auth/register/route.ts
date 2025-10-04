import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { nome, email, senha, tipo } = await request.json();

    if (!nome || !email || !senha || !tipo) {
      return NextResponse.json(
        { error: "Nome, email, senha e tipo são obrigatórios" },
        { status: 400 },
      );
    }

    if (!["admin", "guia", "cliente"].includes(tipo)) {
      return NextResponse.json({ error: "Tipo de usuário inválido" }, { status: 400 });
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome,
          userType: tipo,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Usuário criado com sucesso",
      userId: data?.user?.id,
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

