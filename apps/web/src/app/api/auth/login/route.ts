import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verificação simples de senha (em produção, usar hash)
    if (user.senha !== senha) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    if (user.status !== 'ativo') {
      return NextResponse.json(
        { error: 'Conta inativa' },
        { status: 403 }
      );
    }

    // Retornar dados do usuário (sem a senha)
    const { senha: _, ...userData } = user;
    
    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

