import { NextRequest, NextResponse } from "next/server";
import { storage } from "../../../../lib/storage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get('redirect') || '/admin';

    // Simulação de usuário demo para demonstração
    const demoUser = {
      id: "demo-admin-user",
      email: "admin@turguide.com",
      firstName: "Admin",
      lastName: "User",
      profileImageUrl: null,
      userType: "admin"
    };

    // Criar ou atualizar usuário no banco
    const user = await storage.upsertUser(demoUser);

    // Create session data
    const sessionData = {
      userId: user.id,
      user: user,
      authenticated: true,
      expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
    };

    // Set session cookie
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    response.cookies.set('auth-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}