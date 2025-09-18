import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function checkUsers() {
  try {
    console.log("Verificando usuários no banco...");

    // Buscar todos os usuários
    const allUsers = await db.select().from(users);
    console.log("Total de usuários:", allUsers.length);

    // Buscar usuário admin específico
    const adminUser = await db.select().from(users).where(eq(users.email, "admin@turguide.com"));
    console.log("Usuário admin encontrado:", adminUser.length > 0 ? adminUser[0] : "Nenhum");

    // Buscar usuários com emails duplicados
    const usersByEmail = allUsers.reduce((acc, user) => {
      if (!acc[user.email]) acc[user.email] = [];
      acc[user.email].push(user);
      return acc;
    }, {} as Record<string, typeof allUsers>);

    Object.entries(usersByEmail).forEach(([email, usersWithEmail]) => {
      if (usersWithEmail.length > 1) {
        console.log(`Email duplicado: ${email} - ${usersWithEmail.length} usuários`);
        usersWithEmail.forEach(u => console.log(`  - ID: ${u.id}, Nome: ${u.firstName} ${u.lastName}`));
      }
    });

  } catch (error) {
    console.error("Erro ao verificar usuários:", error);
  }
}

checkUsers();