import { OrderItem } from "./order-item.type";

export type OrderStatus = "pending" | "confirmed" | "cancelled";

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}
