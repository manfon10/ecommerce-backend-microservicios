import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ListOrdersUseCase, GetOrderUseCase, CreateOrderUseCase } from "../application/use-cases";
import { ORDER_REPOSITORY } from "../domain/repositories";

import { CATALOG_CLIENT } from "./clients/catalog.client";
import { CatalogRabbitmqClient } from "./clients/catalog.rabbitmq.client";

import { OrdersHttpController } from "./controllers/http";
import { OrdersMessagingController } from "./controllers/messaging";

import { OrderTypeOrmRepository } from "./persistence/repositories";
import { OrderEntity, OrderItemEntity } from "./persistence/schemas";

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity])],
  controllers: [OrdersHttpController, OrdersMessagingController],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: OrderTypeOrmRepository },
    { provide: CATALOG_CLIENT, useClass: CatalogRabbitmqClient },

    ListOrdersUseCase,
    GetOrderUseCase,
    CreateOrderUseCase,
  ],
})
export class OrdersModule {}
