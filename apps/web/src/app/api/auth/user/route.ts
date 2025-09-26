
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '../../../../../../server/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Verificar se há cookie de autenticação
    const authCookie = request.cookies.get('auth-session');
    
    // Se não há cookie de autenticação, usuário não está logado
    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Se há cookie, retornar usuário logado (buscar do banco em produção)
    // Para desenvolvimento, retornar dados do usuário admin da base
    try {
      const adminUser = await db
        .select()
        .from(users)
        .where(eq(users.email, 'uzualelisson@gmail.com'))
        .limit(1);

      if (adminUser.length > 0) {
        const user = adminUser[0];
        return NextResponse.json({
          id: user.id,
          email: user.email,
          nome: user.nome || `${user.firstName} ${user.lastName}`,
          userType: user.userType as 'admin' | 'guia' | 'cliente',
          telefone: user.telefone,
          endereco: user.endereco,
          data_nascimento: user.dataNascimento,
          cpf: user.cpf,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });
      }
    } catch (dbError) {
      console.log('Erro na base de dados, usando fallback:', dbError);
    }

    // Fallback para usuário mock se não encontrar na base
    const mockUser = {
      id: '1',
      email: 'uzualelisson@gmail.com',
      nome: 'ELISSON UZUAL',
      userType: 'admin' as const,
      telefone: null,
      endereco: null,
      data_nascimento: null,
      cpf: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(mockUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(existingUser[0]);
    }

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        firstName,
        lastName,
      })
      .returning();

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
