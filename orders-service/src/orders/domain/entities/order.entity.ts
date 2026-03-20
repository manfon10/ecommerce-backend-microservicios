import { OrderItem } from "./order-item.entity";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export class Order {
  constructor(
    public customer_name: string,
    public customer_email: string,
    public status: OrderStatus,
    public total: number,
    public items: OrderItem[],
    public created_at?: Date,
    public updated_at?: Date,
    public readonly id?: string,
  ) {}

  static calculateTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  }

  static fromObject(object: { [key: string]: any }): Order {
    const { id, customer_name, customer_email, status, total, items, created_at, updated_at } = object;

    return new Order(customer_name, customer_email, status, total, items, created_at, updated_at, id);
  }
}
