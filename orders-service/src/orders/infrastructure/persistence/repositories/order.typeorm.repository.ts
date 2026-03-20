import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Order } from "src/orders/domain/entities";
import { OrderRepository } from "src/orders/domain/repositories";

import { OrderEntity } from "../schemas";

@Injectable()
export class OrderTypeOrmRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository
      .createQueryBuilder("order")
      .innerJoin("order.items", "items")
      .select([
        "order.id",
        "order.customer_name",
        "order.customer_email",
        "order.status",
        "order.total",
        "order.created_at",
        "order.updated_at",

        "items.id",
        "items.quantity",
        "items.unit_price",
        "items.product_name",
      ])
      .getMany();

    return orders.map(Order.fromObject);
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.orderRepository
      .createQueryBuilder("order")
      .innerJoin("order.items", "items")
      .select([
        "order.id",
        "order.customer_name",
        "order.customer_email",
        "order.status",
        "order.total",
        "order.created_at",
        "order.updated_at",

        "items.id",
        "items.quantity",
        "items.unit_price",
        "items.product_name",
      ])
      .where("order.id = :id", { id })
      .getOne();

    return order ? Order.fromObject(order) : null;
  }

  async create(order: Order): Promise<Order> {
    const row = this.orderRepository.create({
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      status: order.status,
      total: order.total,
      items: order.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        product_name: item.product_name,
        unit_price: item.unit_price,
      })),
    });

    const orderSaved = await this.orderRepository.save(row);

    return Order.fromObject(orderSaved);
  }
}
