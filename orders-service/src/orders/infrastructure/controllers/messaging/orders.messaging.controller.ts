import { Controller } from "@nestjs/common";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";

import { ListOrdersUseCase, GetOrderUseCase, CreateOrderUseCase } from "src/orders/application/use-cases";

import { CreateOrderDto } from "../dtos";

@Controller()
export class OrdersMessagingController {
  constructor(
    private readonly listOrders: ListOrdersUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly createOrder: CreateOrderUseCase,
  ) {}

  @MessagePattern("orders.findAll")
  async handleFindAll(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.listOrders.execute();

      channel.ack(message);

      return result;
    } catch (error) {
      channel.ack(message);

      throw error;
    }
  }

  @MessagePattern("orders.findOne")
  async handleFindOne(@Payload() data: { id: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.getOrder.execute(data.id);

      channel.ack(message);

      return result;
    } catch (error) {
      channel.ack(message);

      throw error;
    }
  }

  @MessagePattern("orders.create")
  async handleCreate(@Payload() dto: CreateOrderDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.createOrder.execute(dto);

      channel.ack(message);

      return result;
    } catch (error) {
      channel.ack(message);

      throw error;
    }
  }
}
