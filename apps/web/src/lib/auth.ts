// Authentication utilities for web app
import * as client from "openid-client";
import memoize from "memoizee";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

export const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

// Helper function to validate if user is authenticated
export function isUserAuthenticated(req: any): boolean {
  const user = req.user;
  if (!user || !user.expires_at) {
    return false;
  }
  
  const now = Math.floor(Date.now() / 1000);
  return now <= user.expires_at;
}