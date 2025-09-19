import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Criar resposta de sucesso
    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

    // Definir cookie de logout
    response.cookies.set('auth-logout', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || process.env.REPL_ID,
      sameSite: process.env.REPL_ID ? 'none' : 'lax',
      maxAge: 60 * 60 * 24 // 24 horas
    });

    // Remover cookie de autenticação se existir
    response.cookies.delete('auth-session');

    return response;
  } catch (error) {
    console.error('Erro no logout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}