import { NextRequest, NextResponse } from "next/server";
import { getOidcConfig, updateUserSession } from "../../../../lib/auth";
import { storage } from "../../../../lib/storage";
import * as client from "openid-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
    }

    const config = await getOidcConfig();

    // Exchange code for tokens
    const host = request.headers.get('host') || process.env.REPLIT_DOMAINS;
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    const tokens = await client.authorizationCodeGrant(config, {
      code,
      redirect_uri: redirectUri,
    });

    const claims = tokens.claims();

    // Create or update user in database
    const userData = {
      id: claims.sub!,
      email: claims.email,
      firstName: claims.given_name,
      lastName: claims.family_name,
      profileImageUrl: claims.picture,
    };

    const user = await storage.upsertUser(userData);

    // Create session data
    const sessionData = {
      userId: user.id,
      user: user,
      claims: claims,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: claims.exp,
    };

    // Parse redirect URL from state
    let redirectUrl = '/admin';
    try {
      if (state) {
        const stateData = JSON.parse(decodeURIComponent(state));
        redirectUrl = stateData.redirect || '/admin';
      }
    } catch (e) {
      console.warn('Failed to parse state:', e);
    }

    // Set session cookie (you might want to use a proper session store)
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
    console.error('Auth callback error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}