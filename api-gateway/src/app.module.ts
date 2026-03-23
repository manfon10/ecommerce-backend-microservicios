import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ProductsProxyController } from "./products-proxy.controller";
import { OrdersProxyController } from "./orders-proxy.controller";

const RABBITMQ_URL = process.env.RABBITMQ_URL ?? "amqp://admin:admin@localhost:5672";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ClientsModule.register([
      {
        name: "CATALOG_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: "catalog_queue",
          queueOptions: { durable: true },
        },
      },
      {
        name: "ORDERS_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: "orders_queue",
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [ProductsProxyController, OrdersProxyController],
})
export class AppModule {}
