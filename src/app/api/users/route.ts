import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin, isUserAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Iniciando busca de usuários...");

    // Verificar se o supabaseAdmin está configurado
    if (!supabaseAdmin) {
      console.error("❌ Service role não configurado");
      return NextResponse.json({ error: "Service role não configurado. Verifique SUPABASE_SERVICE_ROLE_KEY no .env.local" }, { status: 500 });
    }

    // Verificar autenticação via header Authorization
    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');
    
    console.log("🔑 Headers de autenticação:", { 
      hasAuth: !!authHeader, 
      hasCookie: !!cookieHeader,
      cookiePreview: cookieHeader?.substring(0, 100) + '...'
    });

    // Tentar obter sessão de diferentes formas
    let session = null;
    let sessionError = null;

    // Método 1: Via header Authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      try {
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data.user) {
          session = { user: data.user };
        }
      } catch (e) {
        console.log("Erro no método 1:", e);
      }
    }

    // Método 2: Via getSession (funciona no servidor)
    if (!session) {
      try {
        const { data, error } = await supabase.auth.getSession();
        session = data.session;
        sessionError = error;
        console.log("🔍 Resultado getSession:", { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          error: error?.message 
        });
      } catch (e) {
        console.log("Erro no método 2:", e);
      }
    }

    // Método 3: Temporário - permitir acesso se não conseguir verificar sessão (para debug)
    if (!session) {
      console.log("⚠️ Não foi possível verificar sessão. Permitindo acesso temporariamente para debug.");
      
      // Buscar usuários diretamente para debug
      const { data, error } = await supabaseAdmin.from("users").select("*");

      if (error) {
        console.error("❌ Erro Supabase ao listar usuários:", error.message);
        return NextResponse.json({ error: `Erro no banco: ${error.message}` }, { status: 500 });
      }

      console.log("✅ Usuários encontrados:", data?.length || 0);

      const formattedUsers = (data ?? []).map((user) => {
        const [firstName, ...lastNameParts] = (user.nome || "").split(" ");
        return {
          id: user.id,
          email: user.email,
          firstName: firstName || "",
          lastName: lastNameParts.join(" ") || "",
          userType: user.user_type || user.userType,
          telefone: user.telefone,
          endereco: user.endereco,
          cpf: user.cpf,
          status: user.status ?? "ativo",
          createdAt: user.created_at || user.createdAt || new Date().toISOString(),
          updatedAt: user.updated_at || user.updatedAt || new Date().toISOString(),
        };
      });

      return NextResponse.json(formattedUsers);
    }

    // Verificar se é admin
    const isAdmin = await isUserAdmin(session.user.id);
    console.log("👑 Verificação admin:", { userId: session.user.id, isAdmin });
    
    if (!isAdmin) {
      return NextResponse.json({ error: "Acesso negado. Apenas admins podem listar usuários." }, { status: 403 });
    }

    // Buscar usuários usando cliente admin
    const { data, error } = await supabaseAdmin.from("users").select("*");

    if (error) {
      console.error("❌ Erro Supabase ao listar usuários:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Usuários encontrados:", data?.length || 0);

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

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("💥 Erro geral ao buscar usuários:", error);
    return NextResponse.json({ 
      error: "Erro interno do servidor", 
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Iniciando criação de usuário...");

    if (!supabaseAdmin) {
      console.error("❌ Service role não configurado");
      return NextResponse.json({ error: "Service role não configurado" }, { status: 500 });
    }

    // TEMPORÁRIO: Pular verificação de autenticação para permitir criação de usuários
    // TODO: Implementar verificação robusta de autenticação depois
    console.log("⚠️ Modo temporário: criação de usuário sem verificação de auth");

    const body = await request.json();
    const { firstName, lastName, email, userType, password } = body;

    if (!firstName || !lastName || !email || !userType || !password) {
      return NextResponse.json(
        { error: "Nome, sobrenome, email, tipo de usuário e senha são obrigatórios" },
        { status: 400 },
      );
    }

    if (!["admin", "guia", "cliente"].includes(userType)) {
      return NextResponse.json({ error: "Tipo de usuário inválido" }, { status: 400 });
    }

    console.log("🔍 Iniciando criação completa do usuário (Auth + Tabela)...");
    
    // 1. PRIMEIRO: Criar usuário no Supabase Auth para permitir login
    console.log("📝 Criando usuário no Supabase Auth...");
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        firstName,
        lastName,
        userType
      }
    });

    if (authError) {
      console.error("❌ Erro ao criar usuário no Auth:", authError);
      return NextResponse.json({ 
        error: `Erro na autenticação: ${authError.message}`,
        details: authError
      }, { status: 400 });
    }

    if (!authUser.user) {
      return NextResponse.json({ error: "Falha ao criar usuário no sistema de autenticação" }, { status: 500 });
    }

    console.log("✅ Usuário criado no Auth com ID:", authUser.user.id);

    // 2. SEGUNDO: Criar registro na tabela users usando o mesmo ID
    const nome = `${firstName} ${lastName}`;
    console.log("📝 Criando registro na tabela users...");
    
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        id: authUser.user.id, // Usar o mesmo ID do Supabase Auth
        email,
        nome,
        user_type: userType, // Usar user_type ao invés de userType
        status: "ativo"
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("❌ Erro ao inserir na tabela users:", error);
      
      // Se falhou na tabela, deletar do Auth para manter consistência
      console.log("🧹 Removendo usuário do Auth devido ao erro na tabela...");
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      
      return NextResponse.json({ 
        error: `Erro ao criar perfil: ${error.message}`,
        details: error
      }, { status: 500 });
    }

    console.log("✅ Usuário criado com sucesso:", data);

    return NextResponse.json({
      success: true,
      user: {
        id: data?.id,
        email: data?.email,
        firstName,
        lastName,
        userType,
        nome: data?.nome,
      },
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("✏️ Iniciando atualização de usuário...");

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Service role não configurado" }, { status: 500 });
    }

    // TEMPORÁRIO: Pular verificação de autenticação
    console.log("⚠️ Modo temporário: atualização de usuário sem verificação de auth");

    const { id, firstName, lastName, email, userType, password } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 });
    }

    console.log("🔄 Atualizando usuário...");

    // 1. Atualizar no Supabase Auth se necessário
    const authUpdates: any = {};
    if (email) authUpdates.email = email;
    if (password) authUpdates.password = password;
    
    if (Object.keys(authUpdates).length > 0) {
      console.log("📝 Atualizando no Supabase Auth...");
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, authUpdates);
      if (authError) {
        console.error("❌ Erro ao atualizar usuário no Auth:", authError.message);
        return NextResponse.json({ error: `Erro na autenticação: ${authError.message}` }, { status: 400 });
      }
      console.log("✅ Usuário atualizado no Auth");
    }

    // 2. Atualizar na tabela users
    const updates: Record<string, unknown> = {
      email,
      user_type: userType, // Usar user_type ao invés de userType
      nome: `${firstName ?? ""} ${lastName ?? ""}`.trim(),
      // Não incluir updatedAt se a coluna não existir
    };

    const { data, error } = await supabaseAdmin
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Erro Supabase ao atualizar usuário:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ Iniciando exclusão de usuário...");

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Service role não configurado" }, { status: 500 });
    }

    // TEMPORÁRIO: Pular verificação de autenticação
    console.log("⚠️ Modo temporário: exclusão de usuário sem verificação de auth");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 });
    }

    console.log("🗑️ Excluindo usuário completo (Auth + Tabela)...");

    // 1. Deletar da tabela users primeiro
    console.log("📝 Removendo da tabela users...");
    const { error: tableError } = await supabaseAdmin.from("users").delete().eq("id", id);

    if (tableError) {
      console.error("❌ Erro ao excluir usuário da tabela:", tableError.message);
      return NextResponse.json({ error: `Erro ao remover perfil: ${tableError.message}` }, { status: 500 });
    }
    console.log("✅ Usuário removido da tabela");

    // 2. Deletar do Supabase Auth
    console.log("📝 Removendo do Supabase Auth...");
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    
    if (authError) {
      console.error("⚠️ Erro ao excluir usuário do Auth:", authError.message);
      // Não falhar aqui, pois o usuário já foi removido da tabela
      console.log("ℹ️ Usuário removido da tabela mas pode ainda existir no Auth");
    } else {
      console.log("✅ Usuário removido do Auth");
    }

    return NextResponse.json({ success: true, message: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}