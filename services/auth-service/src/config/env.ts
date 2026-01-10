export const config = {
  port: process.env.PORT || 3001,
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: parseInt(process.env.DB_PORT || "3306"),
  dbUser: process.env.DB_USER || "abdo",
  dbPassword: process.env.DB_PASSWORD || "password",
  dbName: process.env.DB_NAME || "auth_db",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "access_secret_key",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "refresh_secret_key",
  jwtAccessExpiry: "15m",
  jwtRefreshExpiry: "7d",
};
