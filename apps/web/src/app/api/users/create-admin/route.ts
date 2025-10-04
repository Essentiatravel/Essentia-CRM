import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

/**
 * API para criar usuário Admin
 *
 * ⚠️ IMPORTANTE: Esta rota deve ser protegida em produção!
 * Use apenas em desenvolvimento ou proteja com autenticação de admin.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, nome } = body;

    // Validações
    if (!email || !password || !nome) {
      return NextResponse.json(
        { error: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    console.log('🔐 Criando usuário admin:', email);

    // Verificar se já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email, user_type')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      // Se já existe, atualizar para admin
      console.log('⚠️ Usuário já existe, atualizando para admin...');

      const { error: updateError } = await supabase
        .from('users')
        .update({ user_type: 'admin' })
        .eq('email', email);

      if (updateError) {
        console.error('Erro ao atualizar usuário:', updateError);
        return NextResponse.json(
          { error: 'Erro ao atualizar usuário para admin' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Usuário existente atualizado para admin',
        user: {
          email,
          nome,
          userType: 'admin',
        },
      });
    }

    // Criar usuário no Supabase Auth usando service role
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY não configurada' },
        { status: 500 }
      );
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        nome,
        userType: 'admin',
      },
    });

    if (authError) {
      console.error('Erro ao criar usuário no Supabase Auth:', authError);
      return NextResponse.json(
        { error: `Erro ao criar usuário: ${authError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Usuário criado no Supabase Auth:', authData.user.id);

    // Inserir na tabela users
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        nome,
        user_type: 'admin',
      });

    if (insertError) {
      console.error('Erro ao inserir na tabela users:', insertError);

      // Tentar deletar usuário do Auth se falhar
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

      return NextResponse.json(
        { error: `Erro ao criar perfil do usuário: ${insertError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Admin criado com sucesso!');

    return NextResponse.json({
      success: true,
      message: 'Usuário admin criado com sucesso',
      user: {
        id: authData.user.id,
        email,
        nome,
        userType: 'admin',
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar admin:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

// GET para listar todos os admins (opcional)
export async function GET() {
  try {
    const { data: admins, error } = await supabase
      .from('users')
      .select('id, email, nome, user_type, created_at')
      .eq('user_type', 'admin')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao listar admins' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      admins: admins || [],
      count: admins?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao listar admins' },
      { status: 500 }
    );
  }
}
