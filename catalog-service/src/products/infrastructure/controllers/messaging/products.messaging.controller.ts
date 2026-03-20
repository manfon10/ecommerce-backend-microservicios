import { Controller } from "@nestjs/common";
import { MessagePattern, Payload, Ctx, RmqContext, EventPattern } from "@nestjs/microservices";

import {
  GetAllProductsUseCase,
  GetProductUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  ValidateStockUseCase,
  DecreateStockUseCase,
} from "src/products/application/use-cases";

import { CreateProductDto, UpdateProductDto } from "../dtos";

@Controller()
export class ProductsMessagingController {
  constructor(
    private readonly listProducts: GetAllProductsUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly createProduct: CreateProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly validateStock: ValidateStockUseCase,
    private readonly decreaseStock: DecreateStockUseCase,
  ) {}

  @MessagePattern("catalog.products.findAll")
  async handleFindAll() {
    return await this.listProducts.execute();
  }

  @MessagePattern("catalog.products.findOne")
  async handleFindOne(@Payload() data: { id: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const product = await this.getProduct.execute(data.id);

      channel.ack(message);

      return product;
    } catch (error) {
      channel.ack(message);
      throw error;
    }
  }

  @MessagePattern("catalog.products.create")
  async handleCreate(@Payload() dto: CreateProductDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.createProduct.execute(dto);

      channel.ack(message);

      return result;
    } catch (error) {
      channel.ack(message);

      throw error;
    }
  }

  @MessagePattern("catalog.products.update")
  async handleUpdate(@Payload() data: { id: string; dto: UpdateProductDto }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.updateProduct.execute(data.id, data.dto);

      channel.ack(message);

      return result;
    } catch (error) {
      channel.ack(message);

      throw error;
    }
  }

  @MessagePattern("catalog.products.validateStock")
  async handleValidateStock(@Payload() data: { id: string; quantity: number }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.validateStock.execute(data.id, data.quantity);

      channel.ack(message);

      return result;
    } catch (error) {
      channel.ack(message);

      throw error;
    }
  }

  @EventPattern("order.created")
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await Promise.all(data.items.map((item) => this.decreaseStock.execute(item.product_id, item.quantity)));

      channel.ack(message);
    } catch (error) {
      console.error("Error processing order.created", error);

      channel.nack(message, false, false);
    }
  }
}
