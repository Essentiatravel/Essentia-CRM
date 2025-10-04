const postgres = require('postgres');

const connectionString = 'postgresql://postgres:Essentia%402025@db.nvviwqoxeznxpzitpwua.supabase.co:5432/postgres';

console.log('🔄 Tentando conectar ao banco Supabase...');

const sql = postgres(connectionString, {
  ssl: 'require',
  connect_timeout: 10,
  max: 1,
});

async function testConnection() {
  try {
    console.log('📡 Testando conexão...');

    // Teste 1: Verificar se conecta
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log('✅ CONEXÃO BEM SUCEDIDA!');
    console.log('⏰ Hora do servidor:', result[0].current_time);
    console.log('🗄️  Versão PostgreSQL:', result[0].pg_version);

    // Teste 2: Verificar se tabela passeios existe
    console.log('\n🔍 Verificando tabela "passeios"...');
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'passeios'
      ) as exists
    `;

    if (tableExists[0].exists) {
      console.log('✅ Tabela "passeios" existe!');

      // Teste 3: Contar passeios
      const count = await sql`SELECT COUNT(*) as total FROM passeios`;
      console.log(`📊 Total de passeios no banco: ${count[0].total}`);

      if (count[0].total > 0) {
        // Teste 4: Mostrar alguns passeios
        console.log('\n📋 Primeiros 5 passeios:');
        const passeios = await sql`
          SELECT id, nome, preco, categoria, ativo
          FROM passeios
          LIMIT 5
        `;
        passeios.forEach((p, i) => {
          console.log(`${i + 1}. ${p.nome} - R$ ${p.preco} (${p.categoria}) ${p.ativo ? '✅ Ativo' : '❌ Inativo'}`);
        });
      } else {
        console.log('⚠️  Tabela existe mas está vazia!');
      }
    } else {
      console.log('❌ Tabela "passeios" NÃO existe!');
      console.log('💡 Você precisa criar a tabela primeiro.');
    }

  } catch (error) {
    console.error('❌ ERRO AO CONECTAR:', error.message);
    console.error('Código do erro:', error.code);

    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 SOLUÇÃO:');
      console.log('1. Verifique se o projeto Supabase está ATIVO em https://supabase.com/dashboard');
      console.log('2. Projetos inativos são pausados automaticamente após período sem uso');
      console.log('3. Clique em "Resume project" ou "Restore" para reativar');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 SOLUÇÃO:');
      console.log('1. A porta 5432 pode estar bloqueada por firewall');
      console.log('2. Verifique suas configurações de rede');
    } else if (error.message.includes('password')) {
      console.log('\n💡 SOLUÇÃO:');
      console.log('1. A senha pode estar incorreta');
      console.log('2. Verifique suas credenciais no Supabase Dashboard');
    }
  } finally {
    await sql.end();
    console.log('\n🔌 Conexão encerrada.');
  }
}

testConnection();
