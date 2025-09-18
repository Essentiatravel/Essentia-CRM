// Replit Auth integration - Get current user route
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../lib/storage';
import { getOidcConfig } from '../../../../lib/auth';
import * as client from 'openid-client';

async function getUserFromSession(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value);
    const now = Math.floor(Date.now() / 1000);
    
    // Check if token is still valid
    if (session.expires_at && now <= session.expires_at) {
      // Token is still valid, get user from database
      const user = await storage.getUser(session.claims.sub);
      return user;
    }

    // Try to refresh token if available
    if (session.refresh_token) {
      const config = await getOidcConfig();
      const tokenResponse = await client.refreshTokenGrant(config, session.refresh_token);
      
      // Update session with new tokens (would need proper session storage in production)
      const updatedSession = {
        ...session,
        access_token: tokenResponse.access_token,
        expires_at: tokenResponse.claims()?.exp,
      };
      
      const user = await storage.getUser(session.claims.sub);
      return user;
    }

    return null;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}