import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const res = NextResponse.next()

  // CORS headers
  res.headers.append('Access-Control-Allow-Credentials', "true")
  res.headers.append('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || request.headers.get('origin') || "*")
  res.headers.append('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE')
  res.headers.append(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Cookie'
  )

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: res.headers });
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
