import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

import { OrderEntity } from "./order.entity";

@Entity("order_items")
export class OrderItemEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "product_id" })
  product_id: string;

  @Column({ type: "text", name: "product_name" })
  product_name: string;

  @Column({ type: "int", name: "quantity" })
  quantity: number;

  @Column({ type: "int", name: "unit_price" })
  unit_price: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  order: OrderEntity;
}
