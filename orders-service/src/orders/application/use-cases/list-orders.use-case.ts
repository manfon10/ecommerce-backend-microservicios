import { Inject, Injectable } from "@nestjs/common";
import { Order } from "../../domain/entities/order.entity";
import { OrderRepository, ORDER_REPOSITORY } from "../../domain/repositories/order.repository";

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
