import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { Product } from "src/products/domain/entities";
import { PRODUCT_REPOSITORY, ProductRepository } from "src/products/domain/repositories";

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) throw new NotFoundException(`Product ${id} not found`);

    return product;
  }
}
