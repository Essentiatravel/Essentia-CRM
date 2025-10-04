import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// API temporária de debug para listar usuários sem verificação de auth
export async function GET() {
  try {
    console.log("🐛 DEBUG: Tentando buscar usuários...");

    if (!supabaseAdmin) {
      console.error("❌ supabaseAdmin não configurado");
      return NextResponse.json({ 
        error: "Service role não configurado",
        debug: {
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configurado" : "❌ Não configurado"
        }
      }, { status: 500 });
    }

    // Tentar buscar usuários diretamente
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("❌ Erro na consulta:", error);
      return NextResponse.json({ 
        error: error.message,
        debug: {
          code: error.code,
          details: error.details,
          hint: error.hint,
          message: error.message
        }
      }, { status: 500 });
    }

    console.log(`✅ Encontrados ${data?.length || 0} usuários`);

    // Formatear os dados
    const formattedUsers = (data ?? []).map((user) => {
      const [firstName, ...lastNameParts] = (user.nome || "").split(" ");
      return {
        id: user.id,
        email: user.email,
        firstName: firstName || "",
        lastName: lastNameParts.join(" ") || "",
        userType: user.user_type || user.userType, // Aceitar ambos os nomes
        telefone: user.telefone,
        endereco: user.endereco,
        cpf: user.cpf,
        status: user.status ?? "ativo",
        createdAt: user.created_at || user.createdAt || new Date().toISOString(),
        updatedAt: user.updated_at || user.updatedAt || new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
      debug: {
        rawCount: data?.length,
        serviceKeyConfigured: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });

  } catch (error) {
    console.error("💥 Erro geral:", error);
    return NextResponse.json({ 
      error: "Erro interno",
      message: error instanceof Error ? error.message : "Erro desconhecido",
      debug: {
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
}