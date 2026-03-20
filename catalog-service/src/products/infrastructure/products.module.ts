import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import {
  GetAllProductsUseCase,
  GetProductUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  ValidateStockUseCase,
  DecreateStockUseCase,
} from "../application/use-cases";

import { PRODUCT_REPOSITORY } from "../domain/repositories";
import { ProductsHttpController } from "./controllers/http";
import { ProductsMessagingController } from "./controllers/messaging";

import { ProductTypeOrmRepository } from "./persistence/repositories";
import { ProductEntity } from "./persistence/schemas";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductsHttpController, ProductsMessagingController],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: ProductTypeOrmRepository },

    GetAllProductsUseCase,
    GetProductUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    ValidateStockUseCase,
    DecreateStockUseCase,
  ],
})
export class ProductsModule {}
