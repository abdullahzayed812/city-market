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
        const categoryId = randomUUID();
        await connection.execute(
            "INSERT IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)",
            [categoryId, "Food", "Delicious food items"]
        );

        const vendorId = randomUUID(); // Should match a vendor ID

        await connection.execute(
            "INSERT IGNORE INTO products (id, vendor_id, category_id, name, description, price, stock_quantity, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [randomUUID(), vendorId, categoryId, "Cheeseburger", "Juicy beef burger with cheese", 50.00, 100, true]
        );

        await connection.execute(
            "INSERT IGNORE INTO products (id, vendor_id, category_id, name, description, price, stock_quantity, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [randomUUID(), vendorId, categoryId, "Fries", "Crispy golden fries", 20.00, 200, true]
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
