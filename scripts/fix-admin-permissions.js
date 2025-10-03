#!/usr/bin/env node

/**
 * Script para corrigir as permissões do usuário admin
 * 
 * Como usar:
 * 1. Configure as variáveis de ambiente no arquivo .env.local
 * 2. Execute: node scripts/fix-admin-permissions.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔧 Script de Correção de Permissões Admin\n');
  console.log('Este script vai atualizar o userType do usuário admin no Supabase.\n');

  const email = await question('Digite o email do admin (padrão: admin@turguide.com): ') || 'admin@turguide.com';
  const userType = await question('Digite o tipo de usuário (padrão: admin): ') || 'admin';

  console.log('\n📤 Enviando requisição...\n');

  try {
    const response = await fetch('http://localhost:5000/api/auth/update-user-type', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, userType })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Sucesso!\n');
      console.log('Usuário atualizado:');
      console.log(`  Email: ${data.user.email}`);
      console.log(`  UserType: ${data.user.userType}`);
      console.log('\n⚠️  IMPORTANTE: Faça logout e login novamente para aplicar as mudanças!\n');
    } else {
      console.error('❌ Erro:', data.error);
      console.log('\n💡 Dica: Certifique-se de que:');
      console.log('  - O servidor está rodando (npm run dev)');
      console.log('  - As variáveis de ambiente estão configuradas');
      console.log('  - O usuário existe no Supabase\n');
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    console.log('\n💡 Dica: Certifique-se de que o servidor está rodando (npm run dev)\n');
  }

  rl.close();
}

main().catch(console.error);

