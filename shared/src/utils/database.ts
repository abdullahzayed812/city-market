import * as mysql from "mysql2/promise";

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
  connectionLimit?: number;
}

export interface IDatabase {
  getPool(): mysql.Pool;
  close(): Promise<void>;
}

export class Database implements IDatabase {
  private static instance: Database;
  private pool: mysql.Pool;

  constructor(config: DatabaseConfig) {
    this.pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: config.connectionLimit || 10,
      queueLimit: 0,
    });
  }

  public static getInstance(config?: DatabaseConfig): Database {
    if (!Database.instance) {
      if (!config) {
        throw new Error("Database not initialized. Call getInstance with config first.");
      }
      Database.instance = new Database(config);
    }
    return Database.instance;
  }

  public getPool(): mysql.Pool {
    return this.pool;
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}
