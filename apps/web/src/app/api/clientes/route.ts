import { NextResponse } from 'next/server';
import { getAllClientes, searchClientes, createCliente } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let clientes;
    if (search) {
      clientes = await searchClientes(search);
    } else {
      clientes = await getAllClientes();
    }

    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const clienteData = await request.json();
    const id = await createCliente(clienteData);
    return NextResponse.json({ id, message: 'Cliente criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}



