// Replit Auth integration - OAuth callback route
import { NextRequest, NextResponse } from 'next/server';
import { getOidcConfig } from '../../../lib/auth';
import { storage } from '../../../lib/storage';
import * as client from 'openid-client';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const hostname = url.hostname;
    
    if (!code) {
      return NextResponse.redirect(`https://${hostname}/api/login`);
    }

    const config = await getOidcConfig();
    
    // Exchange code for tokens
    const tokenResponse = await client.authorizationCodeGrant(config, {
      code: code!,
      redirect_uri: `https://${hostname}/api/callback`,
    } as any);

    // Get user claims
    const claims = tokenResponse.claims();
    
    if (!claims) {
      throw new Error('No claims received');
    }
    
    // Upsert user in database
    await storage.upsertUser({
      id: claims.sub!,
      email: (claims.email as string) || null,
      firstName: (claims.first_name as string) || null,
      lastName: (claims.last_name as string) || null,
      profileImageUrl: (claims.profile_image_url as string) || null,
    });

    // Create user session object
    const userSession = {
      claims,
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      expires_at: claims.exp,
    };

    // Create response and set session cookie
    const response = NextResponse.redirect(`https://${hostname}/`);
    
    // Set session cookie (simplified - in production, use proper session management)
    response.cookies.set('session', JSON.stringify(userSession), {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60, // 1 week
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Callback error:', error);
    const url = new URL(request.url);
    const hostname = url.hostname;
    return NextResponse.redirect(`https://${hostname}/api/login`);
  }
}