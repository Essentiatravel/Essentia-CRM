import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allUsers = await db.select().from(users).orderBy(users.createdAt);
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, userType } = body;

    // Validação dos campos obrigatórios
    if (!email || !firstName || !lastName || !userType) {
      return NextResponse.json({ error: 'Campos obrigatórios: email, firstName, lastName, userType' }, { status: 400 });
    }

    // Validar tipos de usuário permitidos
    const allowedUserTypes = ['admin', 'guia', 'cliente'];
    if (!allowedUserTypes.includes(userType)) {
      return NextResponse.json({ error: 'Tipo de usuário inválido' }, { status: 400 });
    }

    // Verificar se o email já existe
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Email já está em uso' }, { status: 409 });
    }

    // Criar o usuário no banco PostgreSQL
    const userData = {
      email,
      firstName,
      lastName,
      userType,
      profileImageUrl: null,
    };

    const [newUser] = await db.insert(users).values(userData).returning();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}