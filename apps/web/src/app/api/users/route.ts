
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Por enquanto, retorna dados mock até o servidor estar totalmente configurado
    const mockUsers = [
      {
        id: "admin-1",
        email: "admin@turguide.com",
        firstName: "Admin",
        lastName: "Sistema",
        userType: "admin",
        profileImageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    return NextResponse.json(mockUsers);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, userType } = body;

    // Validação básica
    if (!email || !firstName || !lastName || !userType) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Simular criação de usuário (implementar com banco de dados real depois)
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      userType,
      profileImageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
