import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (!db) {
    // Ajustar o caminho para o banco de dados
    const dbPath = path.join(process.cwd(), '..', '..', 'tmp', 'turguide.db');
    console.log('Caminho do banco:', dbPath);
    
    try {
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });
      console.log('Banco conectado com sucesso');
    } catch (error) {
      console.error('Erro ao conectar com o banco:', error);
      throw error;
    }
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}

// Funções utilitárias para consultas comuns
export async function getAllPasseios() {
  const database = await getDatabase();
  return await database.all(`
    SELECT * FROM passeios 
    WHERE ativo = 1 
    ORDER BY nome
  `);
}

export async function getAllGuias() {
  const database = await getDatabase();
  return await database.all(`
    SELECT * FROM guias 
    WHERE status = 'ativo' 
    ORDER BY nome
  `);
}

export async function getAllClientes() {
  const database = await getDatabase();
  return await database.all(`
    SELECT * FROM clientes 
    WHERE status = 'ativo' 
    ORDER BY nome
  `);
}

export async function getAllAgendamentos() {
  const database = await getDatabase();
  return await database.all(`
    SELECT 
      a.*,
      p.nome as passeio_nome,
      c.nome as cliente_nome,
      g.nome as guia_nome
    FROM agendamentos a
    LEFT JOIN passeios p ON a.passeio_id = p.id
    LEFT JOIN clientes c ON a.cliente_id = c.id
    LEFT JOIN guias g ON a.guia_id = g.id
    ORDER BY a.data_passeio DESC
  `);
}

export async function getAgendamentosByStatus(status: string) {
  const database = await getDatabase();
  return await database.all(`
    SELECT 
      a.*,
      p.nome as passeio_nome,
      c.nome as cliente_nome,
      g.nome as guia_nome
    FROM agendamentos a
    LEFT JOIN passeios p ON a.passeio_id = p.id
    LEFT JOIN clientes c ON a.cliente_id = c.id
    LEFT JOIN guias g ON a.guia_id = g.id
    WHERE a.status = ?
    ORDER BY a.data_passeio DESC
  `, [status]);
}

export async function getDashboardStats() {
  const database = await getDatabase();
  
  const [
    totalClientes,
    totalGuias,
    totalPasseios,
    agendamentosHoje,
    agendamentosMes,
    receitaMes
  ] = await Promise.all([
    database.get('SELECT COUNT(*) as count FROM clientes WHERE status = "ativo"'),
    database.get('SELECT COUNT(*) as count FROM guias WHERE status = "ativo"'),
    database.get('SELECT COUNT(*) as count FROM passeios WHERE ativo = 1'),
    database.get(`
      SELECT COUNT(*) as count FROM agendamentos 
      WHERE DATE(data_passeio) = DATE("now")
    `),
    database.get(`
      SELECT COUNT(*) as count FROM agendamentos 
      WHERE strftime("%Y-%m", data_passeio) = strftime("%Y-%m", "now")
    `),
    database.get(`
      SELECT COALESCE(SUM(valor_total), 0) as total FROM agendamentos 
      WHERE strftime("%Y-%m", data_passeio) = strftime("%Y-%m", "now")
      AND status = "concluido"
    `)
  ]);

  return {
    totalClientes: totalClientes?.count || 0,
    totalGuias: totalGuias?.count || 0,
    totalPasseios: totalPasseios?.count || 0,
    agendamentosHoje: agendamentosHoje?.count || 0,
    agendamentosMes: agendamentosMes?.count || 0,
    receitaMes: receitaMes?.total || 0
  };
}

