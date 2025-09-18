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
    const { firstName, lastName, email, userType, password } = await request.json();

    if (!firstName || !lastName || !email || !userType) {
      return NextResponse.json(
        { error: 'Nome, sobrenome, email e tipo de usuário são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o email já existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      );
    }

    // Combinar firstName e lastName para criar nome completo
    const nomeCompleto = `${firstName} ${lastName}`;
    
    // Gerar senha padrão se não fornecida
    const senhaUsuario = password || '123456';

    const newUser = await createUser({
      nome: nomeCompleto,
      email,
      userType,
      senha: senhaUsuario
    });

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
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}