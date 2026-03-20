import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PRODUCT_REPOSITORY, ProductRepository } from "src/products/domain/repositories";

@Injectable()
export class DecreateStockUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) throw new NotFoundException(`Product ${id} not found`);

    await this.productRepository.decreaseStock(id, quantity);
  }
}
