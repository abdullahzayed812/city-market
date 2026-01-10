import { Pool, RowDataPacket } from "mysql2/promise";
import { Delivery } from "../../core/entities/delivery.entity";
import { IDeliveryRepository } from "../../core/interfaces/delivery.repository";

export class DeliveryRepository implements IDeliveryRepository {
  constructor(private pool: Pool) {}

  async create(delivery: Delivery): Promise<Delivery> {
    const query = `
      INSERT INTO deliveries (
        id, order_id, status, pickup_address, delivery_address,
        pickup_latitude, pickup_longitude, delivery_latitude, delivery_longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await this.pool.execute(query, [
      delivery.id,
      delivery.orderId,
      delivery.status,
      delivery.pickupAddress,
      delivery.deliveryAddress,
      delivery.pickupLatitude || null,
      delivery.pickupLongitude || null,
      delivery.deliveryLatitude || null,
      delivery.deliveryLongitude || null,
    ]);
    return delivery;
  }

  async findById(id: string): Promise<Delivery | null> {
    const query = "SELECT * FROM deliveries WHERE id = ?";
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [id]);
    return rows.length > 0 ? this.mapToEntity(rows[0]) : null;
  }

  async findByOrderId(orderId: string): Promise<Delivery | null> {
    const query = "SELECT * FROM deliveries WHERE order_id = ?";
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [orderId]);
    return rows.length > 0 ? this.mapToEntity(rows[0]) : null;
  }

  async findByCourier(courierId: string, limit: number, offset: number): Promise<Delivery[]> {
    const query = `
      SELECT * FROM deliveries 
      WHERE courier_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [courierId, limit, offset]);
    return rows.map((row) => this.mapToEntity(row));
  }

  async findPending(): Promise<Delivery[]> {
    const query = 'SELECT * FROM deliveries WHERE status = "PENDING" ORDER BY created_at';
    const [rows] = await this.pool.execute<RowDataPacket[]>(query);
    return rows.map((row) => this.mapToEntity(row));
  }

  async findByStatus(status: string): Promise<Delivery[]> {
    const query = "SELECT * FROM deliveries WHERE status = ? ORDER BY created_at DESC";
    const [rows] = await this.pool.execute<RowDataPacket[]>(query, [status]);
    return rows.map((row) => this.mapToEntity(row));
  }

  async update(id: string, data: Partial<Delivery>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.status) {
      fields.push("status = ?");
      values.push(data.status);
    }
    if (data.notes !== undefined) {
      fields.push("notes = ?");
      values.push(data.notes);
    }
    if (data.pickedUpAt) {
      fields.push("picked_up_at = ?");
      values.push(data.pickedUpAt);
    }
    if (data.deliveredAt) {
      fields.push("delivered_at = ?");
      values.push(data.deliveredAt);
    }

    if (fields.length === 0) return;

    values.push(id);
    const query = `UPDATE deliveries SET ${fields.join(", ")} WHERE id = ?`;
    await this.pool.execute(query, values);
  }

  async assignCourier(id: string, courierId: string): Promise<void> {
    const query = 'UPDATE deliveries SET courier_id = ?, status = "ASSIGNED", assigned_at = NOW() WHERE id = ?';
    await this.pool.execute(query, [courierId, id]);
  }

  private mapToEntity(row: any): Delivery {
    return {
      id: row.id,
      orderId: row.order_id,
      courierId: row.courier_id,
      status: row.status,
      pickupAddress: row.pickup_address,
      deliveryAddress: row.delivery_address,
      pickupLatitude: row.pickup_latitude,
      pickupLongitude: row.pickup_longitude,
      deliveryLatitude: row.delivery_latitude,
      deliveryLongitude: row.delivery_longitude,
      assignedAt: row.assigned_at,
      pickedUpAt: row.picked_up_at,
      deliveredAt: row.delivered_at,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
