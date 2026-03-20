import { Inject, Injectable } from "@nestjs/common";

import { Product } from "src/products/domain/entities";
import { PRODUCT_REPOSITORY, ProductRepository } from "src/products/domain/repositories";

import { CreateProductDto } from "../../infrastructure/controllers/dtos";

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  execute(dto: CreateProductDto): Promise<Product> {
    const { name, price, stock, description } = dto;

    return this.productRepository.create({ description, name, price, stock });
  }
}
