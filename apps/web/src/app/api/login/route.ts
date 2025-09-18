// Replit Auth integration - Login route
import { NextRequest, NextResponse } from 'next/server';
import { getOidcConfig } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const config = await getOidcConfig();
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    const authUrl = new URL((config as any).authorization_endpoint);
    authUrl.searchParams.set('client_id', process.env.REPL_ID!);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile offline_access');
    authUrl.searchParams.set('redirect_uri', `https://${hostname}/api/callback`);
    authUrl.searchParams.set('prompt', 'login consent');
    
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}