// Replit Auth integration - Authentication utilities for Next.js
import * as client from "openid-client";
import memoize from "memoizee";

// Get environment variables with fallbacks
const REPLIT_DOMAINS = process.env.REPLIT_DOMAINS || process.env.REPL_SLUG + ".replit.dev";
// Extract REPL_ID from REPLIT_DOMAINS (format: ca1e0a11-112d-477e-97e5-05e12af4e6ed-00-38w7t5ktvvd3s.spock.replit.dev)
const REPL_ID = process.env.REPL_ID ||
               (REPLIT_DOMAINS ? REPLIT_DOMAINS.split('.')[0].split('-').slice(0, 5).join('-') : '') ||
               process.env.REPL_SLUG;

export const getOidcConfig = memoize(
  async () => {
    console.log('REPL_ID:', REPL_ID);
    console.log('REPLIT_DOMAINS:', REPLIT_DOMAINS);

    const issuer = await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc")
    );

    const clientConfig = new client.Configuration({
      client_id: REPL_ID!,
      issuer,
    });

    return clientConfig;
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