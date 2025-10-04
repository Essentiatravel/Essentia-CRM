import { randomUUID } from 'crypto';
import { db } from '@/lib/db';
import { clientes, users, agendamentos } from '@/lib/db/schema';
import { SUPABASE_URL, SUPABASE_SERVICE_KEY, supabaseAdmin } from '@/lib/supabase';
import { eq } from 'drizzle-orm';

interface EnsureClienteInput {
  nome: string;
  email: string;
  telefone?: string | null;
}

export interface EnsureClienteResult {
  clienteId: string;
  novoCliente: boolean;
  senhaGerada: string | null;
  cliente: typeof clientes.$inferSelect | null;
}

async function getAuthUserByEmail(email: string) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Falha ao consultar Supabase Auth:', response.status, errorText);
      return null;
    }

    const payload = await response.json();
    const usersList = Array.isArray(payload?.users)
      ? payload.users
      : Array.isArray(payload)
      ? payload
      : [];

    const authUser = usersList.find((user: any) => user?.email?.toLowerCase() === email.toLowerCase()) ?? null;
    console.log('ℹ️ Supabase Auth lookup:', authUser ? `encontrado ${authUser.id}` : 'não encontrado');
    return authUser;
  } catch (error) {
    console.error('❌ Erro ao consultar usuário no Supabase Auth:', error);
    return null;
  }
}

async function persistClienteDados(
  clienteId: string,
  {
    nome,
    email,
    telefone,
    oldClienteId,
  }: { nome: string; email: string; telefone?: string | null; oldClienteId?: string | null },
) {
  const now = new Date();

  await db
    .insert(users)
    .values({
      id: clienteId,
      email,
      nome,
      userType: 'cliente',
      telefone: telefone ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        id: clienteId,
        nome,
        userType: 'cliente',
        telefone: telefone ?? null,
        updatedAt: now,
      },
    });

  await db
    .insert(clientes)
    .values({
      id: clienteId,
      nome,
      email,
      telefone: telefone ?? null,
      status: 'ativo',
      atualizadoEm: now,
    })
    .onConflictDoUpdate({
      target: clientes.email,
      set: {
        id: clienteId,
        nome,
        telefone: telefone ?? null,
        status: 'ativo',
        atualizadoEm: now,
      },
    });

  if (oldClienteId && oldClienteId !== clienteId) {
    await db.update(agendamentos).set({ clienteId }).where(eq(agendamentos.clienteId, oldClienteId));
  }

  const clienteRegistro = await db
    .select()
    .from(clientes)
    .where(eq(clientes.id, clienteId))
    .limit(1);

  return clienteRegistro[0] ?? null;
}

export async function ensureClienteExiste({ nome, email, telefone }: EnsureClienteInput): Promise<EnsureClienteResult> {
  const existingCliente = await db
    .select()
    .from(clientes)
    .where(eq(clientes.email, email))
    .limit(1);

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !supabaseAdmin) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY ausente. Utilizando fluxo de fallback apenas com banco de dados.');

    const clienteId = existingCliente[0]?.id ?? existingUser[0]?.id ?? randomUUID();
    const clienteRegistro = await persistClienteDados(clienteId, {
      nome,
      email,
      telefone,
      oldClienteId: existingCliente[0]?.id ?? existingUser[0]?.id ?? null,
    });

    return {
      clienteId,
      novoCliente: existingCliente.length === 0,
      senhaGerada: null,
      cliente: clienteRegistro,
    };
  }

  const existingAuthUser = await getAuthUserByEmail(email);

  let clienteId: string;
  let senhaGerada: string | null = null;
  let novoCliente = false;

  if (existingAuthUser) {
    clienteId = existingAuthUser.id;
  } else {
    senhaGerada = Math.random().toString(36).slice(-10);

    const { data: createdAuth, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senhaGerada,
      email_confirm: true,
      user_metadata: {
        nome,
        userType: 'cliente',
        telefone: telefone ?? null,
      },
    });

    if (authError || !createdAuth?.user) {
      console.error('❌ Erro ao criar usuário no Supabase Auth:', authError?.message);
      throw new Error(`Erro ao criar usuário no Supabase Auth: ${authError?.message ?? 'desconhecido'}`);
    }

    clienteId = createdAuth.user.id;
    novoCliente = true;
    console.log('✅ Usuário criado no Supabase Auth:', clienteId);
  }

  const clienteRegistro = await persistClienteDados(clienteId, {
    nome,
    email,
    telefone,
    oldClienteId: existingCliente[0]?.id ?? existingUser[0]?.id ?? null,
  });

  return {
    clienteId,
    novoCliente,
    senhaGerada,
    cliente: clienteRegistro,
  };
}
