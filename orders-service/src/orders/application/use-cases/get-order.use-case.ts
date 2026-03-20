import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Order } from "../../domain/entities/order.entity";
import { OrderRepository, ORDER_REPOSITORY } from "../../domain/repositories/order.repository";

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) throw new NotFoundException(`Order ${id} not found`);

    return order;
  }
}