export async function searchClientes(searchTerm: string) {
  const database = await getDatabase();
  return await database.all(`
    SELECT * FROM clientes 
    WHERE (nome LIKE ? OR email LIKE ? OR telefone LIKE ?)
    AND status = 'ativo'
    ORDER BY nome
  `, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
}

export async function getClienteById(id: string) {
  const database = await getDatabase();
  return await database.get('SELECT * FROM clientes WHERE id = ?', [id]);
}

export async function getGuiaById(id: string) {
  const database = await getDatabase();
  return await database.get('SELECT * FROM guias WHERE id = ?', [id]);
}

export async function getPasseioById(id: string) {
  const database = await getDatabase();
  return await database.get('SELECT * FROM passeios WHERE id = ?', [id]);
}

export async function getAgendamentoById(id: string) {
  const database = await getDatabase();
  return await database.get(`
    SELECT 
      a.*,
      p.nome as passeio_nome,
      c.nome as cliente_nome,
      g.nome as guia_nome
    FROM agendamentos a
    LEFT JOIN passeios p ON a.passeio_id = p.id
    LEFT JOIN clientes c ON a.cliente_id = c.id
    LEFT JOIN guias g ON a.guia_id = g.id
    WHERE a.id = ?
  `, [id]);
}

// Funções para inserir/atualizar dados
export async function createPasseio(passeioData: any) {
  const database = await getDatabase();
  const id = `passeio-${Date.now()}`;
  
  await database.run(`
    INSERT INTO passeios (
      id, nome, descricao, preco, duracao, categoria, 
      imagens, inclusoes, idiomas, capacidade_maxima, ativo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    passeioData.name,
    passeioData.description,
    passeioData.price,
    `${passeioData.duration}h`,
    passeioData.type,
    JSON.stringify(passeioData.images || []),
    JSON.stringify(passeioData.includedItems || []),
    JSON.stringify(passeioData.languages || []),
    passeioData.maxPeople || 20,
    1
  ]);
  
  return id;
}

export async function createCliente(clienteData: any) {
  const database = await getDatabase();
  const id = `cliente-${Date.now()}`;
  
  await database.run(`
    INSERT INTO clientes (
      id, nome, email, telefone, cpf, data_nascimento,
      endereco, preferencias, observacoes, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    clienteData.name,
    clienteData.email,
    clienteData.phone,
    clienteData.cpf,
    clienteData.birthDate,
    clienteData.address,
    JSON.stringify(clienteData.interests || []),
    clienteData.observations,
    'ativo'
  ]);
  
  return id;
}

export async function createAgendamento(agendamentoData: any) {
  const database = await getDatabase();
  const id = `agend-${Date.now()}`;
  
  await database.run(`
    INSERT INTO agendamentos (
      id, passeio_id, cliente_id, guia_id, data_passeio,
      horario_inicio, horario_fim, numero_pessoas, valor_total,
      valor_comissao, percentual_comissao, status, observacoes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    agendamentoData.passeioId,
    agendamentoData.clienteId,
    agendamentoData.guiaId,
    agendamentoData.dataPasseio,
    agendamentoData.horarioInicio,
    agendamentoData.horarioFim,
    agendamentoData.numeroPessoas,
    agendamentoData.valorTotal,
    agendamentoData.valorComissao,
    agendamentoData.percentualComissao || 30,
    agendamentoData.status || 'pendente',
    agendamentoData.observacoes
  ]);
  
  return id;
}

// Funções de autenticação
export async function getUserByEmail(email: string) {
  const database = await getDatabase();
  return await database.get('SELECT * FROM usuarios WHERE email = ?', [email]);
}

export async function getUserById(id: string) {
  const database = await getDatabase();
  return await database.get('SELECT * FROM usuarios WHERE id = ?', [id]);
}

export async function createUser(userData: any) {
  const database = await getDatabase();
  const id = `user-${Date.now()}`;
  
  await database.run(`
    INSERT INTO usuarios (
      id, nome, email, senha, tipo, telefone, cpf, data_nascimento,
      endereco, especialidades, idiomas, biografia, foto, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    userData.nome,
    userData.email,
    userData.senha,
    userData.tipo,
    userData.telefone,
    userData.cpf,
    userData.dataNascimento,
    userData.endereco,
    JSON.stringify(userData.especialidades || []),
    JSON.stringify(userData.idiomas || []),
    userData.biografia,
    userData.foto,
    'ativo'
  ]);
  
  return id;
}

export async function updateUser(id: string, userData: any) {
  const database = await getDatabase();
  
  await database.run(`
    UPDATE usuarios SET
      nome = ?, telefone = ?, cpf = ?, data_nascimento = ?,
      endereco = ?, especialidades = ?, idiomas = ?, biografia = ?,
      foto = ?, atualizado_em = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    userData.nome,
    userData.telefone,
    userData.cpf,
    userData.dataNascimento,
    userData.endereco,
    JSON.stringify(userData.especialidades || []),
    JSON.stringify(userData.idiomas || []),
    userData.biografia,
    userData.foto,
    id
  ]);
  
  return id;
}

// Funções específicas para guias
export async function getGuiaStats(guiaId: string) {
  const database = await getDatabase();
  
  const [
    totalAgendamentos,
    agendamentosMes,
    receitaMes,
    avaliacaoMedia,
    totalAvaliacoes
  ] = await Promise.all([
    database.get(`
      SELECT COUNT(*) as count FROM agendamentos 
      WHERE guia_id = ? AND status = 'concluido'
    `, [guiaId]),
    database.get(`
      SELECT COUNT(*) as count FROM agendamentos 
      WHERE guia_id = ? AND strftime("%Y-%m", data_passeio) = strftime("%Y-%m", "now")
    `, [guiaId]),
    database.get(`
      SELECT COALESCE(SUM(valor_comissao), 0) as total FROM agendamentos 
      WHERE guia_id = ? AND strftime("%Y-%m", data_passeio) = strftime("%Y-%m", "now")
      AND status = 'concluido'
    `, [guiaId]),
    database.get(`
      SELECT AVG(nota) as media FROM avaliacoes 
      WHERE guia_id = ?
    `, [guiaId]),
    database.get(`
      SELECT COUNT(*) as count FROM avaliacoes 
      WHERE guia_id = ?
    `, [guiaId])
  ]);

  return {
    totalAgendamentos: totalAgendamentos?.count || 0,
    agendamentosMes: agendamentosMes?.count || 0,
    receitaMes: receitaMes?.total || 0,
    avaliacaoMedia: avaliacaoMedia?.media || 0,
    totalAvaliacoes: totalAvaliacoes?.count || 0
  };
}

export async function getAgendamentosByGuia(guiaId: string, status?: string) {
  const database = await getDatabase();
  
  let query = `
    SELECT 
      a.*,
      p.nome as passeio_nome,
      c.nome as cliente_nome,
      c.telefone as cliente_telefone
    FROM agendamentos a
    LEFT JOIN passeios p ON a.passeio_id = p.id
    LEFT JOIN clientes c ON a.cliente_id = c.id
    WHERE a.guia_id = ?
  `;
  
  const params = [guiaId];
  
  if (status) {
    query += ' AND a.status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY a.data_passeio DESC';
  
  return await database.all(query, params);
}
