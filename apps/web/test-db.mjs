import postgres from "postgres";

const connectionString = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ SUPABASE_DB_URL não está definida!");
  process.exit(1);
}

const client = postgres(connectionString, {
  ssl: "require",
  max: 5,
});

async function testConnection() {
  try {
    console.log("🔄 Testando conexão com o banco de dados...");

    // Verificar se a tabela passeios existe
    const tables = await client`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'passeios'
    `;

    console.log("\n📊 Tabelas encontradas:", tables);

    if (tables.length === 0) {
      console.log("\n⚠️ A tabela 'passeios' NÃO EXISTE no banco de dados!");
      console.log("Execute o script SETUP_SUPABASE.sql no SQL Editor do Supabase");
    } else {
      console.log("\n✅ A tabela 'passeios' existe!");

      // Buscar passeios
      const passeios = await client`SELECT * FROM passeios LIMIT 5`;

      console.log(`\n🎯 ${passeios.length} passeios encontrados (limitado a 5):\n`);
      passeios.forEach((p, idx) => {
        console.log(`${idx + 1}. ${p.nome} - R$ ${p.preco} (${p.categoria})`);
      });

      // Contar total de passeios
      const resultado = await client`SELECT COUNT(*) as count FROM passeios`;
      const count = resultado[0].count;
      console.log(`\n📈 Total de passeios no banco: ${count}`);
    }

  } catch (error) {
    console.error("\n❌ Erro ao conectar ao banco de dados:");
    console.error(error);
  } finally {
    await client.end();
  }
}

testConnection();
