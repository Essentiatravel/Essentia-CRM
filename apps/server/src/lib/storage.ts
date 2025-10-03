// Replit Auth integration - Database storage implementation
import {
  users,
  type User,
  type UpsertUser,
} from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  // Other operations can be added here
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Primeiro, verifica se usuário já existe pelo email
    const existingUser = await db.select().from(users).where(eq(users.email, userData.email || '')).limit(1);

    if (existingUser.length > 0) {
      // Atualiza o usuário existente
      const [user] = await db
        .update(users)
        .set({
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          userType: userData.userType,
          updatedAt: new Date(),
        })
        .where(eq(users.email, userData.email))
        .returning();
      return user;
    } else {
      // Cria novo usuário
      const [user] = await db
        .insert(users)
        .values(userData)
        .returning();
      return user;
    }
  }

  // Other operations for the tourism business logic
  // These can be added as needed
}

export const storage = new DatabaseStorage();