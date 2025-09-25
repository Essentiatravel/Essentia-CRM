
const { neon } = require('@neondatabase/serverless');

async function checkConnection() {
  try {
    console.log('Verificando variável DATABASE_URL...');
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL não encontrada nas variáveis de ambiente');
      return;
    }
    
    console.log('✅ DATABASE_URL encontrada');
    console.log('🔗 Testando conexão...');
    
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT NOW() as current_time, version() as db_version`;
    
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('📅 Hora do servidor:', result[0].current_time);
    console.log('🗄️ Versão do banco:', result[0].db_version);
    
    // Verificar se a tabela users existe
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `;
    
    if (tables.length > 0) {
      console.log('✅ Tabela users encontrada');
      
      // Contar usuários
      const userCount = await sql`SELECT COUNT(*) as total FROM users`;
      console.log(`👥 Total de usuários: ${userCount[0].total}`);
    } else {
      console.log('❌ Tabela users não encontrada');
    }
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('🔑 Erro de autenticação - verifique as credenciais do banco');
    }
  }
}

checkConnection();
