import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserByEmail, createUser, getAllUsers, updateUser, deleteUser } from "@/lib/database";

export async function GET() {
  try {
    const allUsers = await getAllUsers();

    // Transformar dados para o formato esperado pelo frontend
    const formattedUsers = allUsers.map(user => {
      const [firstName, ...lastNameParts] = (user.nome || '').split(' ');
      return {
        id: user.id,
        email: user.email,
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        userType: user.userType,
        telefone: user.telefone,
        endereco: user.endereco,
        cpf: user.cpf,
        status: user.status || 'ativo',
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

export async function PUT(request: NextRequest) {
  try {
    console.log('Recebendo requisição de atualização de usuário...');

    const body = await request.json();
    console.log('Dados recebidos:', { ...body, password: body.password ? '[HIDDEN]' : undefined });

    const { id, firstName, lastName, email, userType, password, telefone, endereco, cpf, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Preparar dados de atualização
    const updateData: any = {};

    if (firstName && lastName) {
      updateData.nome = `${firstName} ${lastName}`;
    }

    if (email) updateData.email = email;
    if (userType) updateData.userType = userType;
    if (password) updateData.senha = password;
    if (telefone !== undefined) updateData.telefone = telefone;
    if (endereco !== undefined) updateData.endereco = endereco;
    if (cpf !== undefined) updateData.cpf = cpf;
    if (status !== undefined) updateData.status = status;

    // Validar tipo de usuário se fornecido
    if (userType && !['admin', 'guia', 'cliente'].includes(userType)) {
      return NextResponse.json(
        { error: 'Tipo de usuário inválido' },
        { status: 400 }
      );
    }

    // Verificar se o email já existe em outro usuário
    if (email) {
      const existingUser = await getUserByEmail(email);
      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { error: 'Email já está em uso por outro usuário' },
          { status: 400 }
        );
      }
    }

    console.log('Atualizando usuário...');

    const updatedUser = await updateUser(id, updateData);

    console.log('Usuário atualizado com sucesso');

    // Remove a senha e hash do retorno
    const { senha: _, password_hash: __, ...userWithoutPassword } = updatedUser;

    // Separar nome em firstName e lastName para retorno
    const [firstName_ret, ...lastNameParts] = (updatedUser.nome || '').split(' ');

    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        firstName: firstName_ret || '',
        lastName: lastNameParts.join(' ') || '',
        userType: updatedUser.userType || updatedUser.user_type,
        createdAt: userWithoutPassword.createdAt || updatedUser.created_at,
        updatedAt: userWithoutPassword.updatedAt || updatedUser.updated_at
      }
    });

  } catch (error) {
    console.error('Erro detalhado ao atualizar usuário na API:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erro ao atualizar usuário: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('Recebendo requisição de exclusão de usuário...');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    console.log('Excluindo usuário:', id);

    await deleteUser(id);

    console.log('Usuário excluído com sucesso');

    return NextResponse.json({
      success: true,
      message: 'Usuário excluído com sucesso'
    });

  } catch (error) {
    console.error('Erro detalhado ao excluir usuário na API:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erro ao excluir usuário: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}