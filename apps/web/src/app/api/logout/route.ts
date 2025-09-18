// Replit Auth integration - Logout route  
import { NextRequest, NextResponse } from 'next/server';
import { getOidcConfig } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const config = await getOidcConfig();
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Clear session cookie
    const response = NextResponse.redirect(`https://${hostname}`);
    response.cookies.delete('session');
    
    // Build end session URL
    const endSessionUrl = new URL((config as any).end_session_endpoint);
    endSessionUrl.searchParams.set('client_id', process.env.REPL_ID!);
    endSessionUrl.searchParams.set('post_logout_redirect_uri', `https://${hostname}`);
    
    return NextResponse.redirect(endSessionUrl.toString());
  } catch (error) {
    console.error('Logout error:', error);
    const url = new URL(request.url);
    const hostname = url.hostname;
    return NextResponse.redirect(`https://${hostname}`);
  }
}