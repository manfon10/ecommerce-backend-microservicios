import { Order } from "../entities/order.entity";

export interface OrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  create(order: Order): Promise<Order>;
}

export const ORDER_REPOSITORY = "ORDER_REPOSITORY";
