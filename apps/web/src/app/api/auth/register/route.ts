import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    const { nome, email, senha, tipo, telefone, cpf, dataNascimento, endereco, especialidades, idiomas, biografia } = userData;

    if (!nome || !email || !senha || !tipo) {
      return NextResponse.json(
        { error: 'Nome, email, senha e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    if (!['admin', 'guia', 'cliente'].includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de usuário inválido' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      );
    }

    // Criar usuário
    const userId = await createUser({
      nome,
      email,
      senha, // Em produção, fazer hash da senha
      tipo,
      telefone,
      cpf,
      dataNascimento,
      endereco,
      especialidades: especialidades || [],
      idiomas: idiomas || [],
      biografia
    });

    return NextResponse.json({
      success: true,
      message: 'Usuário criado com sucesso',
      userId
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

