import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

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
    SELECT id, email, nome, user_type as "userType", telefone, endereco, cpf, created_at as "createdAt", updated_at as "updatedAt"
    FROM users 
    ORDER BY created_at DESC
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
        user_type = COALESCE(${updateData.userType}, user_type),
        password_hash = COALESCE(${updateData.password_hash}, password_hash),
        telefone = COALESCE(${updateData.telefone}, telefone),
        endereco = COALESCE(${updateData.endereco}, endereco),
        cpf = COALESCE(${updateData.cpf}, cpf),
        updated_at = ${updateData.updatedAt}
      WHERE id = ${id}
      RETURNING id, email, nome, user_type as "userType", telefone, endereco, cpf, created_at as "createdAt", updated_at as "updatedAt"
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
      COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as admins,
      COUNT(CASE WHEN user_type = 'guia' THEN 1 END) as guias,
      COUNT(CASE WHEN user_type = 'cliente' THEN 1 END) as clientes
    FROM users
  `;

  return {
    totalUsers: parseInt(stats[0].total),
    totalAdmins: parseInt(stats[0].admins),
    totalGuias: parseInt(stats[0].guias),
    totalClientes: parseInt(stats[0].clientes)
  };
}

// Funções para gerenciar sessões de forma segura
export async function createSession(userId: string, userEmail: string) {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
  
  const sessionData = {
    userId,
    userEmail,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString()
  };

  await sql`
    INSERT INTO sessions (sid, sess, expire)
    VALUES (${sessionId}, ${JSON.stringify(sessionData)}, ${expiresAt})
    ON CONFLICT (sid) DO UPDATE SET
      sess = EXCLUDED.sess,
      expire = EXCLUDED.expire
  `;

  return sessionId;
}

export async function validateSession(sessionId: string) {
  if (!sessionId) {
    return null;
  }

  const result = await sql`
    SELECT * FROM sessions 
    WHERE sid = ${sessionId} AND expire > NOW()
  `;

  if (result.length === 0) {
    // Limpar sessões expiradas
    await sql`DELETE FROM sessions WHERE sid = ${sessionId}`;
    return null;
  }

  const session = result[0];
  
  // Parse do JSON da sessão
  let sessionData;
  try {
    sessionData = typeof session.sess === 'string' ? JSON.parse(session.sess) : session.sess;
  } catch (error) {
    console.error('Erro ao fazer parse da sessão:', error);
    return null;
  }
  
  return sessionData as { userId: string, userEmail: string, createdAt: string, expiresAt: string };
}

export async function deleteSession(sessionId: string) {
  await sql`DELETE FROM sessions WHERE sid = ${sessionId}`;
}

export async function getUserFromSession(sessionId: string): Promise<User | null> {
  const sessionData = await validateSession(sessionId);
  if (!sessionData) {
    return null;
  }

  return await getUserByEmail(sessionData.userEmail);
}