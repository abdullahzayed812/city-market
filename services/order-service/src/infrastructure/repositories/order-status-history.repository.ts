import { Pool, RowDataPacket } from "mysql2/promise";
import { OrderStatusHistory } from "../../core/entities/order-status-history.entity";
import { IOrderStatusHistoryRepository } from "../../core/interfaces/order-status-history.repository";
import { Database } from "@city-market/shared";

export class OrderStatusHistoryRepository implements IOrderStatusHistoryRepository {
  private pool: Pool;

  constructor(private db: Database) {
    this.pool = this.db.getPool();
  }

  async create(history: OrderStatusHistory): Promise<void> {
    const query = `
      INSERT INTO order_status_history (id, order_id, status, notes)
      VALUES (?, ?, ?, ?)
    `;
    await this.pool.execute(query, [history.id, history.orderId, history.status, history.notes || null]);
  }

  async findByOrderId(orderId: string): Promise<OrderStatusHistory[]> {
    const query = "SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at";
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [orderId]);
    return rows.map((row) => this.mapToEntity(row));
  }

  private mapToEntity(row: any): OrderStatusHistory {
    return {
      id: row.id,
      orderId: row.order_id,
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at,
    };
  }
}
