import { Injectable, OnModuleInit, BadGatewayException } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";

import { CatalogClient, ProductInfo } from "./catalog.client";
import { OrderItemDto } from "../controllers/dtos";

@Injectable()
export class CatalogRabbitmqClient implements CatalogClient, OnModuleInit {
  private client: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? "amqp://admin:admin@localhost:5672"],
        queue: "catalog_queue",
        queueOptions: { durable: true },
      },
    });
  }

  async getProduct(product_id: string): Promise<ProductInfo> {
    try {
      return await firstValueFrom(
        this.client.send<ProductInfo>("catalog.products.findOne", { id: product_id }).pipe(timeout(5000)),
      );
    } catch {
      throw new BadGatewayException(`Could not reach catalog service for product ${product_id}`);
    }
  }

  orderCreated(items: OrderItemDto[]): void {
    try {
      this.client.emit("order.created", { items });
    } catch {
      throw new BadGatewayException("Failed to emit");
    }
  }

  async validateStock(product_id: string, quantity: number): Promise<void> {
    try {
      await firstValueFrom(
        this.client.send("catalog.products.validateStock", { id: product_id, quantity }).pipe(timeout(5000)),
      );
    } catch (error) {
      throw new BadGatewayException(error?.message ?? "Stock validation failed");
    }
  }
}
