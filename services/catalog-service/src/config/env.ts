export const config = {
  port: process.env.PORT || 3004,
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: parseInt(process.env.DB_PORT || "3306"),
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "password",
  dbName: process.env.DB_NAME || "catalog_db",
};
