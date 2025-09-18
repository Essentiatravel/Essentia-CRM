import { NextResponse } from 'next/server';
import { getAllPasseios, createPasseio } from '@/lib/database';

export async function GET() {
  try {
    const passeios = await getAllPasseios();
    return NextResponse.json(passeios);
  } catch (error) {
    console.error('Erro ao buscar passeios:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const passeioData = await request.json();
    const id = await createPasseio(passeioData);
    return NextResponse.json({ id, message: 'Passeio criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar passeio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}



