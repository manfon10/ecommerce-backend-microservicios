import { Inject, Injectable } from "@nestjs/common";

import { Product } from "src/products/domain/entities";
import { PRODUCT_REPOSITORY, ProductRepository } from "src/products/domain/repositories";

@Injectable()
export class GetAllProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
