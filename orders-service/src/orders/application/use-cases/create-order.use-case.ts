import { Inject, Injectable } from "@nestjs/common";
import { Order, OrderStatus } from "../../domain/entities/order.entity";

import { CatalogClient, CATALOG_CLIENT } from "../../infrastructure/clients/catalog.client";

import { CreateOrderDto } from "../dtos";
import { ORDER_REPOSITORY, OrderRepository } from "src/orders/domain/repositories";

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,

    @Inject(CATALOG_CLIENT)
    private readonly catalog: CatalogClient,
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    await Promise.all(dto.items.map((item) => this.catalog.validateStock(item.product_id, item.quantity)));

    const products = await Promise.all(dto.items.map((item) => this.catalog.getProduct(item.product_id)));

    const productMap = new Map(products.map((product) => [product.id, product]));

    const orderItems = dto.items.map((item) => {
      const product = productMap.get(item.product_id);

      return {
        product_id: item.product_id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.price,
      };
    });

    const order = await this.orderRepository.create({
      customer_email: dto.customer_email,
      customer_name: dto.customer_name,
      status: OrderStatus.PENDING,
      total: Order.calculateTotal(orderItems),
      items: orderItems,
    });

    const items = orderItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    this.catalog.orderCreated(items);

    return this.orderRepository.findById(order.id);
  }
}
