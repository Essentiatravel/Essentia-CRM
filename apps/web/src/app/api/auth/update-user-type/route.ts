import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Endpoint administrativo para atualizar o userType de um usuário
export async function POST(request: NextRequest) {
  try {
    const { email, userType } = await request.json();

    if (!email || !userType) {
      return NextResponse.json(
        { error: 'Email e userType são obrigatórios' },
        { status: 400 }
      );
    }

    if (!['admin', 'guia', 'cliente'].includes(userType)) {
      return NextResponse.json(
        { error: 'userType inválido. Use: admin, guia ou cliente' },
        { status: 400 }
      );
    }

    // Criar cliente admin com service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Buscar o usuário pelo email
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error('Erro ao listar usuários:', listError);
      return NextResponse.json(
        { error: 'Erro ao buscar usuário' },
        { status: 500 }
      );
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar user_metadata
    const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          userType: userType
        }
      }
    );

    if (updateError) {
      console.error('Erro ao atualizar usuário:', updateError);
      return NextResponse.json(
        { error: 'Erro ao atualizar tipo de usuário' },
        { status: 500 }
      );
    }

    console.log('✅ Usuário atualizado:', {
      email: data.user.email,
      userType: data.user.user_metadata?.userType
    });

    return NextResponse.json({
      success: true,
      message: 'Tipo de usuário atualizado com sucesso',
      user: {
        id: data.user.id,
        email: data.user.email,
        userType: data.user.user_metadata?.userType
      }
    });

  } catch (error) {
    console.error('Erro no update:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

