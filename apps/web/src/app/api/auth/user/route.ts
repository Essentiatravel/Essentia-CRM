import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/database';

export async function GET() {
  try {
    const client = await getSupabaseClient();
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      ...user.user_metadata,
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
