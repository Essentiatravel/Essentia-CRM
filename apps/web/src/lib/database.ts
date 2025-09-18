
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

const sql = neon(process.env.DATABASE_URL!);

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
    
    const { email, nome, userType, senha, telefone, endereco, cpf } = userData;
    
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
      ) RETURNING *
    `;
    
    console.log('Usuário criado com sucesso:', result[0]);
    return result[0] as User;
  } catch (error) {
    console.error('Erro detalhado ao criar usuário:', error);
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
