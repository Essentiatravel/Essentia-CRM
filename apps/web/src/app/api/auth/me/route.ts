import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("sb-access-token")?.value;
    const refreshToken = request.cookies.get("sb-refresh-token")?.value;

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const client = await getSupabaseClient();
    const {
      data: { user },
      error,
    } = await client.auth.getUser(accessToken);

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        ...user.user_metadata,
      },
    });
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
