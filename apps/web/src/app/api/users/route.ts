import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserByEmail, createUser, getAllUsers } from "@/lib/database";

export async function GET() {
  try {
    const allUsers = await getAllUsers();
    
    // Transformar dados para o formato esperado pelo frontend
    const formattedUsers = allUsers.map(user => {
      const [firstName, ...lastNameParts] = user.nome.split(' ');
      return {
        id: user.id,
        email: user.email,
        firstName: firstName,
        lastName: lastNameParts.join(' ') || '',
        userType: user.userType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    });
    
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Recebendo requisição de criação de usuário...');
    
    const body = await request.json();
    console.log('Dados recebidos:', { ...body, password: '[HIDDEN]' });
    
    const { firstName, lastName, email, userType, password } = body;

    // Validação mais robusta
    if (!firstName || !lastName || !email || !userType || !password) {
      console.log('Campos obrigatórios faltando:', { firstName: !!firstName, lastName: !!lastName, email: !!email, userType: !!userType, password: !!password });
      return NextResponse.json(
        { error: 'Nome, sobrenome, email, tipo de usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar tipo de usuário
    if (!['admin', 'guia', 'cliente'].includes(userType)) {
      return NextResponse.json(
        { error: 'Tipo de usuário inválido' },
        { status: 400 }
      );
    }

    console.log('Verificando se email já existe...');
    
    // Verificar se o email já existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('Email já existe:', email);
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      );
    }

    // Combinar firstName e lastName para criar nome completo
    const nomeCompleto = `${firstName} ${lastName}`;
    
    console.log('Criando usuário...');

    const newUser = await createUser({
      nome: nomeCompleto,
      email,
      userType,
      senha: password
    });

    console.log('Usuário criado com sucesso');

    // Remove a senha e hash do retorno
    const { senha: _, password_hash: __, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        firstName,
        lastName,
        createdAt: userWithoutPassword.createdAt || new Date().toISOString(),
        updatedAt: userWithoutPassword.updatedAt || new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erro detalhado ao criar usuário na API:', error);
    
    // Retornar erro mais específico quando possível
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erro ao criar usuário: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}