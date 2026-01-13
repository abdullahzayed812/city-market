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
        const vendorId = randomUUID();
        const userId = randomUUID(); // Should match an auth user ID

        await connection.execute(
            "INSERT IGNORE INTO vendors (id, user_id, shop_name, shop_description, phone, address, status, commission_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [vendorId, userId, "Best Burger", "Delicious burgers and fries", "+201000000001", "456 Food St, Borg El Arab", "OPEN", 10.00]
        );

        // Working hours (Mon-Sun: 9AM - 10PM)
        for (let day = 0; day < 7; day++) {
            await connection.execute(
                "INSERT IGNORE INTO working_hours (id, vendor_id, day_of_week, open_time, close_time, is_open) VALUES (?, ?, ?, ?, ?, ?)",
                [randomUUID(), vendorId, day, "09:00:00", "22:00:00", true]
            );
        }

        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    } finally {
        await connection.end();
    }
};

seedDb();
