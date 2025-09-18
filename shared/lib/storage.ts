// Replit Auth integration - Shared storage interface
export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<any | undefined>;
  upsertUser(user: any): Promise<any>;
  // Other operations can be added here
}