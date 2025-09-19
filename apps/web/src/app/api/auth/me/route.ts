
import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Verificar se há um cookie de logout
    const logoutCookie = request.cookies.get('auth-logout');

    if (logoutCookie?.value === 'true') {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Verificar cookie de sessão
    const authCookie = request.cookies.get('auth-session');

    if (!authCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const sessionData = JSON.parse(authCookie.value);

    // Verificar se a sessão não expirou
    if (sessionData.expires_at < Math.floor(Date.now() / 1000)) {
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.delete('auth-session');
      return response;
    }

    // Buscar usuário atualizado no banco
    const user = await getUserByEmail(sessionData.user.email);

    if (!user || user.status !== 'ativo') {
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.delete('auth-session');
      return response;
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
