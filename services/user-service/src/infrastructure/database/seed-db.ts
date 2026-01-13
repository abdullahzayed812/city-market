import { Database } from "@city-market/shared";
import { config } from "../../config/env";
import { randomUUID } from "crypto";

const seedDb = async () => {
    const db = Database.getInstance({
        host: config.dbHost,
        port: config.dbPort,
        user: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
    });
    const connection = db.getPool();

    try {
        // We need to seed customers that match the auth users we seeded.
        // However, we don't have access to the exact UUIDs generated in auth-service unless we hardcode them there too.
        // For now, let's just seed some dummy customers. Ideally, we should sync or use fixed UUIDs in seed scripts.
        // Let's assume we want to seed a customer profile for the "customer@citymarket.com" user.
        // Since we can't easily know the ID from here without querying auth DB (which is another service),
        // we will just insert some standalone data for testing purposes, or maybe we can hardcode UUIDs in both services' seeds.

        // For this task, I'll just insert a sample customer with a random User ID, 
        // acknowledging that it might not link to a real Auth User unless we coordinate.
        // But wait, the schema has `user_id VARCHAR(36) UNIQUE NOT NULL`.

        const customerId = randomUUID();
        const userId = randomUUID(); // This should ideally match an auth user ID.

        await connection.execute(
            "INSERT IGNORE INTO customers (id, user_id, full_name, phone) VALUES (?, ?, ?, ?)",
            [customerId, userId, "John Doe", "+201234567890"]
        );

        await connection.execute(
            "INSERT IGNORE INTO addresses (id, customer_id, label, address, latitude, longitude, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [randomUUID(), customerId, "Home", "123 Main St, Borg El Arab", 30.9123, 29.6789, true]
        );

        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    } finally {
        await connection.end();
    }
};

seedDb();
