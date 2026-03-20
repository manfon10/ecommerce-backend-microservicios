import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { OrderItemEntity } from "./order-item.entity";
import { OrderStatus } from "../../../domain/entities/order.entity";

@Entity("orders")
export class OrderEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  customer_name: string;

  @Column()
  customer_email: string;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: "int", name: "total" })
  total: number;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItemEntity[];

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  deleted_at?: Date;
}
