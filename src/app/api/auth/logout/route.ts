import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/database';

export async function POST() {
  try {
    const client = await getSupabaseClient();
    const { error } = await client.auth.signOut();

    if (error) {
      console.error('Erro ao sair do Supabase:', error.message);
      return NextResponse.json({ error: 'Erro ao sair' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no logout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
