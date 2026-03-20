import { OrderItemDto } from "./create-order-item.dto";

export class CreateOrderDto {
  customer_name: string;
  customer_email: string;
  items: OrderItemDto[];
}
