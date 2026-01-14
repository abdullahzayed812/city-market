import { Pool, RowDataPacket } from "mysql2/promise";
import { OrderItem } from "../../core/entities/order-item.entity";
import { IOrderItemRepository } from "../../core/interfaces/order-item.repository";
import { Database } from "@city-market/shared";

export class OrderItemRepository implements IOrderItemRepository {
  private pool: Pool;

  constructor(private db: Database) {
    this.pool = this.db.getPool();
  }

  async createMany(items: OrderItem[]): Promise<void> {
    if (items.length === 0) return;

    const values = items.map((item) => [
      item.id,
      item.orderId,
      item.productId,
      item.productName,
      item.quantity,
      item.unitPrice,
      item.totalPrice,
    ]);

    const query = `
      INSERT INTO order_items (
        id, order_id, product_id, product_name, quantity, unit_price, total_price
      ) VALUES ?
    `;

    await this.pool.query(query, [values]);
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const query = "SELECT * FROM order_items WHERE order_id = ?";
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [orderId]);
    return rows.map((row) => this.mapToEntity(row));
  }

  private mapToEntity(row: any): OrderItem {
    return {
      id: row.id,
      orderId: row.order_id,
      productId: row.product_id,
      productName: row.product_name,
      quantity: row.quantity,
      unitPrice: parseFloat(row.unit_price),
      totalPrice: parseFloat(row.total_price),
    };
  }
}
