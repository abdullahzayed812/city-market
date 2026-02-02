export const config = {
  port: process.env.PORT || 3006,
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: parseInt(process.env.DB_PORT || "3306"),
  dbUser: process.env.DB_USER || "abdo",
  dbPassword: process.env.DB_PASSWORD || "password",
  dbName: process.env.DB_NAME || "delivery_db",
  orderServiceUrl: process.env.ORDER_SERVICE_URL || "http://localhost:3005",
  vendorServiceUrl: process.env.VENDOR_SERVICE_URL || "http://localhost:3003",
};
