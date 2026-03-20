import { OrderItemDto } from "./order-item.type";

export interface CreateOrderDto {
  customer_name: string;
  customer_email: string;
  items: OrderItemDto[];
}
