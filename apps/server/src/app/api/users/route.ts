import { NextRequest, NextResponse } from "next/server";
import { storage } from "../../../lib/storage";
import { users } from "../../../db/schema";
import { db } from "../../../db";

export async function GET(request: NextRequest) {
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
    const { email, firstName, lastName, userType, password } = body;

    // Validação básica
    if (!email || !firstName || !lastName || !userType) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Criar usuário
    const userData = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email,
      firstName,
      lastName,
      userType,
      profileImageUrl: null,
    };

    const newUser = await storage.upsertUser(userData);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);

    // Se for erro de email duplicado
    if (error instanceof Error && error.message.includes('duplicate key value')) {
      return NextResponse.json({ error: 'Email já está em uso' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}