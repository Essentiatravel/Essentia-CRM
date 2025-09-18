
import { NextRequest, NextResponse } from 'next/server';
import { validateUserPassword } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar credenciais usando hash
    const user = await validateUserPassword(email, password);

    if (!user) {
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

    // Criar sessão
    const sessionData = {
      userId: user.id,
      user: user,
      authenticated: true,
      expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
    };

    // Criar resposta com cookie de sessão
    const response = NextResponse.json({
      success: true,
      user: user
    });

    response.cookies.set('auth-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
