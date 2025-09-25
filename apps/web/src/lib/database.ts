import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

// Verificar se a variável de ambiente existe
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não está definida nas variáveis de ambiente');
}

const sql = neon(process.env.DATABASE_URL);

// Função para testar a conexão
async function testConnection() {
  try {
    await sql`SELECT 1`;
    console.log('Conexão com banco de dados estabelecida com sucesso');
  } catch (error) {
    console.error('Erro na conexão com banco de dados:', error);
    throw new Error('Falha na conexão com o banco de dados');
  }
}

export interface User {
  id: string;
  email: string;
  nome: string;
  userType: 'admin' | 'guia' | 'cliente';
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  cpf?: string;
  senha?: string;
  password_hash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createUser(userData: {
  email: string;
  nome: string;
  userType: 'admin' | 'guia' | 'cliente';
  senha: string;
  telefone?: string;
  endereco?: string;
  cpf?: string;
}): Promise<User> {
  try {
    console.log('Criando usuário com dados:', { ...userData, senha: '[HIDDEN]' });

    // Testar conexão primeiro
    await testConnection();

    const { email, nome, userType, senha, telefone, endereco, cpf } = userData;

    // Verificar se o email já existe
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;

    if (existingUser.length > 0) {
      throw new Error('Email já está em uso');
    }

    // Gerar hash da senha
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(senha, saltRounds);

    // Gerar ID único
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('Executando query de inserção...');

    const result = await sql`
      INSERT INTO users (
        id, email, nome, "userType", password_hash, telefone, endereco, cpf, "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${email}, ${nome}, ${userType}, ${password_hash}, ${telefone || null}, ${endereco || null}, ${cpf || null}, NOW(), NOW()
      ) RETURNING id, email, nome, "userType", telefone, endereco, cpf, "createdAt", "updatedAt"
    `;

    console.log('Usuário criado com sucesso:', result[0]);
    return result[0] as User;
  } catch (error) {
    console.error('Erro detalhado ao criar usuário:', error);
    
    // Verificar se é erro de conexão
    if (error instanceof Error && error.message.includes('authentication failed')) {
      throw new Error('Erro de autenticação com o banco de dados. Verifique as credenciais.');
    }
    
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;

  if (result.length === 0) {
    return null;
  }

  return result[0] as User;
}

export async function validateUserPassword(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);

  if (!user || !user.password_hash) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return null;
  }

  // Remover hash da senha do retorno
  const { password_hash, ...userWithoutHash } = user;
  return userWithoutHash as User;
}

export async function getAllUsers(): Promise<User[]> {
  const result = await sql`
    SELECT id, email, nome, "userType", telefone, endereco, cpf, "createdAt", "updatedAt"
    FROM users 
    ORDER BY "createdAt" DESC
  `;

  return result as User[];
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  try {
    const { firstName, lastName, email, userType, password, ...otherData } = userData as any;
    
    // Construir objeto de atualização
    const updateData: any = { ...otherData };
    
    if (firstName && lastName) {
      updateData.nome = `${firstName} ${lastName}`;
    }
    
    if (email) updateData.email = email;
    if (userType) updateData.userType = userType;
    
    // Se uma nova senha foi fornecida, gerar hash
    if (password) {
      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(password, saltRounds);
    }
    
    updateData.updatedAt = new Date();
    
    const result = await sql`
      UPDATE users 
      SET 
        nome = COALESCE(${updateData.nome}, nome),
        email = COALESCE(${updateData.email}, email),
        "userType" = COALESCE(${updateData.userType}, "userType"),
        password_hash = COALESCE(${updateData.password_hash}, password_hash),
        telefone = COALESCE(${updateData.telefone}, telefone),
        endereco = COALESCE(${updateData.endereco}, endereco),
        cpf = COALESCE(${updateData.cpf}, cpf),
        "updatedAt" = ${updateData.updatedAt}
      WHERE id = ${id}
      RETURNING id, email, nome, "userType", telefone, endereco, cpf, "createdAt", "updatedAt"
    `;
    
    console.log('Usuário atualizado:', result[0]);
    return result[0] as User || null;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  await sql`
    DELETE FROM users WHERE id = ${id}
  `;
}

export async function getUserStats() {
  const stats = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN "userType" = 'admin' THEN 1 END) as admins,
      COUNT(CASE WHEN "userType" = 'guia' THEN 1 END) as guias,
      COUNT(CASE WHEN "userType" = 'cliente' THEN 1 END) as clientes
    FROM users
  `;

  return {
    totalUsers: parseInt(stats[0].total),
    totalAdmins: parseInt(stats[0].admins),
    totalGuias: parseInt(stats[0].guias),
    totalClientes: parseInt(stats[0].clientes)
  };
}