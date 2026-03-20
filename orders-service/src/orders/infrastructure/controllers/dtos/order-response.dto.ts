import { ApiProperty } from "@nestjs/swagger";

import { OrderStatus } from "src/orders/domain/entities";

export class OrderItemResponseDto {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  id: string;

  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  product_id: string;

  @ApiProperty({ example: "Laptop Dell XPS 15" })
  product_name: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 1299.99, description: "Price at time of order" })
  unitPrice: number;
}

export class OrderResponseDto {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  id: string;

  @ApiProperty({ example: "Juan Pérez" })
  customer_name: string;

  @ApiProperty({ example: "juan@email.com" })
  customer_email: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ example: 2599.98 })
  total: number;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ example: "2024-01-15T10:30:00.000Z" })
  created_at: Date;
}
