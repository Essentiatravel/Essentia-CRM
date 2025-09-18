import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('auth-session');

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);

    // Check if session is still valid
    const now = Math.floor(Date.now() / 1000);
    if (sessionData.expires_at && now > sessionData.expires_at) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: sessionData.user,
      authenticated: true
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}